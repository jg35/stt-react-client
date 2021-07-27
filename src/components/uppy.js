import React, { useContext } from "react";
import { useMutation } from "@apollo/client";
import { S3_GET_SIGNED_URL } from "~/lib/gql";
import { photoSizes } from "~/lib/imageSizes";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import XHRUpload from "@uppy/xhr-upload";

import { Dashboard, useUppy } from "@uppy/react";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";

import "@uppy/image-editor/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

export default function UppyDashboard({
  imageFolder = "fragments",
  mediaUrl,
  onChange,
  error,
  height = 250,
  resetAfterUpload = false,
}) {
  const { token } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const [getSignedUrls] = useMutation(S3_GET_SIGNED_URL);
  const uppy = useUppy(() => {
    return new Uppy({
      id: "dashboardUppy",
      autoProceed: true,
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
          onChange(path);
        });
        // if (resetAfterUpload) {
        //   uppy.reset();
        // }
      });
  });

  function setSignedUrl(path) {
    return getSignedUrls({
      variables: {
        paths: photoSizes.map((size) => `${path}-${size}`).join(","),
      },
    }).then(({ data }) => {
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

  return (
    <div id="uppy-dashboard" className={error && "uppy-validate-error"}>
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        height={height}
        locale={{ strings: { done: "Replace image" } }}
        hideProgressAfterFinish={true}
        showLinkToFileUploadResult={false}
        plugins={["ImageEditor"]}
        metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
      />
    </div>
  );
}
