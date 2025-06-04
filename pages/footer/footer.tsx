"use client";

import type { IconProps } from "@iconify/react";
import { useTranslations } from "@/hooks/use-translation";
import { Spacer } from "@heroui/spacer";

type SocialIconProps = Omit<IconProps, "icon">;

export default function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="flex w-full flex-col pt-36">
      <div
        id="footer_id"
        className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8"
      >
        <Spacer y={8} />
        <p className="mt-1 text-center text-small text-default-400">
          &copy; PERLA Code Innovators. {t("rights")}
        </p>
        <Spacer y={2} />
        <p className="text-center text-small text-default-400">
          {t("address")}
        </p>
        <Spacer y={2} />
        <p className="text-center text-small text-default-400 flex items-center gap-2">
          <svg
            height={24}
            viewBox="0 0 24 24"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none">
              <path
                d="M3 5v-.75a.75.75 0 0 0-.75.75zm18 0h.75a.75.75 0 0 0-.75-.75zM3 5.75h18v-1.5H3zM20.25 5v12h1.5V5zM19 18.25H5v1.5h14zM3.75 17V5h-1.5v12zM5 18.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 5 19.75zM20.25 17c0 .69-.56 1.25-1.25 1.25v1.5A2.75 2.75 0 0 0 21.75 17z"
                fill="currentColor"
              />
              <path
                d="m3 5l9 9l9-9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </g>
          </svg>
          {t("email")}
        </p>
        <Spacer y={2} />
        <p className="text-center text-small text-default-400 flex items-center gap-2">
          <svg
            height={24}
            viewBox="0 0 24 24"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
              fill="currentColor"
            />
          </svg>
          {t("whatsapp")}
        </p>
      </div>
    </footer>
  );
}
