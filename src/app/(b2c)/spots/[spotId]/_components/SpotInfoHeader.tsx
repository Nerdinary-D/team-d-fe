import Image from 'next/image';
import { cn } from '@/lib/utils';

export type SpotInfoHeaderProps = {
  name: string;
  sport: string;
  address: string;
  className?: string;
};

export function SpotInfoHeader({
  name,
  sport,
  address,
  className,
}: SpotInfoHeaderProps) {
  const title = (
    <div className="flex items-center gap-[10px] px-4">
      <h1 className="text-header1">{name}</h1>
    </div>
  );

  const sportLine = (
    <div className="px-4">
      <p className="text-header2 text-gray-600">{sport}</p>
    </div>
  );

  const addressLine = (
    <div className="flex items-center gap-[5px] px-4">
      <Image
        src="/icons/location.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
      <p className="text-subtitle2 text-gray-500">{address}</p>
    </div>
  );

  return (
    <section className={cn('flex flex-col gap-[7px]', className)}>
      {title}
      {sportLine}
      {addressLine}
    </section>
  );
}
