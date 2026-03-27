import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// CTA — 360 frames / 12s
// Split design matching HookSlide: white content (top 60%) + dark action (bottom 40%)
// Fills the full 1920px frame.

export const CTASlide = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mkS = (delay, stiff = 160, damp = 18) =>
    spring({ frame: Math.max(0, frame - delay), fps, config: { stiffness: stiff, damping: damp } });

  const mk = (s) => ({
    opacity: interpolate(s, [0, 0.15], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [44, 0])}px)`,
  });

  const s0 = mkS(0);
  const s1 = mkS(18);
  const s2 = mkS(36);

  const criteria = [
    { text: 'Currently sell via WhatsApp', frame: 72 },
    { text: 'Accept M-Pesa',               frame: 92 },
    { text: 'Based in Nairobi',             frame: 112 },
  ];

  const pillS   = mkS(52);
  const ctaS    = mkS(135, 120, 14);
  const ctaOp   = interpolate(ctaS, [0, 0.18], [0, 1]);
  const ctaY    = interpolate(ctaS, [0, 1], [36, 0]);
  const fineOp  = interpolate(frame, [200, 225], [0, 1], { extrapolateRight: 'clamp' });

  // Left dark accent — full height
  const accentH = interpolate(frame, [0, 24], [0, 1920], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left dark accent bar — grows down */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 10,
          height: accentH,
          backgroundColor: '#0F172A',
        }}
      />

      {/* ── TOP SECTION: white, content anchored to bottom ────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '80px 84px 56px 96px',
        }}
      >
        {/* Tag */}
        <div
          style={{
            ...mk(s0),
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 32,
          }}
        >
          <div style={{ width: 32, height: 3, backgroundColor: '#00A550', borderRadius: 2 }} />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 700,
              color: '#00A550',
              letterSpacing: 5,
            }}
          >
            FREE PILOT · 30 DAYS
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 52 }}>
          <div
            style={{
              ...mk(s1),
              fontFamily: FONT,
              fontSize: 170,
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 0.88,
              letterSpacing: -7,
            }}
          >
            Sell more.
          </div>
          <div
            style={{
              ...mk(s2),
              fontFamily: FONT,
              fontSize: 170,
              fontWeight: 800,
              color: '#00A550',
              lineHeight: 0.88,
              letterSpacing: -7,
            }}
          >
            Manage less.
          </div>
        </div>

        {/* Urgency pill */}
        <div
          style={{
            opacity: interpolate(pillS, [0, 0.2], [0, 1]),
            transform: `translateX(${interpolate(pillS, [0, 1], [-20, 0])}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            backgroundColor: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: 50,
            padding: '14px 28px',
            marginBottom: 44,
            alignSelf: 'flex-start',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              color: '#92400E',
            }}
          >
            3 pilot spots · Nairobi only
          </div>
        </div>

        {/* Criteria */}
        <div>
          {criteria.map((item, i) => {
            const iS = mkS(item.frame);
            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(iS, [0, 0.2], [0, 1]),
                  transform: `translateX(${interpolate(iS, [0, 1], [-22, 0])}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  marginBottom: i < 2 ? 20 : 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: '#00A550',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 700,
                      fontFamily: FONT,
                    }}
                  >
                    ✓
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 40,
                    fontWeight: 500,
                    color: '#334155',
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM SECTION: dark navy — the action ────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 770,
          backgroundColor: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 84px 64px 96px',
        }}
      >
        {/* Big CTA */}
        <div
          style={{
            opacity: ctaOp,
            transform: `translateY(${ctaY}px)`,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 110,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 0.9,
              letterSpacing: -4,
              marginBottom: 16,
            }}
          >
            DM me
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 110,
              fontWeight: 800,
              color: '#00A550',
              lineHeight: 0.9,
              letterSpacing: -4,
            }}
          >
            to apply.
          </div>
        </div>

        {/* Category line */}
        <div
          style={{
            opacity: ctaOp,
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 400,
            color: '#475569',
            marginBottom: 48,
            letterSpacing: -0.5,
          }}
        >
          Fashion · Food · Groceries · Any WhatsApp business
        </div>

        {/* Fine print */}
        <div
          style={{
            opacity: fineOp,
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 500,
            color: '#334155',
            letterSpacing: 2,
          }}
        >
          NO CONTRACT · NO SETUP FEES · STOP ANYTIME
        </div>
      </div>
    </AbsoluteFill>
  );
};
