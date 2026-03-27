import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// Hook — 90 frames / 3s
// Split design: white text (top 55%) + dark chaos steps (bottom 45%)
// Fills the full 1920px frame.

const STEPS = [
  { icon: '💬', text: 'Screenshot the order',   frame: 36 },
  { icon: '⏳', text: 'Wait for M-Pesa',          frame: 48 },
  { icon: '✏️', text: 'Confirm manually',         frame: 60 },
  { icon: '🔁', text: 'Repeat. 50× a day.',       frame: 72 },
];

export const HookSlide = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mkS = (delay, stiff = 300, damp = 22) =>
    spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: stiff, damping: damp, mass: 0.5 } });

  const mk = (s) => ({
    opacity: interpolate(s, [0, 0.12], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
  });

  const s1 = mkS(0);
  const s2 = mkS(8);
  const s3 = mkS(16);

  const dividerW = interpolate(frame, [28, 50], [0, 1080], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      {/* Green left accent — full height */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 10,
          height: '100%',
          backgroundColor: '#00A550',
        }}
      />

      {/* ── TOP SECTION: white, text anchored to bottom ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1060,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '80px 84px 52px 92px',
        }}
      >
        {[
          { word: 'Still',      color: '#0F172A', s: s1 },
          { word: 'doing this', color: '#0F172A', s: s2 },
          { word: 'manually?',  color: '#00A550', s: s3 },
        ].map(({ word, color, s }, i) => (
          <div key={i} style={{ overflow: 'hidden', marginBottom: i === 2 ? 44 : 4 }}>
            <div
              style={{
                ...mk(s),
                fontFamily: FONT,
                fontSize: 196,
                fontWeight: 800,
                color,
                lineHeight: 0.88,
                letterSpacing: -8,
              }}
            >
              {word}
            </div>
          </div>
        ))}

        {/* Divider — draws in */}
        <div
          style={{
            width: dividerW,
            height: 4,
            backgroundColor: '#0F172A',
            borderRadius: 2,
          }}
        />
      </div>

      {/* ── BOTTOM SECTION: dark navy — current manual process ─────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 860,
          backgroundColor: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '52px 84px 52px 92px',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 700,
            color: '#00A550',
            letterSpacing: 5,
            marginBottom: 48,
          }}
        >
          YOUR CURRENT PROCESS
        </div>

        {STEPS.map((step, i) => {
          const sS = mkS(step.frame);
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(sS, [0, 0.2], [0, 1]),
                transform: `translateX(${interpolate(sS, [0, 1], [-32, 0])}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                marginBottom: i < 3 ? 32 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  lineHeight: 1,
                  minWidth: 60,
                  textAlign: 'center',
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 50,
                  fontWeight: 600,
                  color: '#64748B',
                  letterSpacing: -0.5,
                }}
              >
                {step.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
