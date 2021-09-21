import React from "react";
import Svg from "~/components/svg";

export default function LoadingSpinner({ loading, css = "h-5 w-5", color }) {
  return (
    loading && <Svg name="spinner" color={color} css={`animate-spin ${css}`} />
  );
}
