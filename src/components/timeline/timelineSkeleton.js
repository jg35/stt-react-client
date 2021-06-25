export default function TimelineSkeleton() {
  function Block() {
    return (
      <div class="w-full h-20 bg-lightestGray my-4 rounded animate-pulse"></div>
    );
  }
  return (
    <div class="w-full overflow-scroll mx-2">
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
      <Block />
    </div>
  );
}
