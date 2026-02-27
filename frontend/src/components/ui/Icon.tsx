import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";

type IconProps = {
  icon: string;
  className?: string;
  width?: number;
  rotate?: number;
  hFlip?: boolean;
  vFlip?: boolean;
  ariaHidden?: boolean;
  ariaLabel?: string;
  [key: string]: unknown;
};

const Icon = ({
  icon,
  className,
  width,
  rotate,
  hFlip,
  vFlip,
  ariaHidden = true,
  ariaLabel,
  ...props
}: IconProps) => {
  return (
    <IconifyIcon
      width={width}
      rotate={rotate}
      hFlip={hFlip}
      icon={icon}
      className={className}
      vFlip={vFlip}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

export default Icon;
