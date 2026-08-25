import s3Client from "../config/s3";
import s3Repository from "../repositories/s3.repository";
import fileService from "../services/file.service";

// Mock the S3Client send method
jest.mock("../config/s3", () => {
    return {
        send: jest.fn()
    };
});

describe("File Upload and S3 Repository", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = {
            ...originalEnv,
            AWS_S3_BUCKET_NAME: "test-bucket",
            AWS_REGION: "us-east-1"
        };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe("s3.repository - uploadFile", () => {
        it("should upload a file buffer to S3 and return public URL", async () => {
            s3Client.send.mockResolvedValue({});

            const buffer = Buffer.from("dummy-image-data");
            const fileName = "images/test-file.png";
            const mimeType = "image/png";

            const result = await s3Repository.uploadFile(buffer, fileName, mimeType);

            expect(s3Client.send).toHaveBeenCalled();
            expect(result).toEqual("https://test-bucket.s3.us-east-1.amazonaws.com/images/test-file.png");
        });

        it("should throw an error if AWS_S3_BUCKET_NAME is missing", async () => {
            delete process.env.AWS_S3_BUCKET_NAME;

            const buffer = Buffer.from("dummy-image-data");
            const fileName = "images/test-file.png";
            const mimeType = "image/png";

            await expect(s3Repository.uploadFile(buffer, fileName, mimeType))
                .rejects.toThrow("AWS_S3_BUCKET_NAME không được cấu hình");
        });

        it("should propagate S3 SDK errors", async () => {
            s3Client.send.mockRejectedValue(new Error("AWS Connection Error"));

            const buffer = Buffer.from("dummy-image-data");
            const fileName = "images/test-file.png";
            const mimeType = "image/png";

            await expect(s3Repository.uploadFile(buffer, fileName, mimeType))
                .rejects.toThrow("S3 tải file thất bại: AWS Connection Error");
        });
    });

    describe("s3.repository - deleteFile", () => {
        it("should delete an object from S3 successfully", async () => {
            s3Client.send.mockResolvedValue({});

            const result = await s3Repository.deleteFile("images/test-file.png");

            expect(s3Client.send).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("should throw an error if AWS_S3_BUCKET_NAME is missing on delete", async () => {
            delete process.env.AWS_S3_BUCKET_NAME;

            await expect(s3Repository.deleteFile("images/test-file.png"))
                .rejects.toThrow("AWS_S3_BUCKET_NAME không được cấu hình");
        });

        it("should propagate S3 SDK errors on delete", async () => {
            s3Client.send.mockRejectedValue(new Error("Access Denied"));

            await expect(s3Repository.deleteFile("images/test-file.png"))
                .rejects.toThrow("S3 xóa file thất bại: Access Denied");
        });
    });

    describe("file.service - uploadImage", () => {
        it("should validate and upload an image, generating a unique filename", async () => {
            const uploadFileSpy = jest.spyOn(s3Repository, "uploadFile")
                .mockResolvedValue("https://test-bucket.s3.us-east-1.amazonaws.com/images/random-name.png");

            const mockFile = {
                originalname: "my-photo.png",
                mimetype: "image/png",
                buffer: Buffer.from("my-photo-data")
            };

            const result = await fileService.uploadImage(mockFile);

            expect(uploadFileSpy).toHaveBeenCalledWith(
                mockFile.buffer,
                expect.stringMatching(/^images\/[a-f0-9-]{36}\.jpg$/),
                "image/png"
            );
            expect(result).toEqual("https://test-bucket.s3.us-east-1.amazonaws.com/images/random-name.png");

            uploadFileSpy.mockRestore();
        });

        it("should throw error if file is missing", async () => {
            await expect(fileService.uploadImage(null))
                .rejects.toThrow("Không có file nào được tải lên");
        });
    });

    describe("file.service - deleteImage", () => {
        it("should parse S3 URL and delete file", async () => {
            const deleteFileSpy = jest.spyOn(s3Repository, "deleteFile").mockResolvedValue(true);

            const result = await fileService.deleteImage("https://test-bucket.s3.us-east-1.amazonaws.com/images/test.jpg");

            expect(deleteFileSpy).toHaveBeenCalledWith("images/test.jpg");
            expect(result).toBe(true);

            deleteFileSpy.mockRestore();
        });

        it("should return false if url is null or invalid", async () => {
            expect(await fileService.deleteImage(null)).toBe(false);
            expect(await fileService.deleteImage("https://invalid-url.com")).toBe(false);
        });
    });
});
