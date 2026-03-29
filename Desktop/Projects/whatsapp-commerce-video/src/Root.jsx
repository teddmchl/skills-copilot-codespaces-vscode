import { Composition } from 'remotion';
import { DemoVideo } from './DemoVideo';

// 1800 frames @ 30fps = 60 seconds
// Portrait 1080×1920 — optimised for Twitter/X, LinkedIn, Instagram Reels
export const RemotionRoot = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
