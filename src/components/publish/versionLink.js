import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { S3_GET_SIGNED_URL } from "~/lib/gql";

export default function VersionLink({ format, publishedPath }) {
  const link = useRef(null);
  const [getSignedUrls] = useMutation(S3_GET_SIGNED_URL);

  function setLink(e) {
    console.log(link.current.href);
    if (link.current.href) {
      return true;
    } else {
      e.preventDefault();

      getSignedUrls({
        variables: {
          paths: `${publishedPath}.${format}`,
        },
      }).then(({ data }) => {
        link.current.href = data.s3_signed_get_url[0].signedUrl;
        link.current.click();
      });
    }
  }

  return (
    <a
      ref={link}
      target="_blank"
      className="cursor-pointer"
      href={null}
      onClick={setLink}
    >
      {format.toUpperCase()}
    </a>
  );
}
