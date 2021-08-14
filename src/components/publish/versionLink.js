import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { ACTION_S3_GET_SIGNED_URL } from "~/lib/gql";
import Button from "~/components/button";

export default function VersionLink({ format, publishedPath, small = false }) {
  const link = useRef(null);
  const [getSignedUrls] = useMutation(ACTION_S3_GET_SIGNED_URL);

  function getTitle() {
    switch (format) {
      case "epub":
        return "iBooks";
      case "azw3":
      case "mobi":
        return "Kindle";
      case "pdf":
        return "Pdf";
      default:
        return "";
    }
  }

  function setLink(e) {
    if (link.current.href) {
      return true;
    } else {
      e.preventDefault();

      getSignedUrls({
        variables: {
          paths: `${publishedPath}.${format}`,
        },
      }).then(({ data }) => {
        link.current.href = data.action_s3_get_signed_url[0].signedUrl;
        link.current.click();
      });
    }
  }

  return (
    <Button onClick={setLink}>
      <a ref={link} target="_blank" className="cursor-pointer" href={null}>
        {getTitle()}
      </a>
    </Button>
  );
}
