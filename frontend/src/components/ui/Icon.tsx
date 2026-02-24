import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";

const Icon = ({
  icon,
  className,
  width,
  rotate,
  hFlip,
  vFlip,
  ...props
}: {
  icon: string;
  className?: string;
  width?: number;
  rotate?: number;
  hFlip?: boolean;
  vFlip?: boolean;
  [key: string]: any;
}) => {
  return (
    <>
      <IconifyIcon
        width={width}
        rotate={rotate}
        hFlip={hFlip}
        icon={icon}
        className={className}
        vFlip={vFlip}
        {...props}
      />
    </>
  );
};

export default Icon;
