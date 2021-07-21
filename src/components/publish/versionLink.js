import axios from "axios";
import { useState, useEffect } from "react";

export default function VersionLink({ format, publishedPath }) {
  const [signedLink, setSignedLink] = useState("");

  function getSignObjectUrl(path, ext) {
    let reqPath = path.trim().replace(/\w{1,}\//, "");
    return `${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/s3/signGetObject?objectPath=${reqPath}.${ext}`;
  }
  useEffect(() => {
    if (!signedLink) {
      axios.get(getSignObjectUrl(publishedPath, format)).then((response) => {
        setSignedLink(response.data.signedRequest);
      });
    }
  }, []);
  return signedLink ? (
    <a target="_blank" href={`ibooks://${signedLink}`}>
      {format.toUpperCase()}
    </a>
  ) : null;
}
