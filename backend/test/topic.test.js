import TopicRepository from "../repositories/topic.repository";
import PlaylistRepository from "../repositories/playlist.repository";
import PlaylistTopicRepository from "../repositories/playlist_topic.repository";
import topicService from "../services/topic.service";

jest.mock("../repositories/topic.repository");
jest.mock("../repositories/playlist.repository");
jest.mock("../repositories/playlist_topic.repository");

describe("Topic Service - addPlaylistToTopic & removePlaylistFromTopic", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("addPlaylistToTopic", () => {
        it("should throw error if topicId or playlistId is missing", async () => {
            await expect(topicService.addPlaylistToTopic(null, 1))
                .rejects.toThrow("topicId và playlistId là bắt buộc");
        });

        it("should throw error if topic does not exist", async () => {
            TopicRepository.getTopicById.mockResolvedValue(null);

            await expect(topicService.addPlaylistToTopic(1, 2))
                .rejects.toThrow("Không tìm thấy chủ đề");
        });

        it("should throw error if playlist does not exist", async () => {
            TopicRepository.getTopicById.mockResolvedValue({ id: 1, topicName: "Pop" });
            PlaylistRepository.getPlaylistById.mockResolvedValue(null);

            await expect(topicService.addPlaylistToTopic(1, 2))
                .rejects.toThrow("Không tìm thấy playlist");
        });

        it("should throw error if playlist is already added to topic", async () => {
            TopicRepository.getTopicById.mockResolvedValue({ id: 1, topicName: "Pop" });
            PlaylistRepository.getPlaylistById.mockResolvedValue({ id: 2, playlistName: "My Hits" });
            PlaylistTopicRepository.findPlaylistTopic.mockResolvedValue({ topicId: 1, playlistId: 2 });

            await expect(topicService.addPlaylistToTopic(1, 2))
                .rejects.toThrow("Playlist đã tồn tại trong chủ đề này");
        });

        it("should add playlist to topic successfully", async () => {
            TopicRepository.getTopicById.mockResolvedValue({ id: 1, topicName: "Pop" });
            PlaylistRepository.getPlaylistById.mockResolvedValue({ id: 2, playlistName: "My Hits" });
            PlaylistTopicRepository.findPlaylistTopic.mockResolvedValue(null);
            TopicRepository.addPlaylistToTopic.mockResolvedValue({ topicId: 1, playlistId: 2 });

            const result = await topicService.addPlaylistToTopic(1, 2);

            expect(TopicRepository.addPlaylistToTopic).toHaveBeenCalledWith(1, 2);
            expect(result).toEqual({ topicId: 1, playlistId: 2 });
        });
    });

    describe("removePlaylistFromTopic", () => {
        it("should throw error if topicId or playlistId is missing", async () => {
            await expect(topicService.removePlaylistFromTopic(1, null))
                .rejects.toThrow("topicId và playlistId là bắt buộc");
        });

        it("should throw error if topic does not exist", async () => {
            TopicRepository.getTopicById.mockResolvedValue(null);

            await expect(topicService.removePlaylistFromTopic(1, 2))
                .rejects.toThrow("Không tìm thấy chủ đề");
        });

        it("should throw error if playlist does not exist", async () => {
            TopicRepository.getTopicById.mockResolvedValue({ id: 1, topicName: "Pop" });
            PlaylistRepository.getPlaylistById.mockResolvedValue(null);

            await expect(topicService.removePlaylistFromTopic(1, 2))
                .rejects.toThrow("Không tìm thấy playlist");
        });

        it("should throw error if playlist is not in topic", async () => {
            TopicRepository.getTopicById.mockResolvedValue({ id: 1, topicName: "Pop" });
            PlaylistRepository.getPlaylistById.mockResolvedValue({ id: 2, playlistName: "My Hits" });
            PlaylistTopicRepository.findPlaylistTopic.mockResolvedValue(null);

            await expect(topicService.removePlaylistFromTopic(1, 2))
                .rejects.toThrow("Playlist không thuộc chủ đề này");
        });

        it("should remove playlist from topic successfully", async () => {
            TopicRepository.getTopicById.mockResolvedValue({ id: 1, topicName: "Pop" });
            PlaylistRepository.getPlaylistById.mockResolvedValue({ id: 2, playlistName: "My Hits" });
            PlaylistTopicRepository.findPlaylistTopic.mockResolvedValue({ topicId: 1, playlistId: 2 });
            TopicRepository.removePlaylistFromTopic.mockResolvedValue(1);

            const result = await topicService.removePlaylistFromTopic(1, 2);

            expect(TopicRepository.removePlaylistFromTopic).toHaveBeenCalledWith(1, 2);
            expect(result).toEqual({ topicId: 1, playlistId: 2 });
        });
    });
});
