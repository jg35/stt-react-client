export default function Paper({
  children: frontContent,
  pages = 2,
  pageWidth = 1,
}) {
  const gap = pages * pageWidth;
  return (
    <div className="h-full">
      <div
        className="absolute relative min-w-full md:min-w-0"
        style={{ width: `calc(100% - ${gap}rem)` }}
      >
        <div
          className="w-full h-full relative top-0 left-0 shadow-xl rounded-lg bg-white"
          style={{ zIndex: "30" }}
        >
          {frontContent}
        </div>
        <div className="hidden md:block">
          {[...new Array(pages)].map((page, i) => {
            return (
              <div
                key={page}
                className="top-0 shadow-lg rounded-lg bg-white h-full w-full absolute "
                style={{
                  left: `${(i + 1) * pageWidth}rem`,
                  zIndex: `${30 - (i + 1)}`,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
