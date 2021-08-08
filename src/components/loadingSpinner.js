import React from "react";
import Svg from "@src/components/svg";

export default function LoadingSpinner({ loading, css = "h-5 w-5", color }) {
  return (
    loading && (
      <Svg
        name="spinner"
        color={color}
        css={`animate-spin text-white ${css}`}
      />
    )
  );
}
