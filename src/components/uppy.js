import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ACTION_S3_GET_SIGNED_URL } from "~/lib/gql";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";
import { photoSizes } from "~/lib/imageSizes";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import XHRUpload from "@uppy/xhr-upload";

import { DashboardModal, useUppy } from "@uppy/react";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";

import "@uppy/image-editor/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

export default function UppyDashboard({
  imageFolder = "fragments",
  mediaUrl,
  onChange,
  onClose = null,
  onReady,
  open = false,
}) {
  const [ready, setReady] = useState(false);
  const {
    authState: { token },
  } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const signedUrl = useGetSignedImageUrl(
    mediaUrl ? mediaUrl + "-master" : null
  );
  const [getSignedUrls] = useMutation(ACTION_S3_GET_SIGNED_URL);
  const uppy = useUppy(() => {
    return new Uppy({
      id: "dashboardUppy",
      restrictions: {
        maxNumberOfFiles: 1,
      },
      meta: {
        appId: process.env.REACT_APP_HASURA_APP_ID,
        folder: imageFolder,
      },
      autoProceed: false,
      locale: { strings: { cancel: "Replace image" } },
    })
      .use(XHRUpload, {
        id: "XHR",
        endpoint: `${process.env.REACT_APP_PROCESSING_SERVER_URL}/actions/user/images/upload`,
        formData: true,
        fieldName: "uppy",
        method: "post",
        headers: {
          Authorization: token,
        },
      })
      .use(ImageEditor, {
        id: "ImageEditor",
        quality: 1,
        cropperOptions: {
          viewMode: 1,
          background: false,
          autoCropArea: 1,
          responsive: true,
        },
        actions: {
          rotate: false,
        },
      })
      .on("upload-success", (file, response) => {
        const { path } = response.body;
        getSignedUrls({
          variables: {
            paths: photoSizes.map((size) => `${path}-${size}`).join(","),
          },
        }).then(({ data }) => {
          updateUiState({
            signedUrls: {
              ...uiState.signedUrls,
              ...photoSizes.reduce((obj, size, i) => {
                obj[`${path}-${size}`] = data.action_s3_get_signed_url[i];
                return obj;
              }, {}),
            },
          });
          onChange(path);
        });
      });
  });

  async function addRemoteImage(path) {
    return fetch(path)
      .then((response) => response.blob())
      .then((blob) => {
        uppy.addFile({
          name: "image.jpg",
          type: blob.type,
          data: blob,
        });

        setReady(true);
      });
  }

  useEffect(() => {
    if (ready) {
      onReady();
    }
  }, [ready]);

  useEffect(() => {
    if (!open) {
      setReady(false);
    } else {
      const files = uppy.getFiles();
      const fState = files.length && Object.values(uppy.getState().files)[0];
      const EDITING_UPLOADED_IMAGE = fState && fState.progress.uploadComplete;
      const EDITING_EXISTING_IMAGE = files.length === 0 && signedUrl;
      if (EDITING_UPLOADED_IMAGE) {
        // Resets progress so user can edit image again
        uppy.setFileState(fState.id, {
          progress: {
            percentage: 0,
            bytesUploaded: 0,
            uploadComplete: false,
            uploadStarted: null,
          },
        });
        setReady(true);
      } else if (EDITING_EXISTING_IMAGE) {
        setReady(false);
        addRemoteImage(signedUrl);
      } else {
        setReady(true);
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      document.querySelector("body").classList.remove("uppy-Dashboard-isFixed");
    };
  }, []);

  return (
    <DashboardModal
      open={ready}
      uppy={uppy}
      hideProgressAfterFinish
      closeModalOnClickOutside
      showLinkToFileUploadResult={false}
      proudlyDisplayPoweredByUppy={false}
      plugins={["ImageEditor"]}
      onRequestClose={onClose}
    />
  );
}
