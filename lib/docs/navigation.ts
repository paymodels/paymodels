export interface DocNavItem {
  title: string;
  slug: string;
  href: string;
  children?: DocNavItem[];
}

export interface DocNavGroup {
  title: string;
  items: DocNavItem[];
}

export const docNavigation: DocNavGroup[] = [
  {
    title: '常见问题',
    items: [
      { title: '常见问题总览', slug: 'faq', href: '/docs/faq' },
    ],
  },
  {
    title: '使用指南',
    items: [
      { title: '使用指南首页', slug: 'guide', href: '/docs/guide' },
      { title: '如何获取 Token', slug: 'guide-token', href: '/docs/guide/token' },
      { title: '如何充值 Plus', slug: 'guide-recharge-plus', href: '/docs/guide/recharge-plus' },
      { title: '如何充值 Pro', slug: 'guide-recharge-pro', href: '/docs/guide/recharge-pro' },
    ],
  },
  {
    title: '退款政策',
    items: [
      { title: '退款政策', slug: 'refund', href: '/docs/refund' },
    ],
  },
  {
    title: '支付方式',
    items: [
      { title: '支付方式说明', slug: 'payment', href: '/docs/payment' },
    ],
  },
];

export function findDocBySlug(slug: string): DocNavItem | undefined {
  for (const group of docNavigation) {
    for (const item of group.items) {
      if (item.slug === slug) return item;
    }
  }
  return undefined;
}

export function findDocByHref(href: string): DocNavItem | undefined {
  for (const group of docNavigation) {
    for (const item of group.items) {
      if (item.href === href) return item;
    }
  }
  return undefined;
}
