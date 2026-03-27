import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// Problem — 300 frames / 10s
// Three full-height cards filling the entire 1920px frame.
// Larger fonts. Bottom accent bar per item. No wasted space.

const ITEMS = [
  {
    num: '01',
    heading: 'Orders buried in chat',
    body: 'Scrolling back through hundreds of messages to find what someone ordered yesterday.',
    accent: '#00A550',
    startFrame: 20,
  },
  {
    num: '02',
    heading: 'Manual M-Pesa every night',
    body: "Confirming each payment by hand before you can sleep. Miss one, lose the order.",
    accent: '#F59E0B',
    startFrame: 95,
  },
  {
    num: '03',
    heading: 'Zero records. Zero data.',
    body: "No history. No insight into what sells. No way to grow what you can't measure.",
    accent: '#EF4444',
    startFrame: 170,
  },
];

const Item = ({ item, frame, fps }) => {
  const local = Math.max(0, frame - item.startFrame);
  const s = spring({ frame: local, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const opacity = interpolate(s, [0, 0.18], [0, 1]);
  const y = interpolate(s, [0, 1], [55, 0]);

  const accentW = interpolate(
    frame,
    [item.startFrame + 30, item.startFrame + 80],
    [0, 400],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        flex: 1,
        borderTop: '1px solid rgba(255,255,255,0.09)',
        paddingTop: 40,
        paddingBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top: number + text */}
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Number */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 150,
            fontWeight: 800,
            color: '#1A2E1E',
            letterSpacing: -5,
            lineHeight: 1,
            minWidth: 200,
            paddingTop: 2,
          }}
        >
          {item.num}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 68,
              fontWeight: 700,
              color: '#F1F5F9',
              letterSpacing: -2,
              lineHeight: 1.08,
              marginBottom: 18,
            }}
          >
            {item.heading}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 36,
              fontWeight: 400,
              color: '#64748B',
              lineHeight: 1.5,
            }}
          >
            {item.body}
          </div>
        </div>
      </div>

      {/* Bottom accent bar — grows in after item arrives */}
      <div
        style={{
          height: 4,
          width: accentW,
          borderRadius: 2,
          backgroundColor: item.accent,
          opacity: 0.6,
        }}
      />
    </div>
  );
};

export const ProblemSlide = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const headerOp = interpolate(headerS, [0, 1], [0, 1]);
  const headerY = interpolate(headerS, [0, 1], [28, 0]);

  const payoffOp = interpolate(frame, [248, 270], [0, 1], { extrapolateRight: 'clamp' });
  const payoffX = interpolate(frame, [248, 270], [-20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0D1117' }}>
      {/* Left green bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 6,
          height: '100%',
          backgroundColor: '#00A550',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 80px 60px 90px',
        }}
      >
        {/* Tag + headline */}
        <div
          style={{
            opacity: headerOp,
            transform: `translateY(${headerY}px)`,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 700,
              color: '#00A550',
              letterSpacing: 5,
              marginBottom: 18,
            }}
          >
            THE PROBLEM
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 82,
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: -3,
              lineHeight: 1.0,
            }}
          >
            Running your business
            <br />
            <span style={{ color: '#475569' }}>through WhatsApp?</span>
          </div>
        </div>

        {/* Items — fill remaining vertical space */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {ITEMS.map((item, i) => (
            <Item key={i} item={item} frame={frame} fps={fps} />
          ))}

          {/* Payoff */}
          <div
            style={{
              opacity: payoffOp,
              transform: `translateX(${payoffX}px)`,
              paddingTop: 28,
              paddingBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontFamily: FONT,
                fontSize: 42,
                fontWeight: 600,
                color: '#94A3B8',
                fontStyle: 'italic',
                letterSpacing: -0.5,
              }}
            >
              It works. Until it doesn't.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
