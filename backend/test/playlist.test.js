import PlaylistRepository from "../repositories/playlist.repository";
import FileService from "../services/file.service";
import db from "../models";
import playlistService from "../services/playlist.service";

jest.mock("../repositories/playlist.repository");
jest.mock("../repositories/playlist_song.repository");
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
        Playlist: {}
    };
});

describe("Playlist Service - updatePlaylist", () => {
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTransaction = {
            commit: jest.fn().mockResolvedValue(),
            rollback: jest.fn().mockResolvedValue()
        };
        db.sequelize.transaction.mockResolvedValue(mockTransaction);
    });

    it("should throw an error if the playlist does not exist", async () => {
        PlaylistRepository.getPlaylistById.mockResolvedValue(null);

        await expect(playlistService.updatePlaylist(1, { playlistName: "New Name" }, null, 99))
            .rejects.toThrow("Không tìm thấy playlist");
    });

    it("should throw an error if user does not own the playlist", async () => {
        PlaylistRepository.getPlaylistById.mockResolvedValue({ id: 1, userId: 10, playlistName: "Old" });

        await expect(playlistService.updatePlaylist(1, { playlistName: "New Name" }, null, 1))
            .rejects.toThrow("Bạn không có quyền cập nhật playlist này");
    });

    it("should update playlist successfully without a new image", async () => {
        const mockPlaylist = { id: 1, userId: 1, playlistName: "Old Name", imageUrl: "old.png" };
        PlaylistRepository.getPlaylistById.mockResolvedValue(mockPlaylist);
        PlaylistRepository.updatePlaylist.mockResolvedValue([1]);

        const result = await playlistService.updatePlaylist(1, { playlistName: "New Name" }, null, 1);

        expect(db.sequelize.transaction).toHaveBeenCalled();
        expect(PlaylistRepository.updatePlaylist).toHaveBeenCalledWith(
            1,
            { playlistName: "New Name", imageUrl: "old.png" },
            { transaction: mockTransaction }
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it("should update playlist successfully with a new image and delete old image", async () => {
        const mockPlaylist = { id: 1, userId: 1, playlistName: "Old Name", imageUrl: "old.png" };
        PlaylistRepository.getPlaylistById.mockResolvedValue(mockPlaylist);
        PlaylistRepository.updatePlaylist.mockResolvedValue([1]);
        FileService.uploadImage.mockResolvedValue("new.png");

        const mockFile = { originalname: "new.png", path: "/tmp/new.png", mimetype: "image/png" };

        await playlistService.updatePlaylist(1, { playlistName: "New Name" }, mockFile, 1);

        expect(FileService.uploadImage).toHaveBeenCalledWith(mockFile);
        expect(PlaylistRepository.updatePlaylist).toHaveBeenCalledWith(
            1,
            { playlistName: "New Name", imageUrl: "new.png" },
            { transaction: mockTransaction }
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(FileService.deleteImage).toHaveBeenCalledWith("old.png");
    });
});
