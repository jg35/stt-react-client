import { functionServer } from "~/lib/axios";
import { useState, useEffect } from "react";

export default function VersionLink({ format, publishedPath }) {
  const [signedLink, setSignedLink] = useState("");

  function getSignObjectUrl(path, ext) {
    let reqPath = path.trim().replace(/\w{1,}\//, "");
    return `actions/s3/signFileRequest?paths=${reqPath}.${ext}`;
  }
  useEffect(() => {
    if (!signedLink) {
      functionServer
        .get(getSignObjectUrl(publishedPath, format))
        .then((response) => {
          setSignedLink(response.data[0].signedUrl);
        });
    }
  }, []);
  return signedLink ? (
    <a target="_blank" href={signedLink}>
      {format.toUpperCase()}
    </a>
  ) : null;
}
