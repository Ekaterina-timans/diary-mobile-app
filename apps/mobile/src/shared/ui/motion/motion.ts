export const motion = {
  screenEnter: {
    from: { opacity: 0, transform: [{ translateY: 20 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
    duration: 450,
  },

  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 400,
  },

  scalePress: {
    from: { transform: [{ scale: 1 }] },
    to: { transform: [{ scale: 0.97 }] },
    duration: 120,
  },

  glowPulse: {
    from: { opacity: 0.7 },
    to: { opacity: 1 },
    duration: 2000,
  },
}
