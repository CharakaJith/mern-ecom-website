export const Sizes = {
  SMALL: 'S',
  MEDIUM: 'M',
  LARGE: 'L',
  XLARGE: 'XL',

  values: ['S', 'M', 'L', 'XL'] as const,
};

export type Size = (typeof Sizes.values)[number];
