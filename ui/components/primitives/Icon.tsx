import {
  Bell, Briefcase, Calendar, CalendarDays, Camera, ChevronLeft, ChevronRight, Clock, Columns3, Download,
  Ellipsis, EllipsisVertical, Fan, FileText, Flashlight, Globe, Image, LayoutGrid, LayoutList, Layers, Link2,
  Mail, MessageCircle, Minus, Moon, Music, Pause, PenLine, PieChart, Play, Plus, Search, Settings, Share2,
  SquarePen, Sun, Target, Trash2, Truck, User, Users, Video, Blend, type LucideIcon,
} from "lucide-react";

/**
 * Single icon registry for the library. Components reference icons by name so the
 * underlying set can be swapped in one place.
 */
export const icons = {
  dashboard: LayoutGrid,
  workflows: Truck,
  integrations: Layers,
  search: Search,
  sun: Sun,
  moon: Moon,
  blend: Blend,
  bell: Bell,
  settings: Settings,
  download: Download,
  plus: Plus,
  minus: Minus,
  user: User,
  users: Users,
  chart: PieChart,
  calendar: Calendar,
  calendarDays: CalendarDays,
  mail: Mail,
  notes: SquarePen,
  chat: MessageCircle,
  trash: Trash2,
  edit: PenLine,
  more: Ellipsis,
  moreVertical: EllipsisVertical,
  target: Target,
  clock: Clock,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  attachment: Link2,
  file: FileText,
  viewList: LayoutList,
  viewGrid: LayoutGrid,
  viewBoard: Columns3,
  share: Share2,
  video: Video,
  briefcase: Briefcase,
  flashlight: Flashlight,
  globe: Globe,
  camera: Camera,
  fan: Fan,
  image: Image,
  music: Music,
  play: Play,
  pause: Pause,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** Solid glyph: fills closed shapes with the current colour (soft-UI app tiles, transport controls). */
  filled?: boolean;
  className?: string;
  /** Provide when the icon carries meaning on its own; otherwise it is hidden from AT. */
  label?: string;
}

export function Icon({ name, size = 18, strokeWidth = 1.75, filled, className, label }: IconProps) {
  const Cmp = icons[name];
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      fill={filled ? "currentColor" : "none"}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
