import React from "react";
import Header from "./header";

export default function Page({ children, minimal = false, css = "" }) {
  return (
    <div className={`page bg-offWhite ${css}`}>
      <Header minimal={minimal} />
      <main className="page-content animate-fade-in">{children}</main>
    </div>
  );
}
