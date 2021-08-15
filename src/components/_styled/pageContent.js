export default function PageContent({ children }) {
  return (
    <main
      className="animate-fade-in"
      style={{
        height: "calc(100% - var(--headerHeight, 64px)",
        maxHeight: "calc(100% - var(--headerHeight, 64px)",
        overflow: "hidden",
      }}
    >
      {children}
    </main>
  );
}
