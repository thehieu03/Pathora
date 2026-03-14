import React from "react";
import useSkin from "@/hooks/useSkin";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerSlot?: React.ReactNode;
  className?: string;
  bodyClass?: string;
  noBorder?: boolean;
  titleClass?: string;
};

const Card = ({
  children,
  title,
  subtitle,
  headerSlot,
  className = " ",
  bodyClass = "p-6",
  noBorder,
  titleClass = "text-foreground",
  ...props
}: CardProps) => {
  const [skin] = useSkin();

  return (
    <div
      {...props}
      className={`card rounded-xl bg-card text-card-foreground transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        skin === "bordered"
          ? "border border-border"
          : "shadow-md"
      } ${className}`}
    >
      {(title || subtitle) && (
        <header className={`card-header ${noBorder ? "no-border" : ""}`}>
          <div>
            {title && <div className={`card-title ${titleClass}`}>{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {headerSlot && <div className="card-header-slot">{headerSlot}</div>}
        </header>
      )}
      <main className={`card-body ${bodyClass}`}>{children}</main>
    </div>
  );
};

export default Card;
