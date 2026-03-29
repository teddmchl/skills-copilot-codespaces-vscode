import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONT, loadSpaceGrotesk } from '../utils/fonts';

// TheRest — 390 frames / 13s
// The quiet after the storm. Then the ask.
//
// Structure:
// 0–20:   Silence. Pure black. (Decompression after the numbers.)
// 20–180: Particles drift downward — orders processing silently.
//         "Your business." rises.
//         "Running while you rest." follows.
// 180–260: Hold. Let the idea land.
// 260–320: Text cross-dissolves to the offer.
// 320–380: "DM me." — large, green, definitive.
// 380–390: M-Pesa green wash — final frame is hope, not just a CTA.

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

// Particles — green dots drifting downward
// Seeded positions using golden-angle distribution (no random, deterministic for Remotion)
const PARTICLE_COUNT = 48;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  x: ((i * 137.508 * 7.3) % 1080),
  startY: ((i * 53.1) % 1920) - 200,
  speed: 1.4 + ((i * 0.43) % 1.8),
  size: 3 + ((i * 0.31) % 5),
  opacity: 0.15 + ((i * 0.07) % 0.25),
  delay: (i * 11) % 60,
}));

const ParticleLayer = ({ frame, visible }) => {
  const layerOp = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: layerOp,
        pointerEvents: 'none',
      }}
    >
      {PARTICLES.map((p, i) => {
        const localFrame = Math.max(0, frame - p.delay);
        const y = (p.startY + localFrame * p.speed) % 2200;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#00A550',
              opacity: p.opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export const TheRest = () => {
  loadSpaceGrotesk();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opening silence — 20 frames
  const openBlack = frame < 20 ? 1 : 0;

  // "Your business." — appears at frame 38
  const line1S = spring({
    frame: Math.max(0, frame - 38),
    fps,
    config: { stiffness: 140, damping: 22, mass: 1.4 },
  });
  const line1Op = interpolate(line1S, [0, 0.14], [0, 1]);
  const line1Y = interpolate(line1S, [0, 1], [48, 0]);

  // "Running while you rest." — appears at frame 72
  const line2S = spring({
    frame: Math.max(0, frame - 72),
    fps,
    config: { stiffness: 120, damping: 22, mass: 1.6 },
  });
  const line2Op = interpolate(line2S, [0, 0.14], [0, 1]);
  const line2Y = interpolate(line2S, [0, 1], [44, 0]);

  // Scene 1 fades out at frame 250
  const scene1Op = interpolate(frame, [240, 260], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Urgency badge — "3 spots · Nairobi only"
  const badgeOp = interpolate(frame, [266, 284], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Offer line — "DM me."
  const dmS = spring({
    frame: Math.max(0, frame - 296),
    fps,
    config: { stiffness: 420, damping: 20, mass: 2.4 },
    durationInFrames: 28,
  });
  const dmScale = interpolate(dmS, [0, 1], [3.2, 1.0]);
  const dmOp = frame >= 296 ? interpolate(dmS, [0, 0.08], [0, 1]) : 0;

  // Sub-CTA
  const subCtaOp = interpolate(frame, [320, 338], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Criteria
  const criteriaOp = interpolate(frame, [338, 356], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Final green wash
  const greenWash = interpolate(frame, [374, 380, 386, 390], [0, 0.22, 0.08, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const showScene2 = frame >= 256;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505' }}>
      <Grain frame={frame} opacity={0.045} />

      {/* Opening black */}
      {openBlack > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 20,
          }}
        />
      )}

      {/* Particle rain — orders processing silently */}
      <ParticleLayer frame={frame} visible={frame >= 20} />

      {/* Warm glow — phone-screen warmth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,165,80,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── SCENE 1: "Your business. Running while you rest." ───────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          opacity: scene1Op,
        }}
      >
        {/* Accent */}
        <div
          style={{
            width: 44,
            height: 3,
            backgroundColor: '#00A550',
            borderRadius: 2,
            marginBottom: 48,
            opacity: line1Op,
          }}
        />

        {/* Line 1 */}
        <div
          style={{
            opacity: line1Op,
            transform: `translateY(${line1Y}px)`,
            fontFamily: FONT,
            fontSize: 110,
            fontWeight: 800,
            color: '#FAFAFA',
            lineHeight: 0.95,
            letterSpacing: -4,
            marginBottom: 28,
          }}
        >
          Your
          <br />
          business.
        </div>

        {/* Line 2 */}
        <div
          style={{
            opacity: line2Op,
            transform: `translateY(${line2Y}px)`,
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.35,
            letterSpacing: -1.5,
          }}
        >
          Running while
          <br />
          you rest.
        </div>
      </div>

      {/* ── SCENE 2: The offer ──────────────────────────────────────────── */}
      {showScene2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          {/* Urgency badge */}
          <div
            style={{
              opacity: badgeOp,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              backgroundColor: 'rgba(245,158,11,0.12)',
              border: '1.5px solid rgba(245,158,11,0.35)',
              borderRadius: 50,
              padding: '14px 28px',
              marginBottom: 48,
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontFamily: FONT,
                fontSize: 30,
                fontWeight: 600,
                color: '#F59E0B',
              }}
            >
              3 spots · Nairobi only
            </div>
          </div>

          {/* "DM me." — kinetic impact */}
          <div
            style={{
              opacity: dmOp,
              transform: `scale(${dmScale})`,
              transformOrigin: 'left center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 200,
                fontWeight: 900,
                color: '#00A550',
                lineHeight: 0.82,
                letterSpacing: -10,
              }}
            >
              DM
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 200,
                fontWeight: 900,
                color: '#00A550',
                lineHeight: 0.82,
                letterSpacing: -10,
              }}
            >
              me.
            </div>
          </div>

          {/* Sub CTA */}
          <div
            style={{
              opacity: subCtaOp,
              fontFamily: FONT,
              fontSize: 40,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: -0.5,
              marginBottom: 36,
            }}
          >
            Fashion · Food · Groceries · Any WhatsApp business
          </div>

          {/* Criteria */}
          <div style={{ opacity: criteriaOp }}>
            {[
              'Currently sell via WhatsApp',
              'Accept M-Pesa',
              'Based in Nairobi',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
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
                      fontSize: 14,
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
                    fontSize: 34,
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>

          {/* Fine print */}
          <div
            style={{
              marginTop: 28,
              opacity: criteriaOp * 0.6,
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: 1.5,
            }}
          >
            NO CONTRACT · NO SETUP FEES · STOP ANYTIME
          </div>
        </div>
      )}

      {/* Final green wash — hope, not just a CTA */}
      {greenWash > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#00A550',
            opacity: greenWash,
            zIndex: 15,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
