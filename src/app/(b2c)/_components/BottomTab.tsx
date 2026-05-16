"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/my", label: "마이", icon: UserIcon },
] as const;

export function BottomTab() {
  const pathname = usePathname();

  const tabItems = tabs.map((tab) => {
    const isActive =
      tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
    const Icon = tab.icon;

    return (
      <Link
        key={tab.href}
        href={tab.href}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
        <span>{tab.label}</span>
      </Link>
    );
  });

  return (
    <nav
      aria-label="메인 네비게이션"
      className="fixed inset-x-0 bottom-0 z-10 flex border-t bg-background pb-[env(safe-area-inset-bottom)]"
    >
      {tabItems}
    </nav>
  );
}
