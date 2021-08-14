import { Skeleton } from "~/components/_styled";

export default function TimelineSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      <Skeleton height="h-20" spacing="my-4" repeat={14} />
    </div>
  );
}
