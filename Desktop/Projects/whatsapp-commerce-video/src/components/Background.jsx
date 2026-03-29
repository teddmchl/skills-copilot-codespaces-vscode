// Minimal solid backgrounds — no glow orbs, no "AI template" gradients.
// Each slide uses flat color with subtle geometric accent only.

export const Background = ({ variant = 'dark' }) => {
  const colors = {
    dark:    '#0a0a0a',
    problem: '#0a0a0a',
    stats:   '#0a0a0a',
    cta:     '#0a0a0a',
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: colors[variant] || '#0a0a0a',
      }}
    />
  );
};
