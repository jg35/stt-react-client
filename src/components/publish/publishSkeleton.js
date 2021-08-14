import { Skeleton } from "~/components/_styled";

export default function PublishSkeleton() {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{ maxWidth: "1056px" }}
    >
      <Skeleton height="h-4" spacing="my-2" repeat={4} />
      <Skeleton height="h-4" spacing="my-2" repeat={4} />
      <Skeleton height="h-4" spacing="my-2" repeat={4} />
      <Skeleton height="h-4" spacing="my-2" repeat={4} />
    </div>
  );
}
