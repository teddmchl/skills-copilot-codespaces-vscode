import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// ImpactNumbers — 270 frames / 9s
// Three kinetic stat moments. Each fills the canvas.
// Hard cut → number CRASHES in (overshoot spring, 2.8 mass) → label breathes in → silence → cut.
// This is not a stats slide. This is a verdict.

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

// Segment: one full-canvas number moment
// startFrame / endFrame are LOCAL to this component
const Segment = ({
  frame,
  fps,
  startFrame,
  endFrame,
  number,    // e.g. "2"
  unit,      // e.g. "min"
  label,     // e.g. "average order time"
  sublabel,  // e.g. "vs 15–20 min manually"
  numColor = '#FAFAFA',
  accentColor = '#00A550',
  countFrom = null, // if set, count up from 0 to number
}) => {
  const local = Math.max(0, frame - startFrame);
  const windowActive = frame >= startFrame && frame < endFrame;

  // Hard entry spring — high mass = pronounced overshoot = physical landing
  const impS = spring({
    frame: local,
    fps,
    config: { stiffness: 580, damping: 19, mass: 3.2 },
    durationInFrames: 28,
  });
  const scale = interpolate(impS, [0, 1], [3.8, 1.0]);
  const numOp = interpolate(impS, [0, 0.07], [0, 1]);

  // Count-up (if applicable)
  const displayNum =
    countFrom !== null
      ? Math.round(
          interpolate(local, [0, 40], [countFrom, Number(number)], {
            extrapolateRight: 'clamp',
          })
        )
      : number;

  // Label breathes in after impact settles
  const labelOp = interpolate(
    frame,
    [startFrame + 26, startFrame + 46],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade out before hard cut
  const cutOp = interpolate(frame, [endFrame - 12, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (!windowActive) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 88px',
        opacity: cutOp,
      }}
    >
      {/* Accent rule */}
      <div
        style={{
          width: 52,
          height: 4,
          backgroundColor: accentColor,
          borderRadius: 2,
          marginBottom: 48,
        }}
      />

      {/* Number + unit — kinetic */}
      <div
        style={{
          opacity: numOp,
          transform: `scale(${scale})`,
          transformOrigin: 'left center',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 22,
          marginBottom: 44,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 240,
            fontWeight: 900,
            color: numColor,
            lineHeight: 0.82,
            letterSpacing: -12,
          }}
        >
          {displayNum}
        </div>
        {unit && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 80,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.5)',
              paddingBottom: 32,
              letterSpacing: -2,
            }}
          >
            {unit}
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{ opacity: labelOp }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 54,
            fontWeight: 600,
            color: '#FAFAFA',
            letterSpacing: -1.5,
            marginBottom: 14,
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: -0.5,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

export const ImpactNumbers = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hard-cut black between segments
  // Segment 1: 0–88    "2 min"
  // BLACK:     88–92
  // Segment 2: 92–178  "100%"
  // BLACK:     178–182
  // Segment 3: 182–270 "30 days"

  const inBlack =
    (frame >= 88 && frame <= 92) || (frame >= 178 && frame <= 182);

  // M-Pesa green burst on the "30 days" reveal (dramatic moment)
  const greenBurstOp = interpolate(
    frame,
    [182, 184, 190, 196],
    [0, 0.12, 0.06, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}>
      <Grain frame={frame} opacity={0.045} />

      {/* Subtle radial gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 15% 55%, rgba(0,165,80,0.04) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hard-cut black overlay */}
      {inBlack && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 10,
          }}
        />
      )}

      {/* Green burst on segment 3 entry */}
      {greenBurstOp > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#00A550',
            opacity: greenBurstOp,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Segment 1 — 2 min */}
      <Segment
        frame={frame}
        fps={fps}
        startFrame={0}
        endFrame={88}
        number={2}
        unit="min"
        label="average order time"
        sublabel="vs 15–20 min manually"
        countFrom={0}
      />

      {/* Segment 2 — 100% */}
      <Segment
        frame={frame}
        fps={fps}
        startFrame={92}
        endFrame={178}
        number={100}
        unit="%"
        label="automated confirmations"
        sublabel="zero manual M-Pesa checks"
        numColor="#00A550"
        accentColor="#00A550"
        countFrom={0}
      />

      {/* Segment 3 — 30 days */}
      <Segment
        frame={frame}
        fps={fps}
        startFrame={182}
        endFrame={270}
        number={30}
        unit="days"
        label="free pilot"
        sublabel="no contract · no setup fees"
        countFrom={0}
      />
    </AbsoluteFill>
  );
};
