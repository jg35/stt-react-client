import React from "react";
// import { useQuery } from "@apollo/client"
// import { getTimeline } from "../lib/gql"
import Page from "../components/page";

export default function Settings() {
  // const { data } = useQuery(getTimeline())
  return (
    <Page minimal>
      <h1>I am the settings page</h1>
    </Page>
  );
}
