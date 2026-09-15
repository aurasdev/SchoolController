export const loginBreakpoints = {
  desktop: 900
} as const;

export const loginColors = {
  danger: '#e2252a',
  primary: '#2f67e8',
  primarySubtle: '#d9e7ff',
  success: '#1aa34a',
  surfaceBg: '#f7f7f8',
  surfaceBorder: '#e2e2e6',
  surfaceCard: '#ffffff',
  textDisabled: '#a3a3ad',
  textPrimary: '#1a1a1d',
  textSecondary: '#7c7c86'
} as const;

export const rememberSwitchTrackColor = {
  false: loginColors.surfaceBorder,
  true: loginColors.primarySubtle
} as const;
