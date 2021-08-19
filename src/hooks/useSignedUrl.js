import { useContext, useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";
import { FETCH_IMAGES, ACTION_S3_GET_SIGNED_URL } from "~/lib/gql";
import { flatten, get, uniq } from "lodash";
import { photoSizes, coverImageSizes } from "~/lib/imageSizes";

export function useGetSignedImageUrl(path) {
  const { uiState, updateUiState } = useContext(UIContext);
  const [url, setUrl] = useState(uiState.signedUrls[path]);
  const [getSignedUrls] = useMutation(ACTION_S3_GET_SIGNED_URL);

  useEffect(() => {
    if (path) {
      if (uiState.signedUrls[path]) {
        setUrl(uiState.signedUrls[path]);
      } else if (!uiState.signedUrls[path] && uiState.signedUrlsInit) {
        getSignedUrls({
          variables: {
            paths: path,
          },
        }).then(({ data }) => {
          const signedUrls = { ...uiState.signedUrls };
          data.action_s3_get_signed_url.forEach(
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
  }, [path, uiState.signedUrls]);

  return (url && url.signedUrl) || null;
}

export function useSignedImageUrls() {
  const {
    authState: { user, status },
  } = useContext(AuthContext);

  const { uiState, updateUiState } = useContext(UIContext);
  const [getImages, { data }] = useLazyQuery(FETCH_IMAGES);
  const [getSignedUrls] = useMutation(ACTION_S3_GET_SIGNED_URL);

  useEffect(() => {
    if (user && user.id) {
      console.log("getting images...");
      // TODO - this works initially, but then need to make additional requests for signed urls for every image added further
      getImages({
        variables: {
          userId: user.id,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (data && status === "in") {
      // Standard photos
      let photoPaths = data.stt_fragment
        .filter((f) => f.type === "PHOTO")
        .map((f) => f.mediaUrl);

      photoPaths = photoPaths.concat(
        data.stt_version
          .filter((v) => get(v, "theme.cover.image"))
          .map((v) => v.theme.cover.image)
      );

      // Now register photo paths (with responsive sizes)
      let paths = uniq(photoPaths);
      paths = flatten(
        paths.map((path) => {
          return photoSizes.map((size) => `${path}-${size}`);
        })
      );

      // Generated covers (different sizes)
      const generatedCoverImages = data.stt_version
        .filter((v) => v.coverUrl)
        .map((v) => v.coverUrl);

      paths = paths
        .concat(
          flatten(
            generatedCoverImages.map((path) => {
              return coverImageSizes.map((size) => `${path}-${size}`);
            })
          )
        )
        .concat([
          "resources/fonts/available.json",
          "resources/fonts/sprite20Px.png",
        ]);

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
        getSignedUrls({
          variables: {
            paths: requestPaths.join(","),
          },
        }).then(({ data }) => {
          const signedUrls = { ...uiState.signedUrls };
          data.action_s3_get_signed_url.forEach(
            (url) =>
              (signedUrls[url.objectPath] = {
                signedUrl: url.signedUrl,
                expires: url.expires,
              })
          );
          updateUiState({ signedUrls });
        });
      }
      updateUiState({ signedUrlsInit: true }, false);
    }
  }, [data, user]);

  return uiState.signedUrls;
}
