import React from "react";
import * as LucideIcons from "lucide-react";

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

// Map old iconify string names to Lucide component names
const iconMap: Record<string, keyof typeof LucideIcons> = {
  "bi:check-lg": "Check",
  "heroicons-outline:adjustments-horizontal": "SlidersHorizontal",
  "heroicons-outline:arrow-left": "ArrowLeft",
  "heroicons-outline:arrow-path": "RefreshCw",
  "heroicons-outline:arrow-right": "ArrowRight",
  "heroicons-outline:bars-3": "Menu",
  "heroicons-outline:calendar": "Calendar",
  "heroicons-outline:calendar-days": "CalendarDays",
  "heroicons-outline:chat-bubble-oval-left": "MessageCircle",
  "heroicons-outline:check": "Check",
  "heroicons-outline:chevron-down": "ChevronDown",
  "heroicons-outline:chevron-left": "ChevronLeft",
  "heroicons-outline:chevron-right": "ChevronRight",
  "heroicons-outline:clock": "Clock",
  "heroicons-outline:exclamation-circle": "AlertCircle",
  "heroicons-outline:eye": "Eye",
  "heroicons-outline:eye-off": "EyeOff",
  "heroicons-outline:home": "Home",
  "heroicons-outline:information-circle": "Info",
  "heroicons-outline:key": "Key",
  "heroicons-outline:magnifying-glass": "Search",
  "heroicons-outline:menu": "Menu",
  "heroicons-outline:moon": "Moon",
  "heroicons-outline:phone": "Phone",
  "heroicons-outline:photo": "Image",
  "heroicons-outline:search": "Search",
  "heroicons-outline:sparkles": "Sparkles",
  "heroicons-outline:squares-2x2": "LayoutGrid",
  "heroicons-outline:sun": "Sun",
  "heroicons-outline:trophy": "Trophy",
  "heroicons-outline:user-group": "Users",
  "heroicons-outline:x": "X",
  "heroicons-outline:x-mark": "X",
  "heroicons-solid:map-pin": "MapPin",
  "heroicons-solid:star": "Star",
  "heroicons-solid:user-circle": "UserCircle",
  "heroicons:arrow-down-tray": "Download",
  "heroicons:arrow-left": "ArrowLeft",
  "heroicons:arrow-path": "RefreshCw",
  "heroicons:arrow-right": "ArrowRight",
  "heroicons:arrow-right-on-rectangle": "LogOut",
  "heroicons:bars-3": "Menu",
  "heroicons:bell": "Bell",
  "heroicons:bookmark": "Bookmark",
  "heroicons:building-office": "Building",
  "heroicons:calendar": "Calendar",
  "heroicons:calendar-days": "CalendarDays",
  "heroicons:chart-bar": "BarChart",
  "heroicons:chat-bubble-bottom-center-text": "MessageSquare",
  "heroicons:chat-bubble-oval-left": "MessageCircle",
  "heroicons:chat-bubble-oval-left-ellipsis": "MessageSquare",
  "heroicons:check": "Check",
  "heroicons:check-circle": "CheckCircle",
  "heroicons:check-circle-solid": "CheckCircle2",
  "heroicons:chevron-double-left": "ChevronsLeft",
  "heroicons:chevron-double-right": "ChevronsRight",
  "heroicons:chevron-down": "ChevronDown",
  "heroicons:chevron-left": "ChevronLeft",
  "heroicons:chevron-right": "ChevronRight",
  "heroicons:clipboard-document": "Clipboard",
  "heroicons:clipboard-document-check": "ClipboardCheck",
  "heroicons:clock": "Clock",
  "heroicons:credit-card": "CreditCard",
  "heroicons:cube": "Box",
  "heroicons:currency-dollar": "DollarSign",
  "heroicons:device-phone-mobile": "Smartphone",
  "heroicons:document": "File",
  "heroicons:document-text": "FileText",
  "heroicons:envelope": "Mail",
  "heroicons:exclamation-circle": "AlertCircle",
  "heroicons:exclamation-triangle": "AlertTriangle",
  "heroicons:eye": "Eye",
  "heroicons:funnel": "Filter",
  "heroicons:globe-alt": "Globe",
  "heroicons:heart": "Heart",
  "heroicons:home-modern": "Home",
  "heroicons:information-circle": "Info",
  "heroicons:magnifying-glass": "Search",
  "heroicons:map": "Map",
  "heroicons:map-pin": "MapPin",
  "heroicons:minus": "Minus",
  "heroicons:paper-airplane": "Send",
  "heroicons:pencil-square": "Edit",
  "heroicons:phone": "Phone",
  "heroicons:photo": "Image",
  "heroicons:plus": "Plus",
  "heroicons:share": "Share",
  "heroicons:shield-check": "ShieldCheck",
  "heroicons:sparkles": "Sparkles",
  "heroicons:star": "Star",
  "heroicons:star-solid": "Star",
  "heroicons:tag": "Tag",
  "heroicons:ticket": "Ticket",
  "heroicons:trash": "Trash",
  "heroicons:truck": "Truck",
  "heroicons:user": "User",
  "heroicons:user-circle": "UserCircle",
  "heroicons:user-group": "Users",
  "heroicons:users": "Users",
  "heroicons:wallet": "Wallet",
  "heroicons:wrench-screwdriver": "Wrench",
  "heroicons:x-circle": "XCircle",
  "heroicons:x-mark": "X",
  "mdi:android": "Smartphone",
  "mdi:apple": "Apple",
  "mdi:facebook": "Facebook",
  "ri:facebook-fill": "Facebook"
};

const Icon = ({
  icon,
  className = "",
  width,
  rotate,
  hFlip,
  vFlip,
  ariaHidden = true,
  ariaLabel,
  ...props
}: IconProps) => {
  // If icon passed is already a valid Lucide component name string (e.g. "ArrowLeft")
  // Or it's mapped from the old iconify string
  const lucideName = iconMap[icon] || icon;
  
  // dynamic indexing into LucideIcons
  const LucideComponent = (LucideIcons as any)[lucideName] || LucideIcons.HelpCircle;

  // Handle transformations
  const transformStyle: React.CSSProperties = {};
  if (rotate) transformStyle.transform = `rotate(${rotate}deg)`;
  if (hFlip || vFlip) {
    transformStyle.transform = `${transformStyle.transform || ''} scale(${hFlip ? -1 : 1}, ${vFlip ? -1 : 1})`;
  }

  return (
    <LucideComponent
      className={className}
      width={width || 24}
      height={width || 24}
      style={Object.keys(transformStyle).length > 0 ? transformStyle : undefined}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

export default Icon;
