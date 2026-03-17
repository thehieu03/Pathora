import React from "react";
import { BiCheck } from "react-icons/bi";
import { MdAndroid, MdFacebook } from "react-icons/md";
import { FaApple } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";

import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowDownTray,
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowRight,
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineBookmark,
  HiOutlineBuildingOffice,
  HiOutlineCalendarDays,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocument,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineDevicePhoneMobile,
  HiOutlineDocumentText,
  HiOutlineDocument,
  HiOutlineEnvelope,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineEyeSlash,
  HiOutlineEye,
  HiOutlineFunnel,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineHomeModern,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineKey,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineMap,
  HiOutlineMinus,
  HiOutlineMoon,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineQuestionMarkCircle,
  HiOutlineShare,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineStar,
  HiOutlineSun,
  HiOutlineTag,
  HiOutlineTicket,
  HiOutlineTrash,
  HiOutlineTrophy,
  HiOutlineTruck,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineWallet,
  HiOutlineWrenchScrewdriver,
  HiOutlineXCircle,
  HiOutlineXMark,
  HiMapPin,
  HiStar,
  HiUserCircle,
  HiCheckCircle,
} from "react-icons/hi2";

type IconProps = {
  icon: string;
  className?: string;
  width?: number | string;
  rotate?: number;
  hFlip?: boolean;
  vFlip?: boolean;
  ariaHidden?: boolean;
  ariaLabel?: string;
  [key: string]: unknown;
};

