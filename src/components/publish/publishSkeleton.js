import { Skeleton, Grid, Card } from "~/components/_styled";

export default function PublishSkeleton() {
  return (
    <Grid
      colSpan={[
        "col-span-12 md:col-span-8 md:col-start-3 lg:col-span-7 lg:col-start-0 ",
        "col-span-12 lg:col-span-5",
      ]}
    >
      <Card>
        <Skeleton height="h-24" spacing="mb-4" repeat={10} />
      </Card>
      <Card>
        <Skeleton height="h-8" spacing="my-2" repeat={4} />
      </Card>
    </Grid>
  );
}
