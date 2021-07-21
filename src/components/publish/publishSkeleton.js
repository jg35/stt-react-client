export default function PublishSkeleton() {
  function Paragraph() {
    return (
      <>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
      </>
    );
  }
  return (
    <div
      className="h-full w-full overflow-scroll my-2 mx-auto"
      style={{ maxWidth: "1056px" }}
    >
      <Paragraph />
      <Paragraph />
      <Paragraph />
      <Paragraph />
    </div>
  );
}
