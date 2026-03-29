import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// Night — 120 frames / 4s
// Concept: Amina's midnight. Dark, intimate, uncomfortable, real.
// Her phone glowing in the dark. M-Pesa pings. It's 11:47 PM.
// This should make every merchant lean forward.

const NOTIFICATIONS = [
  { text: 'Safaricom: Confirmed. KSh 1,200 paid to FASHIONKE', frame: 6 },
  { text: 'Safaricom: Confirmed. KSh 3,400 paid to FASHIONKE', frame: 22 },
  { text: 'Customer: "did you get my payment??" 🙏',            frame: 38 },
  { text: 'Safaricom: Confirmed. KSh 800 paid to FASHIONKE',   frame: 54 },
];

// Grain overlay — animated, shifts every 3 frames for texture
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

const Notif = ({ notif, frame, fps }) => {
  const local = Math.max(0, frame - notif.frame);
  const s = spring({
    frame: local,
    fps,
    config: { stiffness: 320, damping: 24, mass: 0.7 },
  });
  const y = interpolate(s, [0, 1], [-90, 0]);
  const opacity = interpolate(s, [0, 0.12], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '20px 26px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div style={{ fontSize: 30, flexShrink: 0 }}>📱</div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.4,
        }}
      >
        {notif.text}
      </div>
    </div>
  );
};

export const NightSlide = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blinking colon — every 15 frames
  const colonBlink = Math.floor(frame / 15) % 2 === 0;

  // Time appears early
  const timeOp = interpolate(frame, [2, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Main headline rises from the bottom half of the frame
  const headS = spring({
    frame: Math.max(0, frame - 64),
    fps,
    config: { stiffness: 160, damping: 22, mass: 1.2 },
  });
  const headOp = interpolate(headS, [0, 0.15], [0, 1]);
  const headY = interpolate(headS, [0, 1], [60, 0]);

  // Sub fades in after headline
  const subOp = interpolate(frame, [84, 104], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}>
      {/* Phone screen warm ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(255,107,43,0.07) 0%, transparent 62%)',
          pointerEvents: 'none',
        }}
      />

      <Grain frame={frame} opacity={0.05} />

      {/* Time display — top center */}
      <div
        style={{
          position: 'absolute',
          top: 148,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: 10,
          opacity: timeOp,
        }}
      >
        11{colonBlink ? ':' : '\u00A0'}47 PM
      </div>

      {/* Notification stack */}
      <div
        style={{
          position: 'absolute',
          top: 256,
          left: 60,
          right: 60,
        }}
      >
        {NOTIFICATIONS.map((n, i) =>
          frame >= n.frame ? (
            <Notif key={i} notif={n} frame={frame} fps={fps} />
          ) : null
        )}
      </div>

      {/* Main headline — bottom half */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 700,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 72px',
          opacity: headOp,
          transform: `translateY(${headY}px)`,
        }}
      >
        {/* Divider */}
        <div
          style={{
            width: 56,
            height: 3,
            backgroundColor: '#FF6B2B',
            borderRadius: 2,
            marginBottom: 36,
          }}
        />

        <div
          style={{
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 800,
            color: '#FAFAFA',
            lineHeight: 1.0,
            letterSpacing: -3.5,
            marginBottom: 32,
          }}
        >
          Still confirming
          <br />
          orders manually?
        </div>

        <div
          style={{
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: -0.5,
            opacity: subOp,
          }}
        >
          At midnight. Every night. Alone.
        </div>
      </div>
    </AbsoluteFill>
  );
};