// Map old iconify string names to react-icons components
const iconMap: Record<string, React.ElementType> = {
  "bi:check-lg": BiCheck,
  "heroicons-outline:adjustments-horizontal": HiOutlineAdjustmentsHorizontal,
  "heroicons-outline:arrow-left": HiOutlineArrowLeft,
  "heroicons-outline:arrow-path": HiOutlineArrowPath,
  "heroicons-outline:arrow-right": HiOutlineArrowRight,
  "heroicons-outline:bars-3": HiOutlineBars3,
  "heroicons-outline:calendar": HiOutlineCalendar,
  "heroicons-outline:calendar-days": HiOutlineCalendarDays,
  "heroicons-outline:chat-bubble-oval-left": HiOutlineChatBubbleOvalLeft,
  "heroicons-outline:check": HiOutlineCheck,
  "heroicons-outline:chevron-down": HiOutlineChevronDown,
  "heroicons-outline:chevron-left": HiOutlineChevronLeft,
  "heroicons-outline:chevron-right": HiOutlineChevronRight,
  "heroicons-outline:clock": HiOutlineClock,
  "heroicons-outline:exclamation-circle": HiOutlineExclamationCircle,
  "heroicons-outline:eye": HiOutlineEye,
  "heroicons-outline:eye-off": HiOutlineEyeSlash,
  "heroicons-outline:home": HiOutlineHome,
  "heroicons-outline:information-circle": HiOutlineInformationCircle,
  "heroicons-outline:key": HiOutlineKey,
  "heroicons-outline:magnifying-glass": HiOutlineMagnifyingGlass,
  "heroicons-outline:menu": HiOutlineBars3,
  "heroicons-outline:moon": HiOutlineMoon,
  "heroicons-outline:phone": HiOutlinePhone,
  "heroicons-outline:photo": HiOutlinePhoto,
  "heroicons-outline:search": HiOutlineMagnifyingGlass,
  "heroicons-outline:sparkles": HiOutlineSparkles,
  "heroicons-outline:squares-2x2": HiOutlineSquares2X2,
  "heroicons-outline:sun": HiOutlineSun,
  "heroicons-outline:trophy": HiOutlineTrophy,
  "heroicons-outline:user-group": HiOutlineUserGroup,
  "heroicons-outline:x": HiOutlineXMark,
  "heroicons-outline:x-mark": HiOutlineXMark,
  "heroicons-solid:map-pin": HiMapPin,
  "heroicons-solid:star": HiStar,
  "heroicons-solid:user-circle": HiUserCircle,
  "heroicons:arrow-down-tray": HiOutlineArrowDownTray,
  "heroicons:arrow-left": HiOutlineArrowLeft,
  "heroicons:arrow-path": HiOutlineArrowPath,
  "heroicons:arrow-right": HiOutlineArrowRight,
  "heroicons:arrow-right-on-rectangle": HiOutlineArrowRightOnRectangle,
  "heroicons:bars-3": HiOutlineBars3,
  "heroicons:bell": HiOutlineBell,
  "heroicons:bookmark": HiOutlineBookmark,
  "heroicons:building-office": HiOutlineBuildingOffice,
  "heroicons:calendar": HiOutlineCalendar,
  "heroicons:calendar-days": HiOutlineCalendarDays,
  "heroicons:chart-bar": HiOutlineChartBar,
  "heroicons:chat-bubble-bottom-center-text": HiOutlineChatBubbleBottomCenterText,
  "heroicons:chat-bubble-oval-left": HiOutlineChatBubbleOvalLeft,
  "heroicons:chat-bubble-oval-left-ellipsis": HiOutlineChatBubbleOvalLeftEllipsis,
  "heroicons:check": HiOutlineCheck,
  "heroicons:check-circle": HiOutlineCheckCircle,
  "heroicons:check-circle-solid": HiCheckCircle,
  "heroicons:chevron-double-left": HiOutlineChevronDoubleLeft,
  "heroicons:chevron-double-right": HiOutlineChevronDoubleRight,
  "heroicons:chevron-down": HiOutlineChevronDown,
  "heroicons:chevron-left": HiOutlineChevronLeft,
  "heroicons:chevron-right": HiOutlineChevronRight,
  "heroicons:clipboard-document": HiOutlineClipboardDocument,
  "heroicons:clipboard-document-check": HiOutlineClipboardDocumentCheck,
  "heroicons:clock": HiOutlineClock,
  "heroicons:credit-card": HiOutlineCreditCard,
  "heroicons:cube": HiOutlineCube,
  "heroicons:currency-dollar": HiOutlineCurrencyDollar,
  "heroicons:device-phone-mobile": HiOutlineDevicePhoneMobile,
  "heroicons:document": HiOutlineDocument,
  "heroicons:document-text": HiOutlineDocumentText,
  "heroicons:envelope": HiOutlineEnvelope,
  "heroicons:exclamation-circle": HiOutlineExclamationCircle,
  "heroicons:exclamation-triangle": HiOutlineExclamationTriangle,
  "heroicons:eye": HiOutlineEye,
  "heroicons:funnel": HiOutlineFunnel,
  "heroicons:globe-alt": HiOutlineGlobeAlt,
  "heroicons:heart": HiOutlineHeart,
  "heroicons:home-modern": HiOutlineHomeModern,
  "heroicons:information-circle": HiOutlineInformationCircle,
  "heroicons:magnifying-glass": HiOutlineMagnifyingGlass,
  "heroicons:map": HiOutlineMap,
  "heroicons:map-pin": HiOutlineMapPin,
  "heroicons:minus": HiOutlineMinus,
  "heroicons:paper-airplane": HiOutlinePaperAirplane,
  "heroicons:pencil-square": HiOutlinePencilSquare,
  "heroicons:phone": HiOutlinePhone,
  "heroicons:photo": HiOutlinePhoto,
  "heroicons:plus": HiOutlinePlus,
  "heroicons:share": HiOutlineShare,
  "heroicons:shield-check": HiOutlineShieldCheck,
  "heroicons:sparkles": HiOutlineSparkles,
  "heroicons:star": HiOutlineStar,
  "heroicons:star-solid": HiStar,
  "heroicons:tag": HiOutlineTag,
  "heroicons:ticket": HiOutlineTicket,
  "heroicons:trash": HiOutlineTrash,
  "heroicons:truck": HiOutlineTruck,
  "heroicons:user": HiOutlineUser,
  "heroicons:user-circle": HiOutlineUserCircle,
  "heroicons:user-group": HiOutlineUserGroup,
  "heroicons:users": HiOutlineUsers,
  "heroicons:wallet": HiOutlineWallet,
  "heroicons:wrench-screwdriver": HiOutlineWrenchScrewdriver,
  "heroicons:x-circle": HiOutlineXCircle,
  "heroicons:x-mark": HiOutlineXMark,
  "mdi:android": MdAndroid,
  "mdi:apple": FaApple,
  "mdi:facebook": MdFacebook,
  "ri:facebook-fill": RiFacebookFill,
};

export const Icon = ({
  icon,
  className,
  width,
  rotate,
  hFlip,
  vFlip,
  ariaHidden = true,
  ariaLabel,
  ...rest
}: IconProps) => {
  const IconComponent = iconMap[icon] || HiOutlineQuestionMarkCircle;

  // Handle transformations
  const style: React.CSSProperties = {};
  if (rotate) {
    style.transform = `rotate(${rotate}deg)`;
  }
  if (hFlip) {
    style.transform = `${style.transform || ""} scaleX(-1)`.trim();
  }
  if (vFlip) {
    style.transform = `${style.transform || ""} scaleY(-1)`.trim();
  }

  // Size mapping
  const size = width ? (typeof width === "number" ? width : width) : undefined;

  // Filter out undefined values and empty styles to avoid hydration mismatch with Dark Reader
  const sanitizedStyle = style && Object.entries(style).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);

  return (
    <IconComponent
      className={className}
      style={Object.keys(sanitizedStyle || {}).length > 0 ? sanitizedStyle : undefined}
      size={size}
      aria-hidden={ariaLabel ? false : ariaHidden}
      aria-label={ariaLabel}
      suppressHydrationWarning
      {...rest}
    />
  );
};

export default Icon;
