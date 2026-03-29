import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// ImmersiveChat — 750 frames / 25s
// NO PHONE FRAME. The chat IS the canvas. Full 1080×1920.
// The WhatsApp conversation fills every pixel.
// This is how you make a product demo feel like a movie.

const WA_BG       = '#0B141A';
const WA_HEADER   = '#1F2C34';
const WA_SENT     = '#005C4B';
const WA_RECEIVED = '#1F2C34';
const WA_TEXT     = '#E9EDEF';
const WA_META     = '#8696A0';
const WA_GREEN    = '#00A884';

const HEADER_H = 130;
const INPUT_H  = 88;

const MESSAGES = [
  { from: 'customer', text: 'Hi', frame: 20 },
  {
    from: 'bot',
    text: '👋 Welcome to StyleHub!\n\nChoose a category to browse:',
    frame: 65,
    options: ['👗 Dresses', '👕 Tops', '👖 Bottoms', '💍 Accessories'],
  },
  { from: 'customer', text: '👗 Dresses', frame: 165 },
  {
    from: 'bot',
    text: 'Dresses — 3 items:',
    frame: 205,
    options: ['Floral Midi Dress — Ksh 2,800', 'Bodycon Mini — Ksh 1,950', 'Wrap Maxi — Ksh 3,400'],
  },
  { from: 'customer', text: 'Floral Midi Dress', frame: 295 },
  {
    from: 'bot',
    text: '✅ Added to cart\n\nFloral Midi Dress × 1 — Ksh 2,800',
    frame: 332,
    options: ['➕ Add more', '🛒 Checkout'],
  },
  { from: 'customer', text: '🛒 Checkout', frame: 415 },
  {
    from: 'bot',
    text: '📦 Pickup or delivery?',
    frame: 448,
    options: ['🏪 Pickup – free', '🚗 Delivery – +Ksh 200'],
  },
  { from: 'customer', text: '🏪 Pickup – free', frame: 530 },
  {
    from: 'bot',
    text: '✅ Order #KE-0042\n\n💳 M-Pesa payment:\nPaybill: 247247\nAccount: KE-0042\nAmount: Ksh 2,800',
    frame: 565,
    isMpesa: true,
  },
  {
    from: 'customer',
    text: 'Safaricom: Confirmed. KSh2,800.00 sent to STYLEHUB for account KE-0042',
    frame: 700,
  },
  {
    from: 'bot',
    text: "🎉 Payment received!\n\nOrder #KE-0042 confirmed. We'll notify you when it's ready. Asante! 🙏",
    frame: 740,
    isConfirm: true,
  },
];

const CAPTIONS = [
  { text: 'Customer texts your number',         from: 0,   to: 64  },
  { text: 'Catalog loads — right in chat',      from: 65,  to: 162 },
  { text: 'Picks a product',                    from: 163, to: 294 },
  { text: 'Adds to cart — one tap',             from: 295, to: 414 },
  { text: 'Pickup or delivery?',                from: 415, to: 527 },
  { text: 'M-Pesa details sent automatically', from: 528, to: 699 },
  { text: '✓ Order confirmed. Zero manual work.', from: 700, to: 749 },
];

// Animated WhatsApp wallpaper pattern
const WaPattern = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      pointerEvents: 'none',
    }}
  />
);

const TypingIndicator = ({ frame }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: 8,
      paddingLeft: 0,
    }}
  >
    <div
      style={{
        backgroundColor: WA_RECEIVED,
        borderRadius: '12px 12px 12px 2px',
        padding: '18px 24px',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {[0, 1, 2].map((i) => {
        const b = Math.sin(frame * 0.25 + i * 1.2) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: `rgba(134,150,160,${0.3 + b * 0.55})`,
              transform: `translateY(${b * -7}px)`,
            }}
          />
        );
      })}
    </div>
  </div>
);

