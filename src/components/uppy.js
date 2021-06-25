import React, { useEffect } from "react";
import axios from "axios";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { Dashboard } from "@uppy/react";

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

const dashboardUppy = new Uppy({
  // See https://uppy.io/docs/uppy/#Options for config
  id: "dashboardUppy",
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
  },
});

export default function UppyDashboard({ userId, item, setItem }) {
  useEffect(() => {
    dashboardUppy.use(AwsS3, UPPY_AWS_CONFIG(userId));
    // dashboardUppy.use(ImageEditor, { target: Dashboard })
    dashboardUppy.on("upload-success", (file, response) => {
      console.log(file, response);
      setItem({ ...item, mediaUrl: response.uploadURL });
    });
    return () => {
      dashboardUppy.close();
    };
  }, []);
  return (
    <Dashboard
      uppy={dashboardUppy}
      proudlyDisplayPoweredByUppy={false}
      height={250}
      locale={{ strings: { done: "Replace image" } }}
      hideProgressAfterFinish={true}
      showLinkToFileUploadResult={false}
    />
  );
}
