import { HomeIcon, ShoppingCartIcon, InfoIcon, UserIcon, MailIcon } from 'lucide-react';
import { type ComponentType, type SVGProps } from 'react';

export interface NavLink {
  href: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About Us', icon: InfoIcon },
  { href: '/contact', label: 'Contact', icon: MailIcon },
  { href: '/cart', label: 'Cart', icon: ShoppingCartIcon },
  { href: '/account', label: 'My Account', icon: UserIcon },
];
