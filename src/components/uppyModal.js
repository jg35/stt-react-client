import React, { useState, useEffect, useContext } from "react";
import { functionServer } from "~/lib/axios";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import AwsS3 from "@uppy/aws-s3";
import { UIContext } from "~/app";

import { DashboardModal, useUppy } from "@uppy/react";

import "@uppy/image-editor/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

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

export default function UppyModal({
  imageFolder = "fragments",
  mediaUrl,
  onUploadSuccess,
  onClose,
  error,
}) {
  const { uiState, updateUiState } = useContext(UIContext);
  const signedUrl = useGetSignedImageUrl(mediaUrl);
  const [init, setInit] = useState(false);
  const uppy = useUppy(() => {
    return new Uppy({
      id: "dashboardUppy",
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
    setSignedUrl(path);
    onUploadSuccess(path);
    uppy.reset();
  });

  async function addRemoteImage(path) {
    console.log(path);
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
