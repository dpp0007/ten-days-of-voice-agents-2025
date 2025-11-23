import { CoffeeLoader } from '@/components/app/coffee-loader';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#12B1C5] via-[#8FE4F9] to-[#FFF9EF]">
      <CoffeeLoader />
    </div>
  );
}
