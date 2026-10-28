export const colors = {
  primary: '#15803D',
  primaryDark: '#166534',
  primaryLight: '#DCFCE7',

  secondary: '#0F172A',
  background: '#F1F5F9',
  card: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  textWhite: '#FFFFFF',


  statusActive: '#16A34A',
  statusActiveBg: '#DCFCE7',
  statusMaintenance: '#D97706',
  statusMaintenanceBg: '#FEF3C7',


  error: '#EF4444',
  errorBg: '#FEE2E2',
  warning: '#F59E0B',
  info: '#3B82F6',


  border: '#CBD5E1',
  borderLight: '#E2E8F0',
  disabled: '#94A3B8',
  disabledBg: '#E2E8F0',
  disabledCard: '#F8FAFC',


  danger: '#DC2626',
  dangerBg: '#FEE2E2',
};

export const typography = {
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  price: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
};

