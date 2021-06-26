import React from "react";
import axios from "axios";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { Dashboard, useUppy } from "@uppy/react";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

const UPPY_AWS_CONFIG = (userId) => ({
  // Generates the pre-signed url
  getUploadParameters: (file) => {
    const fileName = `${file.name}-${Date.now()}`;
    return axios
      .get(
        `${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/sign-s3?fileType=${file.type}&fileName=${fileName}&folder=stt/${userId}`
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

export default function UppyDashboard({ userId, mediaUrl, onChange, error }) {
  const uppy = useUppy(() => {
    return new Uppy({
      id: "dashboardUppy",
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
      },
    }).use(AwsS3, UPPY_AWS_CONFIG(userId));
  });
  uppy.on("upload-success", (file, response) => {
    onChange(response.uploadURL);
  });

  return (
    <div className={error && "uppy-validate-error"}>
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        height={250}
        locale={{ strings: { done: "Replace image" } }}
        hideProgressAfterFinish={true}
        showLinkToFileUploadResult={false}
      />
    </div>
  );
}
