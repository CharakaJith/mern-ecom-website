export const Categories = {
  MEN: 'Men',
  WOMEN: 'Women',
  KIDS: 'Kids',

  values: ['Men', 'Women', 'Kids'] as const,
};

export type Category = (typeof Categories.values)[number];
