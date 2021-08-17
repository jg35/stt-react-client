import { Card, Skeleton } from "~/components/_styled";

export default function TimelineSkeleton() {
  return (
    <Card css="w-full h-full overflow-hidden">
      <Skeleton height="h-20" spacing="my-4" repeat={14} />
    </Card>
  );
}
