import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// iOS dark-mode WhatsApp — exact colors
const WA_BG       = '#0B141A';
const WA_HEADER   = '#1F2C34';
const WA_SENT     = '#005C4B';
const WA_RECEIVED = '#1F2C34';
const WA_TEXT     = '#E9EDEF';
const WA_META     = '#8696A0';
const WA_GREEN    = '#00A884';
const WA_INPUT_BG = '#1F2C34';

// Phone dimensions: 900×1860 — fills ~83% of the 1080×1920 canvas
// (90px side gap, 30px top/bottom gap)
const PHONE_W = 900;
const PHONE_H = 1860;

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

// Bottom caption bar — for sound-off viewers (80%+ of social video)
const CAPTIONS = [
  { text: 'Customer texts your WhatsApp number',    from: 0,   to: 64  },
  { text: 'Browses your catalog — right in chat',   from: 65,  to: 162 },
  { text: 'Picks a product',                        from: 163, to: 294 },
  { text: 'Adds to cart — one tap',                 from: 295, to: 414 },
  { text: 'Pickup or delivery?',                    from: 415, to: 527 },
  { text: 'Pays via M-Pesa — details sent auto',    from: 528, to: 699 },
  { text: '✓ Order confirmed. Zero manual work.',   from: 700, to: 749 },
];

// Key moment labels — overlaid INSIDE the phone frame area, bottom-left corner
const MOMENTS = [
  { atFrame: 65,  text: 'Catalog loads instantly' },
  { atFrame: 205, text: 'Products + prices in chat' },
  { atFrame: 565, text: 'M-Pesa details auto-sent' },
  { atFrame: 740, text: 'Order confirmed ✓' },
];

