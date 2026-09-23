import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const ArrowIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const ChevronIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="m7 10 5 5 5-5" /></svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M4 7h16M4 12h16M8 17h12" /></svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base(props)}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
);

export const FilterIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M7.5 3.5 10 8 7.8 9.8a14 14 0 0 0 6.4 6.4L16 14l4.5 2.5-1.4 3.1c-.3.7-1.1 1.1-1.9.9C9.7 18.7 5.3 14.3 3.5 6.8c-.2-.8.2-1.6.9-1.9z" /></svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg {...base(props)}><rect x="8" y="8" width="11" height="11" rx="1" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
);

export const ExternalIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M14 5h5v5M19 5l-8 8" /><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
);

export const ShareIcon = (props: IconProps) => (
  <svg {...base(props)}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="m5 12 4 4L19 6" /></svg>
);

export const FlowerMark = (props: IconProps) => (
  <svg {...base(props)} viewBox="0 0 32 32">
    <path d="M16 28V15" /><path d="M16 21c-4-1-6-3-7-6 4 0 6 1 7 4" /><path d="M16 24c4-1 6-3 7-6-4 0-6 1-7 4" />
    <path d="M16 15c-4 0-7-2-7-5 0-2 2-3 4-2-1-3 1-5 3-5s4 2 3 5c2-1 4 0 4 2 0 3-3 5-7 5Z" />
  </svg>
);