const Bubble = ({ msg, frame, fps }) => {
  const isSent = msg.from === 'customer';
  const local = Math.max(0, frame - msg.frame);

  // Impact spring — messages land with weight
  const pop = spring({
    frame: local,
    fps,
    config: { stiffness: 380, damping: 16, mass: 0.5 },
    durationInFrames: 18,
  });
  const scale = interpolate(pop, [0, 1], [0.62, 1]);
  const opacity = interpolate(pop, [0, 0.18], [0, 1]);

  const bg = msg.isMpesa
    ? 'linear-gradient(150deg, #012a1e 0%, #014d36 100%)'
    : msg.isConfirm
    ? 'linear-gradient(150deg, #003d28 0%, #006644 100%)'
    : isSent
    ? WA_SENT
    : WA_RECEIVED;

  const borderColor = msg.isMpesa
    ? 'rgba(0,168,132,0.45)'
    : msg.isConfirm
    ? 'rgba(0,168,132,0.35)'
    : 'transparent';

  const glowColor = msg.isMpesa || msg.isConfirm ? 'rgba(0,168,132,0.18)' : 'none';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        marginBottom: 10,
        paddingLeft: isSent ? 120 : 0,
        paddingRight: isSent ? 0 : 120,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: isSent ? 'right bottom' : 'left bottom',
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: isSent ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
          padding: '16px 22px',
          maxWidth: '88%',
          border: `1.5px solid ${borderColor}`,
          boxShadow: msg.isMpesa || msg.isConfirm ? `0 4px 20px ${glowColor}` : 'none',
        }}
      >
        {msg.isMpesa && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 700,
              color: '#00A884',
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            M-PESA PAYMENT
          </div>
        )}
        <div
          style={{
            color: WA_TEXT,
            fontSize: 34,
            fontFamily: FONT,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            fontWeight: msg.isMpesa ? 500 : 400,
          }}
        >
          {msg.text}
        </div>

        <div
          style={{
            textAlign: 'right',
            marginTop: 6,
            fontFamily: FONT,
            fontSize: 20,
            color: WA_META,
          }}
        >
          9:{String(41 + MESSAGES.indexOf(msg)).padStart(2, '0')}{' '}
          {isSent ? '✓✓' : ''}
        </div>

        {msg.options && (
          <div
            style={{
              marginTop: 14,
              borderTop: '1px solid rgba(134,150,160,0.15)',
              paddingTop: 10,
            }}
          >
            {msg.options.map((opt, i) => (
              <div
                key={i}
                style={{
                  color: WA_GREEN,
                  fontSize: 30,
                  fontFamily: FONT,
                  fontWeight: 600,
                  padding: '9px 0',
                  textAlign: 'center',
                  borderBottom:
                    i < msg.options.length - 1
                      ? '1px solid rgba(134,150,160,0.1)'
                      : 'none',
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CaptionBar = ({ frame, fps }) => {
  const active = CAPTIONS.find((c) => frame >= c.from && frame <= c.to);
  if (!active) return null;

  const localIn = Math.max(0, frame - active.from);
  const sIn = spring({ frame: localIn, fps, config: { damping: 22, stiffness: 220 } });
  const fadeOut = interpolate(frame, [active.to - 8, active.to], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(sIn, [0, 0.2], [0, 1]) * fadeOut;
  const y = interpolate(sIn, [0, 1], [18, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: INPUT_H + 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.88)',
          borderRadius: 50,
          padding: '18px 44px',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: 920,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: -0.3,
          }}
        >
          {active.text}
        </div>
      </div>
    </div>
  );
};

export const ImmersiveChat = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance — the chat canvas fades in (0.4s)
  const enterOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  const visibleMessages = MESSAGES.filter((m) => frame >= m.frame);
  const visibleCount = visibleMessages.length;

  // Smooth scroll — shifts all content up as conversation grows
  const scrollOffset = Math.max(0, (visibleCount - 6) * 230);

  const showTyping = MESSAGES.some(
    (m) => m.from === 'bot' && frame < m.frame && frame >= m.frame - 34
  );

  // M-Pesa flash — 4 frames of green at payment confirmation
  const mpesaF = MESSAGES[9].frame;
  const mpesaFlash = interpolate(
    frame,
    [mpesaF, mpesaF + 2, mpesaF + 6, mpesaF + 10],
    [0, 0.7, 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const chatAreaH = 1920 - HEADER_H - INPUT_H;

  return (
    <AbsoluteFill style={{ backgroundColor: WA_BG, opacity: enterOp }}>
      <WaPattern />

      {/* M-Pesa full-canvas green flash */}
      {mpesaFlash > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#00A550',
            opacity: mpesaFlash,
            zIndex: 30,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          backgroundColor: WA_HEADER,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: 18,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          zIndex: 10,
        }}
      >
        {/* Back */}
        <div
          style={{
            color: WA_GREEN,
            fontSize: 26,
            fontFamily: FONT,
            fontWeight: 500,
          }}
        >
          ←
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 66,
            height: 66,
            borderRadius: '50%',
            backgroundColor: WA_GREEN,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            fontWeight: 800,
            color: '#fff',
            fontFamily: FONT,
            flexShrink: 0,
          }}
        >
          S
        </div>

        <div>
          <div
            style={{
              color: WA_TEXT,
              fontSize: 32,
              fontFamily: FONT,
              fontWeight: 700,
            }}
          >
            StyleHub
          </div>
          <div style={{ color: WA_GREEN, fontSize: 22, fontFamily: FONT }}>
            online
          </div>
        </div>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 28,
            color: WA_META,
            fontSize: 28,
          }}
        >
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>

      {/* ── CHAT AREA ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: HEADER_H,
          left: 0,
          right: 0,
          height: chatAreaH,
          overflowY: 'hidden',
          padding: '20px 24px 0',
        }}
      >
        <div style={{ transform: `translateY(-${scrollOffset}px)` }}>
          {MESSAGES.map((msg, i) =>
            frame >= msg.frame ? (
              <Bubble key={i} msg={msg} frame={frame} fps={fps} />
            ) : null
          )}
          {showTyping && <TypingIndicator frame={frame} />}
        </div>
      </div>

      {/* Caption bar */}
      <CaptionBar frame={frame} fps={fps} />

      {/* ── INPUT BAR ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: INPUT_H,
          backgroundColor: WA_HEADER,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          zIndex: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 56,
            backgroundColor: '#233138',
            borderRadius: 28,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ color: WA_META, fontSize: 24, fontFamily: FONT }}>
            Message
          </div>
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: WA_GREEN,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          🎤
        </div>
      </div>
    </AbsoluteFill>
  );
};
