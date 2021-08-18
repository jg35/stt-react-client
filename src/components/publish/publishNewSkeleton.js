import { Skeleton, Grid, Card } from "~/components/_styled";

export default function PublishNewSkeleton() {
  return (
    <Grid colSpan={["col-span-12"]}>
      <Card css="overflow-hidden">
        <Skeleton height="h-24" spacing="mb-4" repeat={12} />
      </Card>
    </Grid>
  );
}
