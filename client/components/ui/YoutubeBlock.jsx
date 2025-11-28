import React from "react";
import ReactPlayer from "react-player";

const YoutubeBlock = ({ videos }) => {
  if (!Array.isArray(videos) || videos.length === 0) return null;

  return (
    <div className="flex flex-col justify-center border-0 shadow-none px-10">
      <h2 className="text-2xl font-semibold mb-6">Youtube Videos</h2>

      {videos.map((url, idx) => (
        <div key={idx} className="my-5 left-0 right-0 flex justify-center">
          <div className="w-3/4  aspect-video rounded-xl overflow-hidden">
            <ReactPlayer
              src={url}
              width="100%"
              height="100%"
              controls
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default YoutubeBlock;
