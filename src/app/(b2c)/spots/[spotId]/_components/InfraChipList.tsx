import Image from "next/image";
import { cn } from "@/lib/utils";

export type InfraChipListProps = {
  infraList: string[];
  className?: string;
};

export function InfraChipList({ infraList, className }: InfraChipListProps) {
  const heading = (
    <h2 className="text-subtitle1 text-foreground">✅ 제공 중인 편의 시설</h2>
  );

  const chips = infraList.map((label) => (
    <li
      key={label}
      className="flex items-center gap-[13px] rounded-full border border-main px-[21px] py-[14px]"
    >
      <Image
        src="/icons/wheel.svg"
        alt=""
        width={16}
        height={16}
        aria-hidden
      />
      <span className="text-caption text-sub">{label}</span>
    </li>
  ));

  return (
    <section className={cn("flex flex-col gap-[10px] px-4 py-[10px]", className)}>
      {heading}
      <ul className="flex flex-col gap-[9px]">{chips}</ul>
    </section>
  );
}
