export interface NavChild {
  label: string;
  path: string;
  icon?: string;
  labelColor?: string;
}

export interface NavItem {
  type: 'link' | 'heading';
  label: string;
  path?: string;
  icon?: string;
  labelColor?: string;
  hoverLabelColor?: string;
  hoverLinkAnimation?: string;
  children?: NavChild[];
}

export const hoverLinkAnimations = [
  {
    type: 'underline',
    animation:
      'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#005480] after:transition-all after:duration-300 hover:after:w-full',
  },
];

export const NavigationConfig: NavItem[] = [
  // { type: 'heading', label: 'Main Section' },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_1',
    path: '/',
    labelColor: 'text-[#64748b]',
    hoverLabelColor: 'hover:!text-[#005480] transition duration-200',
    hoverLinkAnimation: hoverLinkAnimations[0].animation,
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_2',
    path: '/about',
    labelColor: 'text-[#64748b]',
    hoverLabelColor: 'hover:!text-[#005480] transition duration-200',
    hoverLinkAnimation: hoverLinkAnimations[0].animation,
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_3',
    path: '/give',
    labelColor: 'text-[#64748b]',
    hoverLabelColor: 'hover:!text-[#005480] transition duration-200',
    hoverLinkAnimation: hoverLinkAnimations[0].animation,
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_4',
    path: '/contact',
    labelColor: 'text-[#64748b]',
    hoverLabelColor: 'hover:!text-[#005480] transition duration-200',
    hoverLinkAnimation: hoverLinkAnimations[0].animation,
  },
];
