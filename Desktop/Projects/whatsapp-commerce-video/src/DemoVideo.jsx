import { AbsoluteFill, Series, Audio, Sequence, staticFile } from 'remotion';
import { NightSlide }      from './components/NightSlide';
import { CostSlide }       from './components/CostSlide';
import { ImmersiveChat }   from './components/ImmersiveChat';
import { ImpactNumbers }   from './components/ImpactNumbers';
import { TheRest }         from './components/TheRest';

// ─────────────────────────────────────────────────────────────────────────────
// "Amina's Midnight" — WhatsApp Commerce OS product video
// Total: 1800 frames @ 30fps = 60 seconds
//
// Concept: We follow one merchant's reality → the transformation → the offer.
// No phone mockup. No stat slides. Just film.
//
//  0  – 120  (4s)  NightSlide     ← Amina's midnight M-Pesa ritual
//  120 – 390  (9s)  CostSlide      ← Three smash-cut confessions
//  390 – 1140 (25s) ImmersiveChat  ← Full-canvas WhatsApp demo (no bezel)
// 1140 – 1410 (9s)  ImpactNumbers  ← Three kinetic number impacts
// 1410 – 1800 (13s) TheRest        ← Quiet close + the ask
// ─────────────────────────────────────────────────────────────────────────────

// Message notification ping frames (absolute global frames)
// Synced with ImmersiveChat message arrivals (ImmersiveChat starts at frame 390)
const MSG_FRAMES = [410, 455, 555, 595, 685, 722, 805, 838, 920, 955, 1090, 1130];

export const DemoVideo = () => {
  return (
    <AbsoluteFill>

      {/* ── Background music ───────────────────────────────────────────────
          RECOMMENDED (free, commercial OK, no attribution):
          "GBE BODY" by audiolibraryinfinite — upbeat Afrobeats, 2:28
          → pixabay.com/music/upbeat-gbe-body-345419/
          Download → save as public/bgmusic.mp3

          BACKUP: "Afro Beat Pop" by HitsLab
          → pixabay.com/music/afrobeat-afro-beat-pop-african-afrobeat-music-328731/

          Pixabay Content License: free commercial use, zero attribution.
      ─────────────────────────────────────────────────────────────────── */}
      <Audio
        src={staticFile('bgmusic.mp3')}
        volume={(f) => {
          // Night section: quieter (intimate feel)
          if (f < 120) return (f < 30 ? (f / 30) * 0.12 : 0.12);
          // Cost section: builds slightly
          if (f < 390) return 0.15;
          // Chat demo: present but not distracting
          if (f < 1140) return 0.18;
          // Stats: punchy
          if (f < 1410) return 0.22;
          // TheRest: fades out
          if (f > 1770) return ((1800 - f) / 30) * 0.16;
          return 0.16;
        }}
      />

      {/* ── Message notification pings ─────────────────────────────────────
          Subtle 880Hz WAV ding synced to each WhatsApp bubble pop.
          Keeps the immersive chat feeling real without music interruption.
      ─────────────────────────────────────────────────────────────────── */}
      {MSG_FRAMES.map((f, i) => (
        <Sequence key={i} from={f} durationInFrames={8}>
          <Audio src={staticFile('msg.wav')} volume={0.3} />
        </Sequence>
      ))}

      <Series>
        {/* 1. Night — Amina's midnight */}
        <Series.Sequence durationInFrames={120}>
          <NightSlide />
        </Series.Sequence>

        {/* 2. Cost — Three confessions */}
        <Series.Sequence durationInFrames={270}>
          <CostSlide />
        </Series.Sequence>

        {/* 3. Immersive chat — no phone frame */}
        <Series.Sequence durationInFrames={750}>
          <ImmersiveChat />
        </Series.Sequence>

        {/* 4. Impact numbers — kinetic stats */}
        <Series.Sequence durationInFrames={270}>
          <ImpactNumbers />
        </Series.Sequence>

        {/* 5. TheRest — the quiet ask */}
        <Series.Sequence durationInFrames={390}>
          <TheRest />
        </Series.Sequence>
      </Series>

    </AbsoluteFill>
  );
};
