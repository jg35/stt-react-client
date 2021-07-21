import { useEffect, useContext, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { debounce, pick } from "lodash";
import { FETCH_PUBLISH_VIEW, UPDATE_VERSION, PUBLISH_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";
import Button from "~/components/button";
import { getImgIxSrc } from "~/lib/util";
import CurrentVersion from "~/components/publish/currentVersion";
import VersionList from "~/components/publish/versionList";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import CoverEditor from "~/components/publish/coverEditor";

export default function Publish() {
  const { user, dbUser } = useContext(AuthContext);
  const [init, setInit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [publishedVersions, setPublishedVersions] = useState(null);
  const [getPublishView, { data }] = useLazyQuery(FETCH_PUBLISH_VIEW, {
    variables: { userId: user.id },
    fetchPolicy: "network-only",
  });
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [publishVersion] = useMutation(PUBLISH_VERSION);

  const [coverTemplate, setCoverTemplate] = useState({
    imagePosition: "center center",
    titleFontSize: "48px",
    titleColor: "white",
  });

  useEffect(() => {
    if (!init) {
      getPublishView();
    }
  }, [init]);

  useEffect(() => {
    if (data && data.stt_version) {
      setCurrentVersion(data.stt_version.find((v) => !v.generated));
      // Set fonts
      // Get published ones, newest first
      setPublishedVersions(data.stt_version.filter((v) => v.generated));
      setInit(true);
    }
  }, [data]);

  function publishVersionHandler() {
    setIsPublishing(true);
    publishVersion({ variables: { userId: user.id } }).then(() => {
      // TODO check if the op was successful by looking at generated bool
      setInit(false);
      setIsPublishing(false);
    });
  }

  function saveVersionHandler(newValue, field, versionId) {
    console.log("ello");
    if (newValue !== currentVersion[field]) {
      setIsSaving(true);
      const newVersion = { ...currentVersion, [field]: newValue };
      return updateVersion({
        variables: {
          data: pick(newVersion, ["title", "author", "publishedAt", "theme"]),
          id: versionId,
        },
      }).then(() => {
        setIsSaving(false);
      });
    }
  }

  function setTemplate(field, value) {
    setCoverTemplate({
      ...coverTemplate,
      [field]: value,
    });
  }

  return (
    <Page>
      {/* <div style={{ maxWidth: "1056px", margin: "0 auto" }}> */}
      {currentVersion && (
        <>
          {/* <div className="flex items-center my-2">
            <span className="font-medium">Image: </span>
            <Button
              className="mx-2 px-2"
              onClick={() => setTemplate("imagePosition", "left")}
            >
              Left
            </Button>
            <Button
              className="mx-2 px-2"
              onClick={() => setTemplate("imagePosition", "right")}
            >
              Right
            </Button>
            <Button
              className="mx-2 px-2"
              onClick={() => setTemplate("imagePosition", "center center")}
            >
              Center
            </Button>
          </div>
          <div
            style={{
              padding: "5%",
              width: "600px",
              height: "800px",
              backgroundPosition: coverTemplate.imagePosition,
              backgroundSize: "cover",
              backgroundImage: `url(${getImgIxSrc(
                "https://poggl.s3.eu-west-2.amazonaws.com/images/stt/R5rRieKLqrRCMx1XjwTzAHWu80s2/andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg-1626343379336"
              )})`,
            }}
          >
            <h1
              style={{
                fontSize: coverTemplate.titleFontSize,
                color: coverTemplate.titleColor,
              }}
            >
              {currentVersion.title}
            </h1>
          </div> */}
          <CoverEditor
            versionCover={currentVersion.theme.cover}
            updateCover={debounce(
              (cover) =>
                saveVersionHandler(
                  { ...currentVersion.theme, cover },
                  "theme",
                  currentVersion.id
                ),
              2000
            )}
          />
        </>
      )}
      {/* <Card>
          {init ? (
            <>
              <div className="mb-6">
                <CurrentVersion
                  version={currentVersion}
                  isSaving={isSaving}
                  saveVersion={saveVersionHandler}
                  isPublishing={isPublishing}
                  publishVersion={publishVersionHandler}
                />
              </div>
              <VersionList publishedVersions={publishedVersions} />
            </>
          ) : (
            <PublishSkeleton />
          )}
        </Card> */}
      {/* </div> */}
    </Page>
  );
}
