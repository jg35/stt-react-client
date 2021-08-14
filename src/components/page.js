import React from "react";
import Header from "~/components/header";
import { Surface, PageContent } from "~/components/_styled";

export default function Page({ children, minimal = false, css = "" }) {
  return (
    <Surface id="page" css={css}>
      <Header minimal={minimal} />
      <PageContent>{children}</PageContent>
    </Surface>
  );
}
