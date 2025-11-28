jest.mock("googleapis", () => {
  return {
    google: {
      youtube: () => ({
        search: {
          list: jest.fn().mockResolvedValue({
            data: {
              items: [
                { id: { videoId: "abc123" } },
                { id: { videoId: "xyz789" } },
              ],
            },
          }),
        },
      }),
    },
  };
});

const getVideos = require("../utils/youtube.helper.js");

describe("getVideos", () => {
  it("should return formatted YouTube video URLs", async () => {
    const videos = await getVideos("cats");

    expect(videos).toEqual([
      "https://www.youtube.com/watch?v=abc123",
      "https://www.youtube.com/watch?v=xyz789",
    ]);

    expect(videos.length).toBe(2);
  });
});
