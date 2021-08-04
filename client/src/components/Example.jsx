import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const TEST_VIDEO_SRC = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';

const getMedia = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(TEST_VIDEO_SRC);
  }, 2000);
});

const Example = () => {
  const [url, setUrl] = useState(null);
  return (
    <section>
      <div onClick={() => getMedia().then(setUrl)}>
        Play Video
      </div>
      <ReactPlayer
        url={url}
        playsinline
        playing={!!url}
        onError={error => console.log(error)}
      />
    </section>
  );
};

export default Example;
