export default function TimelineSkeleton() {
  function Block() {
    return (
      <div className="w-full h-20 bg-lightestGray my-4 rounded animate-pulse"></div>
    );
  }
  return (
    <div className="w-full overflow-scroll mx-1">
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
