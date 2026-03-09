import fs from 'fs';
import path from 'path';

// read all unique icon strings
const output = fs.readFileSync('icon_strings.txt', 'utf-8');
const iconStrings = output.split('\n').filter(Boolean);

const mapper = {};

const mappingNames = {
  "arrow-left": "ArrowLeft",
  "arrow-right": "ArrowRight",
  "arrow-down-tray": "Download",
  "arrow-path": "RefreshCw",
  "arrow-right-on-rectangle": "LogOut",
  "bars-3": "Menu",
  "bell": "Bell",
  "bookmark": "Bookmark",
  "building-office": "Building",
  "calendar": "Calendar",
  "calendar-days": "CalendarDays",
  "chart-bar": "BarChart",
  "chat-bubble-bottom-center-text": "MessageSquare",
  "chat-bubble-oval-left": "MessageCircle",
  "chat-bubble-oval-left-ellipsis": "MessageSquareMore",
  "check": "Check",
  "check-circle": "CheckCircle",
  "check-circle-solid": "CheckCircle2",
  "chevron-double-left": "ChevronsLeft",
  "chevron-double-right": "ChevronsRight",
  "chevron-down": "ChevronDown",
  "chevron-left": "ChevronLeft",
  "chevron-right": "ChevronRight",
  "clipboard-document": "Clipboard",
  "clipboard-document-check": "ClipboardCheck",
  "clock": "Clock",
  "credit-card": "CreditCard",
  "cube": "Box",
  "currency-dollar": "DollarSign",
  "device-phone-mobile": "Smartphone",
  "document": "File",
  "document-text": "FileText",
  "envelope": "Mail",
  "exclamation-circle": "AlertCircle",
  "exclamation-triangle": "AlertTriangle",
  "eye": "Eye",
  "eye-off": "EyeOff",
  "funnel": "Filter",
  "globe-alt": "Globe",
  "heart": "Heart",
  "home": "Home",
  "home-modern": "Home",
  "information-circle": "Info",
  "key": "Key",
  "magnifying-glass": "Search",
  "map": "Map",
  "map-pin": "MapPin",
  "menu": "Menu",
  "minus": "Minus",
  "moon": "Moon",
  "paper-airplane": "Send",
  "pencil-square": "Edit",
  "phone": "Phone",
  "photo": "Image",
  "plus": "Plus",
  "search": "Search",
  "share": "Share",
  "shield-check": "ShieldCheck",
  "sparkles": "Sparkles",
  "squares-2x2": "LayoutGrid",
  "star": "Star",
  "star-solid": "Star",
  "sun": "Sun",
  "tag": "Tag",
  "ticket": "Ticket",
  "trash": "Trash",
  "trophy": "Trophy",
  "truck": "Truck",
  "user": "User",
  "user-circle": "UserCircle",
  "user-group": "Users",
  "users": "Users",
  "wallet": "Wallet",
  "wrench-screwdriver": "Wrench",
  "x": "X",
  "x-circle": "XCircle",
  "x-mark": "X"
};

// other standard fallbacks
for (const iconString of iconStrings) {
  const parts = iconString.replace('icon="', '').replace('"', '').split(':');
  if (parts.length === 2) {
    const name = parts[1];
    if (mappingNames[name]) {
        mapper[iconString.replace('icon="', '').replace('"', '')] = mappingNames[name];
    } else {
        // camelCase it for generic fallback
        let camelName = name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
        mapper[iconString.replace('icon="', '').replace('"', '')] = camelName;
    }
  }
}

mapper["mdi:facebook"] = "Facebook";
mapper["ri:facebook-fill"] = "Facebook";
mapper["mdi:apple"] = "Apple"; // Not in lucide by default, use a generic or omit
mapper["mdi:android"] = "Smartphone";

console.log(JSON.stringify(mapper, null, 2));
