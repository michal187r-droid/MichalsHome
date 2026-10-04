import type { IconName } from "@/content/site";

const stroke = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function CategoryIcon({ name }: { name: IconName }) {
  switch (name) {
    case "book":
      return (
        <svg {...stroke}>
          <path d="M12 6.5c-1.8-1.2-4.1-1.8-6.5-1.8v12.6c2.4 0 4.7.6 6.5 1.8 1.8-1.2 4.1-1.8 6.5-1.8V4.7c-2.4 0-4.7.6-6.5 1.8Z" />
          <path d="M12 6.5v12.6" />
        </svg>
      );
    case "notebook":
      return (
        <svg {...stroke}>
          <rect x="4.5" y="4" width="11" height="16" rx="1.2" />
          <path d="M8 8.5h4M8 12h4" />
          <path d="M15.5 15 20 10.5l1.5 1.5L17 16.5l-2 .5.5-2Z" />
        </svg>
      );
    case "cap":
      return (
        <svg {...stroke}>
          <path d="M12 5 2.5 9.5 12 14l9.5-4.5L12 5Z" />
          <path d="M6.5 11.7V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.3" />
          <path d="M21.5 9.5V15" />
        </svg>
      );
    case "chat":
      return (
        <svg {...stroke}>
          <path d="M9.5 4.5h8A2.5 2.5 0 0 1 20 7v4a2.5 2.5 0 0 1-2.5 2.5H15l-2 2.3v-2.3h-.5A2.5 2.5 0 0 1 10 11v-.3" />
          <path d="M14.3 15.3v2A2.5 2.5 0 0 1 11.8 20h-3l-2 2.2V20H6.5A2.5 2.5 0 0 1 4 17.5v-4A2.5 2.5 0 0 1 6.5 11h1.8" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...stroke}>
          <path d="M19 5c-3.5 0-7.5 1.8-10 4.3C6.7 11.6 5.4 15 5 19c4-.4 7.4-1.7 9.7-4C17.2 12.5 19 8.5 19 5Z" />
          <path d="M9.5 14.5 4.5 19.5" />
          <path d="M12 9c1 1.5 1 3.5 0 5" />
        </svg>
      );
  }
}

export function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.35a9.87 9.87 0 0 0 4.62 1.13h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.28-3.42-.72-2.9-1.2-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.98s.75-2.12 1.02-2.41c.26-.28.57-.35.76-.35h.55c.18 0 .41-.03.63.48.24.57.8 1.98.87 2.13.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.25 2.24 1.39.28.14.44.12.6-.07.16-.19.68-.79.86-1.07.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.45.2.51.32.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
