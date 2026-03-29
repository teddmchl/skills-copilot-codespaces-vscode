import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

// Load Inter — available in @remotion/google-fonts, renders cleanly everywhere
const { fontFamily } = loadInter('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const FONT = fontFamily;

// No-op kept for call-site compatibility in older components
export const loadSpaceGrotesk = () => {};
