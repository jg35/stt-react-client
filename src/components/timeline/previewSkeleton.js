export default function PreviewSkeleton() {
  function Paragraph() {
    return (
      <>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full mb-3 h-4 bg-lightestGray rounded animate-pulse"></div>
        <div className="w-full h-4 mb-10 bg-lightestGray rounded animate-pulse"></div>
      </>
    );
  }
  return (
    <div className="h-full w-11/12 overflow-scroll my-2 mx-auto">
      <Paragraph />
      <Paragraph />
      <Paragraph />
      <Paragraph />
    </div>
  );
}
