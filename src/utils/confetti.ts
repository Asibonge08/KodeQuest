import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.65 },
    colors: ['#38bdf8', '#34d399', '#fbbf24', '#a78bfa', '#f43f5e']
  });
}

export function fireLevelUpConfetti() {
  const end = Date.now() + 1000;
  const colors = ['#38bdf8', '#fbbf24', '#34d399'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
