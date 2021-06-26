import React from "react";
import Header from "~/components/header";

export default function Page({ children, minimal = false, css = "" }) {
  return (
    <div id="page" className={`page bg-offWhite ${css}`}>
      <Header minimal={minimal} />
      <main className="page-content animate-fade-in">{children}</main>
    </div>
  );
}
