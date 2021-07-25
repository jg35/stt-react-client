import { useEffect, useContext, useState } from "react";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { pick } from "lodash";
import {
  FETCH_PUBLISH_VIEW,
  UPDATE_VERSION,
  PUBLISH_VERSION,
  GENERATE_COVER,
} from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";
import CurrentVersion from "~/components/publish/currentVersion";
import VersionList from "~/components/publish/versionList";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import CoverEditor from "~/components/publish/coverEditor";

export default function Publish() {
  const { user, dbUser } = useContext(AuthContext);
  const [init, setInit] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
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
  const [generateCover] = useMutation(GENERATE_COVER);

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

  function saveTheme(theme, versionId) {
    return updateVersion({
      variables: {
        data: { theme },
        id: versionId,
      },
    });
  }

  function saveVersionHandler(newValue, field, versionId) {
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

  return (
    <Page>
      <div style={{ maxWidth: "1056px", margin: "0 auto" }}>
        <Card>
          {init ? (
            <>
              <div className="mb-6">
                <CurrentVersion
                  setShowCoverEditor={setShowCoverEditor}
                  version={currentVersion}
                  isSaving={isSaving}
                  saveVersion={saveVersionHandler}
                  isPublishing={isPublishing}
                  publishVersion={publishVersionHandler}
                />
              </div>
              <VersionList publishedVersions={publishedVersions} />
              {showCoverEditor && currentVersion.theme.cover && (
                <CoverEditor
                  closeCoverEditor={() => setShowCoverEditor(!showCoverEditor)}
                  versionCover={currentVersion.theme.cover}
                  updateCover={(cover) => {
                    return saveTheme(
                      { ...currentVersion.theme, cover },
                      currentVersion.id
                    ).then(() => {
                      return generateCover({
                        variables: {
                          userId: user.id,
                        },
                        update(cache, { data }) {
                          cache.modify({
                            fields: {
                              stt_version(versions = []) {
                                // force refetch
                                return [];
                              },
                            },
                          });
                        },
                      });
                    });
                  }}
                />
              )}
            </>
          ) : (
            <PublishSkeleton />
          )}
        </Card>
      </div>
    </Page>
  );
}
