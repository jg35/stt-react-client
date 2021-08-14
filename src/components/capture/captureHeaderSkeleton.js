import { Skeleton } from "~/components/_styled";

export default function CaptureHeaderSkeleton() {
  return (
    <div className="w-full">
      <Skeleton repeat={2} height="h-11" wrapSpacing="my-0" spacing="mb-2" />
    </div>
  );
}
