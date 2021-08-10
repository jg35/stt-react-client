import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_PUBLISH_VIEW } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";
import VersionList from "~/components/publish/versionList";
import LatestVersion from "~/components/publish/latestVersion";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import Button from "~/components/button";
import AccessList from "~/components/accessList/accessList";

export default function Publish() {
  const [versions, setVersions] = useState([]);
  const history = useHistory();
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { data, loading } = useCustomQuery(FETCH_PUBLISH_VIEW, {
    userId: true,
  });

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
              <h2 className="text-xl my-4">Latest version</h2>
              <Card>
                <LatestVersion version={versions[0]} />
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
                <VersionList publishedVersions={versions.slice(1)} />
              </Card>
            </div>
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
