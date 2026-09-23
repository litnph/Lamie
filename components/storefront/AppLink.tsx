import type { AnchorHTMLAttributes, MouseEvent } from 'react';

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  navigate: (to: string) => void;
}

export const AppLink = ({ href, navigate, onClick, ...props }: AppLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || props.target === '_blank'
    ) return;
    event.preventDefault();
    navigate(href);
  };

  return <a href={href} onClick={handleClick} {...props} />;
};
