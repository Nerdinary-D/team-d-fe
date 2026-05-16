"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode, SVGProps } from "react";

type TabIconProps = SVGProps<SVGSVGElement>;
export type BottomTabItem = {
  href: string;
  label: string;
  icon: (props: TabIconProps) => ReactNode;
  iconClassName: string;
};

function MateIcon(props: TabIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      {...props}
    >
      <path
        d="M3 6C3 4.06562 4.56562 2.5 6.5 2.5C8.43438 2.5 10 4.06562 10 6C10 7.93438 8.43438 9.5 6.5 9.5C4.56562 9.5 3 7.93438 3 6ZM1 16.5C1 13.4625 3.4625 11 6.5 11C9.5375 11 12 13.4625 12 16.5V16.6875C12 17.4125 11.4125 18 10.6875 18H2.3125C1.5875 18 1 17.4125 1 16.6875V16.5ZM14.5 4C16.1562 4 17.5 5.34375 17.5 7C17.5 8.65625 16.1562 10 14.5 10C12.8438 10 11.5 8.65625 11.5 7C11.5 5.34375 12.8438 4 14.5 4ZM14.5 11.5C16.9844 11.5 19 13.5156 19 16V16.7C19 17.4188 18.4188 18 17.7 18H13.175C13.3813 17.6094 13.5 17.1625 13.5 16.6875V16.5C13.5 14.8906 12.9563 13.4094 12.0469 12.2281C12.7531 11.7687 13.5969 11.5 14.5 11.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HomeIcon(props: TabIconProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      {...props}
    >
      <path
        d="M3.5 22.4857V11.1714C3.5 10.7733 3.58875 10.3962 3.76625 10.04C3.94375 9.68381 4.18833 9.39047 4.5 9.16L12 3.50286C12.4375 3.16762 12.9375 3 13.5 3C14.0625 3 14.5625 3.16762 15 3.50286L22.5 9.16C22.8125 9.39047 23.0575 9.68381 23.235 10.04C23.4125 10.3962 23.5008 10.7733 23.5 11.1714V22.4857C23.5 23.1771 23.255 23.7693 22.765 24.2621C22.275 24.7549 21.6867 25.0008 21 25H17.25C16.8958 25 16.5992 24.8793 16.36 24.6379C16.1208 24.3966 16.0008 24.0982 16 23.7429V17.4571C16 17.1009 15.88 16.8026 15.64 16.5621C15.4 16.3215 15.1033 16.2008 14.75 16.2H12.25C11.8958 16.2 11.5992 16.3207 11.36 16.5621C11.1208 16.8034 11.0008 17.1018 11 17.4571V23.7429C11 24.099 10.88 24.3978 10.64 24.6392C10.4 24.8806 10.1033 25.0008 9.75 25H6C5.3125 25 4.72417 24.754 4.235 24.2621C3.74583 23.7701 3.50083 23.178 3.5 22.4857Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ProfileIcon(props: TabIconProps) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="none"
      aria-hidden
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.66667 8.45833C9.66667 7.17645 10.1759 5.94708 11.0823 5.04065C11.9887 4.13422 13.2181 3.625 14.5 3.625C15.7819 3.625 17.0113 4.13422 17.9177 5.04065C18.8241 5.94708 19.3333 7.17645 19.3333 8.45833C19.3333 9.74021 18.8241 10.9696 17.9177 11.876C17.0113 12.7824 15.7819 13.2917 14.5 13.2917C13.2181 13.2917 11.9887 12.7824 11.0823 11.876C10.1759 10.9696 9.66667 9.74021 9.66667 8.45833ZM9.66667 15.7083C8.06432 15.7083 6.5276 16.3449 5.39456 17.4779C4.26153 18.6109 3.625 20.1477 3.625 21.75C3.625 22.7114 4.00692 23.6334 4.68674 24.3133C5.36656 24.9931 6.28859 25.375 7.25 25.375H21.75C22.7114 25.375 23.6334 24.9931 24.3133 24.3133C24.9931 23.6334 25.375 22.7114 25.375 21.75C25.375 20.1477 24.7385 18.6109 23.6054 17.4779C22.4724 16.3449 20.9357 15.7083 19.3333 15.7083H9.66667Z"
        fill="currentColor"
      />
    </svg>
  );
}

const defaultItems = [
  { href: "/matches", label: "메이트", icon: MateIcon, iconClassName: "size-5" },
  { href: "/", label: "홈", icon: HomeIcon, iconClassName: "size-7" },
  {
    href: "/my",
    label: "마이페이지",
    icon: ProfileIcon,
    iconClassName: "size-[29px]",
  },
] satisfies BottomTabItem[];

export type BottomTabProps = {
  activePathname?: string;
  items?: BottomTabItem[];
};

export function BottomTab({
  activePathname,
  items = defaultItems,
}: BottomTabProps) {
  const pathname = usePathname();
  const currentPathname = activePathname ?? pathname;

  const tabItems = items.map((tab) => {
    const isActive =
      tab.href === "/"
        ? currentPathname === "/"
        : currentPathname.startsWith(tab.href);
    const Icon = tab.icon;

    return (
      <Link
        key={tab.href}
        href={tab.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-[52px] w-[50px] flex-col items-center gap-2.5 text-center [font-size:11px] leading-[1.4] font-semibold tracking-[-0.025em]",
          isActive ? "text-main" : "text-gray-300",
        )}
      >
        <Icon className={cn("shrink-0", tab.iconClassName)} />
        <span>{tab.label}</span>
      </Link>
    );
  });

  return (
    <nav
      aria-label="메인 네비게이션"
      className="fixed bottom-0 left-1/2 z-10 flex h-[90px] w-full max-w-[360px] -translate-x-1/2 items-start justify-center gap-[68px] rounded-t-[32px] bg-white pt-3 shadow-[0_-1px_5px_rgba(0,0,0,0.15)]"
    >
      {tabItems}
    </nav>
  );
}
