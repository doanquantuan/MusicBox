import ArtistRepository from "../repositories/artist.repository";
import FileService from "../services/file.service";
import db from "../models";
import artistService from "../services/artist.service";

// Mock the dependencies
jest.mock("../repositories/artist.repository");
jest.mock("../services/file.service");
jest.mock("../models", () => {
    const mTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
    };
    const mSequelize = {
        transaction: jest.fn(() => Promise.resolve(mTransaction))
    };
    return {
        sequelize: mSequelize,
        Artist: {}
    };
});

describe("Artist Service - updateArtist", () => {
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTransaction = {
            commit: jest.fn().mockResolvedValue(),
            rollback: jest.fn().mockResolvedValue()
        };
        db.sequelize.transaction.mockResolvedValue(mockTransaction);
    });

    it("should throw an error if the artist does not exist", async () => {
        ArtistRepository.getArtistById.mockResolvedValue(null);

        await expect(artistService.updateArtist(1, { artistName: "Non-existent" }, null))
            .rejects.toThrow("Nghệ sĩ không tồn tại");

        expect(ArtistRepository.getArtistById).toHaveBeenCalledWith(1);
    });

    it("should update artist successfully without a new image", async () => {
        const mockArtist = { id: 1, artistName: "Old Name", imageUrl: "old-img.png" };
        ArtistRepository.getArtistById.mockResolvedValue(mockArtist);
        ArtistRepository.updateArtist.mockResolvedValue([1]);

        const result = await artistService.updateArtist(1, { artistName: "New Name" }, null);

        expect(FileService.uploadImage).not.toHaveBeenCalled();
        expect(db.sequelize.transaction).toHaveBeenCalled();
        expect(ArtistRepository.updateArtist).toHaveBeenCalledWith(
            1,
            { artistName: "New Name", imageUrl: "old-img.png" },
            { transaction: mockTransaction }
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });

    it("should update artist successfully and delete old image if new image is uploaded successfully", async () => {
        const mockArtist = { id: 1, artistName: "Old Name", imageUrl: "old-img.png" };
        ArtistRepository.getArtistById.mockResolvedValue(mockArtist);
        ArtistRepository.updateArtist.mockResolvedValue([1]);
        FileService.uploadImage.mockResolvedValue("new-img.png");

        const mockFile = { originalname: "new.png", buffer: Buffer.from("data"), mimetype: "image/png" };

        const result = await artistService.updateArtist(1, { artistName: "New Name" }, mockFile);

        expect(FileService.uploadImage).toHaveBeenCalledWith(mockFile);
        expect(ArtistRepository.updateArtist).toHaveBeenCalledWith(
            1,
            { artistName: "New Name", imageUrl: "new-img.png" },
            { transaction: mockTransaction }
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(FileService.deleteImage).toHaveBeenCalledWith("old-img.png");
    });

    it("should fallback to old image URL if new image upload fails, and still commit DB updates", async () => {
        const mockArtist = { id: 1, artistName: "Old Name", imageUrl: "old-img.png" };
        ArtistRepository.getArtistById.mockResolvedValue(mockArtist);
        ArtistRepository.updateArtist.mockResolvedValue([1]);
        FileService.uploadImage.mockRejectedValue(new Error("S3 Error"));

        const mockFile = { originalname: "new.png", buffer: Buffer.from("data"), mimetype: "image/png" };

        const result = await artistService.updateArtist(1, { artistName: "New Name" }, mockFile);

        expect(FileService.uploadImage).toHaveBeenCalledWith(mockFile);
        // Fallback to old image URL
        expect(ArtistRepository.updateArtist).toHaveBeenCalledWith(
            1,
            { artistName: "New Name", imageUrl: "old-img.png" },
            { transaction: mockTransaction }
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(FileService.deleteImage).not.toHaveBeenCalled(); // old image is NOT deleted
    });

    it("should roll back DB transaction and delete newly uploaded image if DB update fails", async () => {
        const mockArtist = { id: 1, artistName: "Old Name", imageUrl: "old-img.png" };
        ArtistRepository.getArtistById.mockResolvedValue(mockArtist);
        FileService.uploadImage.mockResolvedValue("new-img.png");
        ArtistRepository.updateArtist.mockRejectedValue(new Error("DB Connection Lost"));

        const mockFile = { originalname: "new.png", buffer: Buffer.from("data"), mimetype: "image/png" };

        await expect(artistService.updateArtist(1, { artistName: "New Name" }, mockFile))
            .rejects.toThrow("Cập nhật nghệ sĩ thất bại: DB Connection Lost");

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockTransaction.commit).not.toHaveBeenCalled();
        // The newly uploaded S3 image should be deleted to prevent orphaned S3 file
        expect(FileService.deleteImage).toHaveBeenCalledWith("new-img.png");
        // The old image is NOT deleted
        expect(FileService.deleteImage).not.toHaveBeenCalledWith("old-img.png");
    });
});
