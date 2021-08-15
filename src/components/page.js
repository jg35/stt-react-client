import React from "react";
import colors from "~/lib/colors";
import Header from "~/components/header";
import { Surface, Container, PageContent } from "~/components/_styled";

export default function Page({
  children,
  minimal = false,
  maxWidth = "1400px",
}) {
  return (
    <Container
      background={{ backgroundColor: colors.offWhite }}
      maxWidth={maxWidth}
    >
      <Surface id="page">
        <Header minimal={minimal} />
        <PageContent>{children}</PageContent>
      </Surface>
    </Container>
  );
}