const TypingIndicator = ({ frame }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 6, paddingLeft: 4 }}>
    <div
      style={{
        backgroundColor: WA_RECEIVED,
        borderRadius: '8px 8px 8px 2px',
        padding: '14px 20px',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
      }}
    >
      {[0, 1, 2].map((i) => {
        const b = Math.sin(frame * 0.25 + i * 1.2) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: `rgba(134,150,160,${0.3 + b * 0.55})`,
              transform: `translateY(${b * -6}px)`,
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
  const pop = spring({ frame: local, fps, config: { damping: 12, stiffness: 240, mass: 0.3 }, durationInFrames: 16 });
  const scale = interpolate(pop, [0, 1], [0.68, 1]);
  const opacity = interpolate(pop, [0, 0.2], [0, 1]);

  const bg = msg.isMpesa
    ? 'linear-gradient(160deg,#012a1e,#014d36)'
    : msg.isConfirm
    ? 'linear-gradient(160deg,#003d28,#006644)'
    : isSent
    ? WA_SENT
    : WA_RECEIVED;

  const borderColor = msg.isMpesa
    ? 'rgba(0,168,132,0.5)'
    : msg.isConfirm
    ? 'rgba(0,168,132,0.4)'
    : 'transparent';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        marginBottom: 8,
        paddingLeft: isSent ? 60 : 0,
        paddingRight: isSent ? 0 : 60,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: isSent ? 'right bottom' : 'left bottom',
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: isSent ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
          padding: '12px 16px',
          maxWidth: '84%',
          border: `1px solid ${borderColor}`,
          boxShadow: msg.isMpesa || msg.isConfirm ? '0 2px 12px rgba(0,168,132,0.2)' : 'none',
        }}
      >
        {msg.isMpesa && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 700,
              color: '#00A884',
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            M-PESA PAYMENT
          </div>
        )}
        <div
          style={{
            color: WA_TEXT,
            fontSize: 28,
            fontFamily: FONT,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            fontWeight: msg.isMpesa ? 500 : 400,
          }}
        >
          {msg.text}
        </div>

        {/* Timestamp */}
        <div
          style={{
            textAlign: 'right',
            marginTop: 4,
            fontFamily: FONT,
            fontSize: 18,
            color: WA_META,
          }}
        >
          9:{String(41 + MESSAGES.indexOf(msg)).padStart(2, '0')} {isSent ? '✓✓' : ''}
        </div>

        {/* Option buttons */}
        {msg.options && (
          <div
            style={{
              marginTop: 10,
              borderTop: '1px solid rgba(134,150,160,0.15)',
              paddingTop: 8,
            }}
          >
            {msg.options.map((opt, i) => (
              <div
                key={i}
                style={{
                  color: WA_GREEN,
                  fontSize: 26,
                  fontFamily: FONT,
                  fontWeight: 600,
                  padding: '7px 0',
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

// Moment label: overlaid bottom-left inside the phone's bounds
const MomentLabel = ({ moment, frame, fps }) => {
  const local = Math.max(0, frame - moment.atFrame);
  const s = spring({ frame: local, fps, config: { damping: 16, stiffness: 180 } });
  const opacity = interpolate(s, [0, 0.2], [0, 1]);
  const x = interpolate(s, [0, 1], [-24, 0]);

  const fadeOut = interpolate(
    frame,
    [moment.atFrame + 80, moment.atFrame + 110],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const finalOp = opacity * fadeOut;
  if (finalOp <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        // bottom of the phone area, left side
        bottom: 90,
        left: 16,
        opacity: finalOp,
        transform: `translateX(${x}px)`,
        backgroundColor: '#00A550',
        borderRadius: 10,
        padding: '12px 20px',
        maxWidth: 300,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 700,
          color: '#FFFFFF',
          lineHeight: 1.3,
        }}
      >
        {moment.text}
      </div>
    </div>
  );
};

const CaptionBar = ({ frame, fps }) => {
  const active = CAPTIONS.find((c) => frame >= c.from && frame <= c.to);
  if (!active) return null;

  const localIn = Math.max(0, frame - active.from);
  const sIn = spring({ frame: localIn, fps, config: { damping: 20, stiffness: 200 } });
  const fadeOut = interpolate(
    frame,
    [active.to - 8, active.to],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = interpolate(sIn, [0, 0.2], [0, 1]) * fadeOut;
  const y = interpolate(sIn, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(8px)',
          borderRadius: 50,
          padding: '16px 40px',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: -0.3,
            lineHeight: 1.3,
          }}
        >
          {active.text}
        </div>
      </div>
    </div>
  );
};

export const ChatDemo = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance — slides up from below
  const phoneS = spring({ frame, fps, config: { damping: 14, stiffness: 80, mass: 1.1 } });
  const phoneY = interpolate(phoneS, [0, 1], [400, 0]);
  const phoneOp = interpolate(phoneS, [0, 0.15], [0, 1]);

  const visibleMessages = MESSAGES.filter((m) => frame >= m.frame);
  const visibleCount = visibleMessages.length;
  const scrollOffset = Math.max(0, (visibleCount - 5) * 150);

  const showTyping = MESSAGES.some(
    (m) => m.from === 'bot' && frame < m.frame && frame >= m.frame - 34
  );

  // Active moment label
  const activeMoment = [...MOMENTS]
    .reverse()
    .find((c) => frame >= c.atFrame && frame < c.atFrame + 110);

  // M-Pesa glow
  const mpesaF = MESSAGES[9].frame;
  const mpesaGlow = interpolate(
    frame,
    [mpesaF, mpesaF + 10, mpesaF + 50, mpesaF + 70],
    [0, 0.45, 0.25, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const STATUS_BAR_H = 52;
  const NAV_BAR_H    = 90;
  const INPUT_BAR_H  = 72;
  const chatAreaH    = PHONE_H - STATUS_BAR_H - NAV_BAR_H - INPUT_BAR_H;

  return (
    <AbsoluteFill style={{ backgroundColor: '#060D13' }}>
      {/* M-Pesa ambient glow */}
      {mpesaGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 55%, rgba(0,168,132,${mpesaGlow}) 0%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Phone — nearly full-frame */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, calc(-50% + ${phoneY}px))`,
          opacity: phoneOp,
          width: PHONE_W,
          height: PHONE_H,
          backgroundColor: WA_BG,
          borderRadius: 52,
          overflow: 'hidden',
          boxShadow:
            '0 40px 100px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* iOS status bar */}
        <div
          style={{
            backgroundColor: WA_HEADER,
            height: STATUS_BAR_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
          }}
        >
          <div style={{ color: '#E9EDEF', fontSize: 19, fontFamily: FONT, fontWeight: 600 }}>
            9:41
          </div>
          <div style={{ color: '#8696A0', fontSize: 17, fontFamily: FONT }}>
            ●●●● 🔋
          </div>
        </div>

        {/* WhatsApp nav bar */}
        <div
          style={{
            backgroundColor: WA_HEADER,
            height: NAV_BAR_H,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 14,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ color: WA_GREEN, fontSize: 20, fontFamily: FONT, fontWeight: 500 }}>
            ← Back
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
              fontSize: 26,
              fontWeight: 800,
              color: '#fff',
              fontFamily: FONT,
            }}
          >
            S
          </div>
          <div>
            <div style={{ color: WA_TEXT, fontSize: 27, fontFamily: FONT, fontWeight: 700 }}>
              StyleHub
            </div>
            <div style={{ color: WA_META, fontSize: 20, fontFamily: FONT }}>online</div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              color: WA_META,
              fontSize: 22,
              fontFamily: FONT,
              letterSpacing: 2,
            }}
          >
            📞 ⋮
          </div>
        </div>

        {/* Chat area */}
        <div
          style={{
            backgroundColor: WA_BG,
            height: chatAreaH,
            overflowY: 'hidden',
            padding: '16px 16px 0',
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

        {/* Input bar */}
        <div
          style={{
            height: INPUT_BAR_H,
            backgroundColor: WA_HEADER,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 50,
              backgroundColor: WA_INPUT_BG,
              borderRadius: 25,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ color: WA_META, fontSize: 20, fontFamily: FONT }}>Message</div>
          </div>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: WA_GREEN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🎤
          </div>
        </div>

        {/* Moment labels — rendered inside the phone frame */}
        {activeMoment && (
          <MomentLabel moment={activeMoment} frame={frame} fps={fps} />
        )}
      </div>

      {/* Caption bar — overlaid at the very bottom of the canvas */}
      <CaptionBar frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
