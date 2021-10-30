export default function PageContent({
  children: content,
  scrollable = false,
  maxWidth,
  css = "px-2 md:px-4 pb-2",
}) {
  return (
    <main
      style={{
        maxWidth,
      }}
      className={`mx-auto w-full animate-fade-in flex-1 flex flex-col h-full max-h-full ${
        scrollable ? "overflow-scroll" : "overflow-hidden"
      } ${css}`}
    >
      {content}
    </main>
  );
}
