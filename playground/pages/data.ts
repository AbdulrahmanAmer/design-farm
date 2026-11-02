import type { AgendaSlot, NavTab, RailItem, SegmentOption, Task, WeekDay } from "../../ui/index";

export const topTabs = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "workflows", label: "Workflows", icon: "workflows" },
  { id: "integrations", label: "Integrations", icon: "integrations" },
] as const satisfies readonly NavTab<string>[];

export const railItems = [
  { id: "home", icon: "dashboard", label: "Overview" },
  { id: "profile", icon: "user", label: "Profile" },
  { id: "reports", icon: "chart", label: "Reports", badge: "NEW" },
  { id: "alerts", icon: "bell", label: "Alerts" },
  { id: "calendar", icon: "calendar", label: "Calendar" },
  { id: "inbox", icon: "mail", label: "Inbox", dot: "attention" },
  { id: "notes", icon: "notes", label: "Notes" },
  { id: "chat", icon: "chat", label: "Chat", dot: "online" },
] as const satisfies readonly RailItem<string>[];

export const week: WeekDay[] = [
  { weekday: "Mon", date: 14, iso: "2021-05-14" },
  { weekday: "Tue", date: 15, iso: "2021-05-15" },
  { weekday: "Wed", date: 16, iso: "2021-05-16" },
  { weekday: "Thr", date: 17, iso: "2021-05-17" },
  { weekday: "Fr", date: 18, iso: "2021-05-18" },
  { weekday: "Sat", date: 19, iso: "2021-05-19" },
  { weekday: "Sun", date: 20, iso: "2021-05-20" },
];

export const agendaSlots: AgendaSlot[] = [
  {
    time: "04:30-05:00 PM",
    events: [{ id: "team", icon: "users", title: "Team meeting", time: "12:00 - 12:30", tag: "UX/UI design", tagTone: "accent" }],
  },
  {
    time: "11:30-12:30 PM",
    events: [
      { id: "client", icon: "briefcase", title: "Meeting with new client", time: "12:30 - 01:30 PM", tag: "Job interview", tagTone: "danger" },
    ],
  },
];

export const tasks: Task[] = [
  { id: "research", title: "Conduct research", date: "4 May, 09:20 AM", duration: "02 h 45 m", progress: 90, attachments: 4, due: "16" },
  { id: "meeting", title: "Schedule a meeting", date: "14 May, 12:45 AM", duration: "06 h 55 m", progress: 50, attachments: 4, due: "3 June" },
  { id: "reminders", title: "Send out reminders", date: "21 May, 10:30 AM", duration: "01 h 30 m", progress: 10, attachments: 16, due: "3 June" },
];

export const team = [{ name: "Ava Moss" }, { name: "Liam Cole" }, { name: "Nora Diaz" }];

/** Quick-switch presets shown in page headers; "custom" = a mixer remix. */
export type Theme = "light" | "dark" | "soft" | "custom";

export const themeRecipe: Record<Exclude<Theme, "custom">, string> = {
  light: "planify-light",
  dark: "planify-dark",
  soft: "soft-cobalt",
};

export const themeOptions = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "soft", label: "Soft", icon: "blend" },
] as const satisfies readonly SegmentOption<Theme>[];
