export default function PageContent({
  children: content,
  scrollable = false,
  paddingBottom = true,
}) {
  return (
    <main
      className={`animate-fade-in flex-1 flex flex-col ${
        paddingBottom && "pb-2"
      } h-full max-h-full ${
        scrollable ? "overflow-scroll" : "overflow-hidden"
      }`}
    >
      {content}
    </main>
  );
}
