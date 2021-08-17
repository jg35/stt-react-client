export default function PageContent({
  children: content,
  scrollable = false,
  paddingBottom = true,
}) {
  return (
    <main
      className={`animate-fade-in flex-1 flex flex-col pt-2 ${
        paddingBottom && "pb-2"
      } h-full max-h-full ${
        scrollable ? "overflow-scroll px-4" : "overflow-hidden px-2"
      }`}
    >
      {content}
    </main>
  );
}
