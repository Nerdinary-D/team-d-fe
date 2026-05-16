import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const sizeMap = {
  mobile: "min-h-dvh max-w-[360px] px-4 py-4 sm:px-4 lg:px-4",
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

export type PageContainerProps = ComponentProps<"div"> & {
  size?: keyof typeof sizeMap;
  as?: "div" | "main" | "section" | "article";
};

export function PageContainer({
  className,
  size = "mobile",
  as: Tag = "div",
  ...props
}: PageContainerProps) {
  return (
    <Tag
      data-slot="page-container"
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
        sizeMap[size],
        className,
      )}
      {...props}
    />
  );
}
