"use client";
import { Button, Icon } from "@/components/ui";

export const SectionContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`max-w-330 mx-auto px-4 md:px-3.75 ${className}`}>
    {children}
  </div>
);

export const NavArrows = ({
  size = 10,
  onPrev,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Next",
}: {
  size?: 10 | 11;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}) => {
  const dim = size === 11 ? "w-11.25 h-11.25" : "w-10 h-10";
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onPrev}
        className={`${dim} rounded-full border border-landing-border flex items-center justify-center hover:bg-landing-accent hover:border-landing-accent transition-colors group bg-transparent`}
        icon="heroicons-outline:chevron-left"
        iconClass="text-[20px] text-landing-body group-hover:text-white transition-colors"
        ariaLabel={prevLabel}
      />
      <Button
        onClick={onNext}
        className={`${dim} rounded-full border border-landing-border flex items-center justify-center hover:bg-landing-accent hover:border-landing-accent transition-colors group bg-transparent`}
        icon="heroicons-outline:chevron-right"
        iconClass="text-[20px] text-landing-body group-hover:text-white transition-colors"
        ariaLabel={nextLabel}
      />
    </div>
  );
};

export const StarRating = ({
  count,
  size = "sm",
}: {
  count: number;
  size?: "sm" | "md";
}) => {
  const cls = size === "md" ? "w-4 h-4" : "w-2.5 h-2.5";
  const gap = size === "md" ? "gap-1" : "gap-0.5";
  const color = size === "md" ? "text-landing-accent" : "text-[#e2ad64]";
  return (
    <div
      className={`flex items-center ${gap}`}
      role="img"
      aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon
          key={i}
          icon="heroicons-solid:star"
          className={`${cls} ${color}`}
        />
      ))}
    </div>
  );
};
