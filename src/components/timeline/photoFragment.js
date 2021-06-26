import React from "react";

import { getImgIxSrc } from "~/lib/util";

export default function PhotoFragment({ fragment }) {
  return (
    <div className="mx-auto">
      <img
        src={`${getImgIxSrc(fragment.mediaUrl)}?height=120`}
        className="h-auto rounded"
        alt={fragment.mediaCaption}
        title={fragment.mediaCaption}
      />
    </div>
  );
}
