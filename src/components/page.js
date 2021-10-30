import React from "react";
import colors from "~/lib/colors";
import Header from "~/components/header";
import { Surface, Container, PageContent } from "~/components/_styled";

export default function Page({
  children,
  minimal = false,
  maxWidth = "1600px",
  scrollable = false,
  headerCss = "mb-4 border-b border-b-2 border-lightGray",
  pageContentCss,
}) {
  return (
    <Container background={{ color: colors.offWhite }}>
      <Surface id="page">
        <Header
          minimal={minimal}
          scrollable={scrollable}
          css={headerCss}
          maxWidth={maxWidth}
        />
        <PageContent
          scrollable={scrollable}
          maxWidth={maxWidth}
          css={pageContentCss}
        >
          {children}
        </PageContent>
      </Surface>
    </Container>
  );
}
