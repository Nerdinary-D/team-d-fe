"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type CreatePostFabProps = {
  onClick: () => void;
  className?: string;
  label?: string;
};

export function CreatePostFab({
  onClick,
  className,
  label = "모집글 등록하기",
}: CreatePostFabProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto flex h-[50px] w-full max-w-[328px] items-center justify-center gap-[5px] rounded-[40px] bg-main text-white shadow-lg active:scale-[0.98]"
      >
        <Image
          src="/icons/plus.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
        />
        <span className="text-subtitle2">{label}</span>
      </button>
    </div>
  );
}
