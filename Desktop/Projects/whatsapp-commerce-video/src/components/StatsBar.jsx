import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// Stats — 300 frames / 10s
// 3 full-width horizontal bands. Each 640px tall. Total = 1920px.
// Giant centred numbers. Clean, bold, impossible to miss.

const BANDS = [
  {
    value: 2,
    suffix: 'min',
    top: 'average order time',
    bottom: 'vs 15–20 min manually',
    bg: '#005F30',
    textColor: '#FFFFFF',
    subColor: 'rgba(255,255,255,0.55)',
    startFrame: 0,
  },
  {
    value: 100,
    suffix: '%',
    top: 'automated confirmations',
    bottom: 'zero manual M-Pesa checks',
    bg: '#00A550',
    textColor: '#FFFFFF',
    subColor: 'rgba(255,255,255,0.55)',
    startFrame: 60,
  },
  {
    value: 30,
    suffix: 'days',
    top: 'free pilot',
    bottom: 'no contract · no setup fees',
    bg: '#00CC64',
    textColor: '#003D1A',
    subColor: 'rgba(0,61,26,0.6)',
    startFrame: 120,
  },
];

const Band = ({ band, frame, fps }) => {
  const local = Math.max(0, frame - band.startFrame);

  const s = spring({ frame: local, fps, config: { damping: 18, stiffness: 130, mass: 0.8 } });
  const opacity = interpolate(s, [0, 0.18], [0, 1]);
  const y = interpolate(s, [0, 1], [50, 0]);

  const count = Math.round(
    interpolate(local, [0, 45], [0, band.value], { extrapolateRight: 'clamp' })
  );

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: band.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle diagonal texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 48px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Top label */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 700,
            color: band.subColor,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          {band.top}
        </div>

        {/* Giant number + suffix */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 16,
            lineHeight: 1,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 240,
              fontWeight: 800,
              color: band.textColor,
              lineHeight: 0.85,
              letterSpacing: -10,
            }}
          >
            {count}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 700,
              color: band.subColor,
              paddingBottom: 24,
              letterSpacing: -2,
            }}
          >
            {band.suffix}
          </div>
        </div>

        {/* Bottom label */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 500,
            color: band.subColor,
            marginTop: 20,
            letterSpacing: -0.5,
          }}
        >
          {band.bottom}
        </div>
      </div>
    </div>
  );
};

export const StatsBar = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {BANDS.map((band, i) => (
        <Band key={i} band={band} frame={frame} fps={fps} />
      ))}
    </AbsoluteFill>
  );
};
