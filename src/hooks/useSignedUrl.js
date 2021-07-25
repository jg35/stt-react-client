import { functionServer } from "~/lib/axios";
import { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";
import { FETCH_IMAGES } from "~/lib/gql";
import { flatten, uniq } from "lodash";

export function useGetSignedImageUrl(path) {
  const { uiState } = useContext(UIContext);
  const [url, setUrl] = useState(uiState.signedUrls[path]);

  useEffect(() => {
    if (uiState.signedUrls[path]) {
      setUrl(uiState.signedUrls[path]);
    }
  }, [path, uiState.signedUrls]);

  return (url && url.signedUrl) || null;
}

export function useSignedImageUrls() {
  const { user } = useContext(AuthContext);

  const { uiState, updateUiState } = useContext(UIContext);
  const [getImages, { data }] = useLazyQuery(FETCH_IMAGES);

  useEffect(() => {
    if (user && user.id) {
      getImages({
        variables: {
          userId: user.id,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      const fragmentImagePaths = data.stt_fragment
        .filter((f) => f.type === "PHOTO")
        .map((f) => f.mediaUrl);
      const versionCoverImages = flatten(
        data.stt_version
          .filter((v) => v.coverUrl || v.theme.cover)
          .map((v) => [
            v.coverUrl || null,
            (v.theme.cover && v.theme.cover.image) || null,
          ])
      ).filter((i) => i !== null);
      const paths = uniq(fragmentImagePaths.concat(versionCoverImages));

      let requestPaths = [];
      paths.forEach((path) => {
        if (
          !uiState.signedUrls[path] ||
          Date.now() > uiState.signedUrls[path].expires
        ) {
          requestPaths.push(path);
        }
      });
      if (requestPaths.length) {
        const signedUrls = { ...uiState.signedUrls };
        functionServer(
          `actions/s3/signFileRequest?paths=${requestPaths.join(",")}`
        ).then(({ data }) => {
          data.forEach(
            (url) =>
              (signedUrls[url.objectPath] = {
                signedUrl: url.signedUrl,
                expires: url.expires,
              })
          );
          updateUiState({ signedUrls });
        });
      }
    }
  }, [data]);

  return uiState.signedUrls;
}
