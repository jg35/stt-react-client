import React, { useContext } from "react";
import { functionServer } from "~/lib/axios";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import AwsS3 from "@uppy/aws-s3";
import { Dashboard, useUppy } from "@uppy/react";
import { UIContext } from "~/app";

import "@uppy/image-editor/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

const UPPY_AWS_CONFIG = (imageFolder) => ({
  // Generates the pre-signed url
  getUploadParameters: (file) => {
    return functionServer
      .get(
        `actions/s3/signUpload?fileType=${file.type}&fileName=${file.name}&folder=stt/images/${imageFolder}`
      )
      .then(({ data }) => {
        return {
          url: data.signedRequest,
          method: "PUT",
          fields: null,
          headers: {
            "Content-Type": file.type,
          },
        };
      });
  },
});

export default function UppyDashboard({
  imageFolder = "fragments",
  mediaUrl,
  onChange,
  error,
  height = 250,
  resetAfterUpload = false,
}) {
  const { uiState, updateUiState } = useContext(UIContext);
  const uppy = useUppy(() => {
    return new Uppy({
      id: "dashboardUppy",
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
      },
    })
      .use(AwsS3, UPPY_AWS_CONFIG(imageFolder))
      .use(ImageEditor, {
        id: "ImageEditor",
        quality: 1,
        cropperOptions: {
          viewMode: 1,
          background: false,
          autoCropArea: 1,
          responsive: true,
        },
      });
  });

  function setSignedUrl(path) {
    functionServer(`actions/s3/signFileRequest?paths=${path}`).then(
      ({ data }) => {
        updateUiState({
          signedUrls: { ...uiState.signedUrls, [path]: data[0] },
        });
      }
    );
  }

  uppy.on("upload-success", (file, response) => {
    const path = response.uploadURL.replace(
      `${process.env.REACT_APP_S3_BUCKET_URL}/`,
      ""
    );
    onChange(path);
    setSignedUrl(path);
    // if (resetAfterUpload) {
    //   uppy.reset();
    // }
  });

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
