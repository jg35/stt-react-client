import React from "react";
import colors from "~/lib/colors";
import Header from "~/components/header";
import { Surface, Container, PageContent } from "~/components/_styled";

export default function Page({
  children,
  minimal = false,
  maxWidth = "1400px",
  scrollable = false,
  paddingBottom = true,
}) {
  return (
    <Container
      background={{ backgroundColor: colors.offWhite }}
      maxWidth={maxWidth}
    >
      <Surface id="page">
        <Header minimal={minimal} scrollable={scrollable} />
        <PageContent scrollable={scrollable} paddingBottom={paddingBottom}>
          {children}
        </PageContent>
      </Surface>
    </Container>
  );
}
