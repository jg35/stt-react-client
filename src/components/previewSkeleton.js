import { Skeleton } from "~/components/_styled";

export default function PreviewSkeleton() {
  return (
    <div className={`h-full w-full overflow-hidden`}>
      <Skeleton height="h-4" spacing="my-2" repeat={7} />
      <Skeleton height="h-4" spacing="my-2" repeat={7} />
      <Skeleton height="h-4" spacing="my-2" repeat={7} />
      <Skeleton height="h-4" spacing="my-2" repeat={7} />
      <Skeleton height="h-4" spacing="my-2" repeat={7} />
    </div>
  );
}
