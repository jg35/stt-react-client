import { useContext } from "react";
import { useHistory } from "react-router";
import { useCustomQuery } from "@src/hooks/useCustomApollo";
import { FETCH_PUBLISH_VIEW } from "@src/lib/gql";
import { AuthContext } from "@src/components/authWrap";
import Page from "@src/components/page";
import Card from "@src/components/card";
import VersionList from "@src/components/publish/versionList";
import LatestVersion from "@src/components/publish/latestVersion";
import PublishSkeleton from "@src/components/publish/publishSkeleton";
import Button from "@src/components/button";
import AccessList from "@src/components/accessList/accessList";

export default function Publish() {
  const history = useHistory();
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { data, loading } = useCustomQuery(FETCH_PUBLISH_VIEW, {
    userId: true,
  });

  return (
    <Page>
      <div style={{ maxWidth: "1056px", margin: "0 auto" }}>
        {data ? (
          <div>
            <div>
              <h2 className="text-xl my-4">Latest version</h2>
              <Card>
                <LatestVersion version={data.stt_version[0]} />
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
                <VersionList publishedVersions={data.stt_version.slice(1)} />
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
