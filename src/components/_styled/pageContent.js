import { joinTailwindClasses } from "~/lib/util";

export default function PageContent({ children: content, css = "" }) {
  return (
    <main
      className={joinTailwindClasses(["animate-fade-in overflow-hiden", css])}
      style={{
        height: "calc(100% - var(--headerHeight, 64px)",
        maxHeight: "calc(100% - var(--headerHeight, 64px)",
      }}
    >
      {content}
    </main>
  );
}
