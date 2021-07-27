import React, { useState, useEffect, useContext } from "react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import XHRUpload from "@uppy/xhr-upload";
import { UIContext } from "~/app";
import { useMutation } from "@apollo/client";
import { S3_GET_SIGNED_URL } from "~/lib/gql";
import { photoSizes } from "~/lib/imageSizes";
import { AuthContext } from "~/components/authWrap";

import { DashboardModal, useUppy } from "@uppy/react";

import "@uppy/image-editor/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function UppyModal({
  imageFolder = "fragments",
  mediaUrl,
  onUploadSuccess,
  onClose,
  error,
}) {
  const { token } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const signedUrl = useGetSignedImageUrl(mediaUrl + "-master");
  const [getSignedUrls] = useMutation(S3_GET_SIGNED_URL);
  const [init, setInit] = useState(false);
  const uppy = useUppy(() => {
    return new Uppy({
      id: "dashboardUppy",
      restrictions: {
        maxNumberOfFiles: 1,
      },
      meta: {
        appRef: "stt",
        folder: imageFolder,
      },
    })
      .use(XHRUpload, {
        endpoint: `${process.env.REACT_APP_PROCESSING_SERVER_URL}/images/upload`,
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
      })
      .on("upload-success", (file, response) => {
        const { path } = response.body;
        setSignedUrl(path).then(() => {
          onUploadSuccess(path);
          uppy.reset();
        });
      });
  });

  function setSignedUrl(path) {
    return getSignedUrls({
      variables: {
        paths: photoSizes.map((size) => `${path}-${size}`).join(","),
      },
    }).then(({ data }) => {
      console.log(data.s3_signed_get_url);
      updateUiState({
        signedUrls: {
          ...uiState.signedUrls,
          ...photoSizes.reduce((obj, size, i) => {
            obj[`${path}-${size}`] = data.s3_signed_get_url[i];
            return obj;
          }, {}),
        },
      });
    });
  }

  async function addRemoteImage(path) {
    // assuming the image lives on a server somewhere
    return fetch(path)
      .then((response) => response.blob())
      .then((blob) => {
        uppy.addFile({
          name: path,
          type: blob.type,
          data: blob,
        });
      });
  }

  useEffect(() => {
    if (signedUrl) {
      addRemoteImage(signedUrl).then(() => {
        setInit(true);
      });
    } else {
      setInit(true);
    }
  }, []);

  return (
    init && (
      <div id="uppy-dashboard" className={error && "uppy-validate-error"}>
        <DashboardModal
          open={true}
          closeModalOnClickOutside
          onRequestClose={() => {
            onClose();
            uppy.reset();
          }}
          uppy={uppy}
          proudlyDisplayPoweredByUppy={false}
          // height={height}
          locale={{ strings: { cancel: "Replace image" } }}
          // hideProgressAfterFinish={true}
          showLinkToFileUploadResult={false}
          plugins={["ImageEditor"]}
          // metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
        />
      </div>
    )
  );
}
