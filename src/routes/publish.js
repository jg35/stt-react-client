import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";

import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_PUBLISH_VIEW, DELETE_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import { Button, Card, Title } from "~/components/_styled";
import VersionList from "~/components/publish/versionList";
import LatestVersion from "~/components/publish/latestVersion";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import AccessList from "~/components/accessList/accessList";
import useToastMessage from "~/hooks/useToastMessage";

export default function Publish() {
  const { setError } = useToastMessage();
  const [versions, setVersions] = useState([]);
  const history = useHistory();
  const {
    authState: { user, dbUser },
  } = useContext(AuthContext);
  const { data } = useCustomQuery(FETCH_PUBLISH_VIEW, {
    userId: true,
  });
  const [deleteVersion] = useMutation(DELETE_VERSION);

  function deleteVersionHandler(id) {
    return deleteVersion({
      variables: {
        id,
      },
      update(cache) {
        cache.modify({
          id: cache.identify(dbUser),
          fields: {
            versions: () => dbUser.versions.filter((v) => v.id !== id),
          },
        });
        const normalizedId = cache.identify({
          id,
          __typename: "stt_version",
        });
        cache.evict({ id: normalizedId });
        cache.gc();
        // If deleting the last version, redirect to the timeline
        if (versions.length === 1) {
          history.push("/");
        }
      },
    }).catch((e) => setError(e, { ref: "DELETE", params: ["book"] }));
  }

  useEffect(() => {
    if (data) {
      const published = data.stt_version.filter((v) => v.generated);
      if (!published.length) {
        history.push("/publish/new");
      } else {
        setVersions(data.stt_version.filter((v) => v.generated));
      }
    }
  }, [data]);

  return (
    <Page>
      <div style={{ maxWidth: "1056px", margin: "0 auto" }}>
        {versions.length > 0 ? (
          <div>
            <div>
              <Title css="my-4">Published version</Title>
              <Card>
                <LatestVersion
                  onlyVersion={versions.length === 1}
                  version={versions[0]}
                  deleteVersion={deleteVersionHandler}
                />
              </Card>
            </div>
            <div className="text-lg my-6">
              <Button
                variant="cta"
                css="w-auto whitespace-nowrap"
                onClick={() => history.push("/publish/new")}
              >
                Publish a new version
              </Button>
            </div>
            {versions.slice(1).length >= 1 && (
              <div>
                <Title tag="h3" css="mt-2 mb-2" size="compact">
                  Other versions
                </Title>
                <Card css="pt-4 pl-4 pr-4 pb-2">
                  <VersionList
                    publishedVersions={versions.slice(1)}
                    deleteVersion={deleteVersionHandler}
                  />
                </Card>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <PublishSkeleton />
          </Card>
        )}
      </div>
      <AccessList userId={user.id} />
    </Page>
  );
}
