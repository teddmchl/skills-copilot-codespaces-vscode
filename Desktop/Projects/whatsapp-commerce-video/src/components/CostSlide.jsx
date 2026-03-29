import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// Cost — 270 frames / 9s
// Three smash-cut confessions. No slide. No list. Just impact.
// Each occupies the full canvas. Hard cuts between.
// The rhythm: crash → hold → breathe → crash → hold → breathe → sting.

const Grain = ({ frame, opacity = 0.04 }) => {
  const ox = (frame * 41) % 256;
  const oy = (frame * 67) % 256;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 3px)',
        backgroundPosition: `${ox}px ${oy}px`,
        opacity,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// A single "confession" panel — number + sub-copy
// Appears with kinetic spring (overshoot = landing weight)
const Confession = ({
  frame,
  fps,
  startFrame,
  endFrame,
  big,          // e.g. "47"
  unit,         // e.g. "minutes"
  sub,          // e.g. "every day. just confirming M-Pesa."
  bigColor = '#FAFAFA',
  accent = '#FF6B2B',
}) => {
  const local = Math.max(0, frame - startFrame);

  // Impact spring — high mass creates pronounced overshoot (number "lands")
  const impS = spring({
    frame: local,
    fps,
    config: { stiffness: 500, damping: 20, mass: 2.8 },
    durationInFrames: 30,
  });
  const scale = interpolate(impS, [0, 1], [3.6, 1.0]);
  const bigOp = interpolate(impS, [0, 0.08], [0, 1]);

  // Sub-copy fades in with a slight delay after impact
  const subOp = interpolate(
    frame,
    [startFrame + 28, startFrame + 48],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade out before hard cut
  const cutOut = endFrame
    ? interpolate(frame, [endFrame - 10, endFrame], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const totalOp = bigOp * cutOut;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 88px',
        opacity: totalOp,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 52,
          height: 4,
          backgroundColor: accent,
          borderRadius: 2,
          marginBottom: 40,
        }}
      />

      {/* Big number + unit inline */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'left center',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 20,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 220,
            fontWeight: 900,
            color: bigColor,
            lineHeight: 0.85,
            letterSpacing: -10,
          }}
        >
          {big}
        </div>
        {unit && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 72,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.55)',
              paddingBottom: 28,
              letterSpacing: -1,
            }}
          >
            {unit}
          </div>
        )}
      </div>

      {/* Sub-copy */}
      <div
        style={{
          opacity: subOp,
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.5,
          letterSpacing: -0.5,
          maxWidth: 800,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

export const CostSlide = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Confession 1: frames 0–88 — "47 minutes"
  // Confession 2: frames 90–178 — "No records."
  // Beat 3: frames 180–225 — "It works."
  // Sting: frames 228–270 — ". Until it doesn't." (AMBER/RED)

  // Black frames between confessions (hard cut)
  const blackCut1 = frame >= 88 && frame <= 90;
  const blackCut2 = frame >= 178 && frame <= 182;
  const blackBeat = frame >= 225 && frame <= 228;

  const totalBlack = blackCut1 || blackCut2 || blackBeat ? 1 : 0;

  // Confession 3 "It works." — white text
  const c3Local = Math.max(0, frame - 182);
  const c3S = spring({ frame: c3Local, fps, config: { stiffness: 400, damping: 22, mass: 2 } });
  const c3Op = frame >= 182 && frame < 228
    ? interpolate(c3S, [0, 0.1], [0, 1])
    : 0;

  // Sting "Until it doesn't." — amber
  const stingLocal = Math.max(0, frame - 228);
  const stingS = spring({ frame: stingLocal, fps, config: { stiffness: 600, damping: 18, mass: 2.5 } });
  const stingScale = interpolate(stingS, [0, 1], [2.8, 1.0]);
  const stingOp = frame >= 228 ? interpolate(stingS, [0, 0.1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}>
      <Grain frame={frame} opacity={0.045} />

      {/* Warm side gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 10% 50%, rgba(255,107,43,0.05) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hard-cut black overlay */}
      {totalBlack > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 10,
          }}
        />
      )}

      {/* Confession 1: "47 minutes" */}
      {frame < 88 && (
        <Confession
          frame={frame}
          fps={fps}
          startFrame={0}
          endFrame={88}
          big="47"
          unit="minutes"
          sub="every day. just confirming M-Pesa."
        />
      )}

      {/* Confession 2: "No records." */}
      {frame >= 90 && frame < 178 && (
        <Confession
          frame={frame}
          fps={fps}
          startFrame={90}
          endFrame={178}
          big="Zero"
          unit=""
          sub={"no records. no data. no idea\nwhat sold — or to who."}
          bigColor="rgba(255,255,255,0.88)"
        />
      )}

      {/* Beat 3: "It works." — white, quiet before the sting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 88px',
          opacity: c3Op,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 140,
            fontWeight: 800,
            color: '#FAFAFA',
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          It works.
        </div>
      </div>

      {/* Sting: "Until it doesn't." — amber, kinetic */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 88px',
          opacity: stingOp,
        }}
      >
        <div
          style={{
            transform: `scale(${stingScale})`,
            transformOrigin: 'left center',
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 140,
              fontWeight: 900,
              color: '#FF6B2B',
              lineHeight: 0.9,
              letterSpacing: -5,
            }}
          >
            Until it
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 140,
              fontWeight: 900,
              color: '#FF6B2B',
              lineHeight: 0.9,
              letterSpacing: -5,
            }}
          >
            doesn't.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
