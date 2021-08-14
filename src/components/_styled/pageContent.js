export default function PageContent({ children }) {
  return (
    <main
      className="animate-fade-in"
      style={{
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
      }}
    >
      {children}
    </main>
  );
}
