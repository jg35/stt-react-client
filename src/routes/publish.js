import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router";
import { useLazyQuery } from "@apollo/client";
import { FETCH_PUBLISH_VIEW } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";
import VersionList from "~/components/publish/versionList";
import LatestVersion from "~/components/publish/latestVersion";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import Button from "~/components/button";

export default function Publish() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [init, setInit] = useState(false);
  const [publishedVersions, setPublishedVersions] = useState(null);
  const [getPublishView, { data }] = useLazyQuery(FETCH_PUBLISH_VIEW, {
    variables: { userId: user.id },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!init) {
      getPublishView();
    }
  }, [init]);

  useEffect(() => {
    if (data && data.stt_version) {
      setPublishedVersions(data.stt_version.filter((v) => v.generated));
      setInit(true);
    }
  }, [data]);

  return (
    <Page>
      <div style={{ maxWidth: "1056px", margin: "0 auto" }}>
        {init ? (
          <div>
            <div>
              <h2 className="text-xl my-4">Latest version</h2>
              <Card css="p-4 w-full">
                <LatestVersion version={publishedVersions[0]} />
              </Card>
            </div>
            <div className="text-lg my-6">
              <Button
                css="h-12 w-60 font-medium"
                cta
                onClick={() => history.push("/publish/new")}
              >
                Publish a new version
              </Button>
            </div>
            <div>
              <h2 className="text-lg my-2">Other versions</h2>
              <Card css="pt-4 pl-4 pr-4 pb-2">
                <VersionList publishedVersions={publishedVersions.slice(1)} />
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <PublishSkeleton />
          </Card>
        )}
      </div>
    </Page>
  );
}
