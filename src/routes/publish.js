import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";

import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_PUBLISH_VIEW, DELETE_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import { Button, Card, Title, Grid } from "~/components/_styled";
import VersionList from "~/components/publish/versionList";
import LatestVersion from "~/components/publish/latestVersion";
import PublishSkeleton from "~/components/publish/publishSkeleton";
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
    <Page scrollable>
      <div className="flex justify-end items-center">
        <Button
          variant="cta"
          css="w-auto whitespace-nowrap mb-4"
          onClick={() => history.push("/publish/new")}
        >
          Create book
        </Button>
      </div>

      {versions.length > 0 ? (
        <Grid
          colSpan={[
            "col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-0 ",
            "col-span-12 lg:col-span-6",
          ]}
        >
          <LatestVersion
            handle={dbUser && dbUser.publicHandle}
            onlyVersion={versions.length === 1}
            version={versions[0]}
            deleteVersion={deleteVersionHandler}
            userId={user.id}
            bookOnline={dbUser !== null ? dbUser.bookOnline : false}
          />
          <Card css="w-full" style={{ height: "fit-content" }}>
            {versions.slice(1).length >= 1 && (
              <>
                <Title
                  tag="h3"
                  css="mb-4 md:text-center lg:text-left pb-2"
                  size="compact"
                >
                  Previous versions
                </Title>

                <VersionList
                  publishedVersions={versions.slice(1)}
                  deleteVersion={deleteVersionHandler}
                />
              </>
            )}
          </Card>
        </Grid>
      ) : (
        <PublishSkeleton />
      )}
    </Page>
  );
}
