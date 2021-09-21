import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";

import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_PUBLISH_VIEW, DELETE_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import {
  Button,
  Card,
  ClickToCopy,
  Title,
  Grid,
  ManagePrivacySettingsButton,
  BookPrivacyStatus,
  Text,
} from "~/components/_styled";
import Svg from "~/components/svg";
import VersionList from "~/components/publish/versionList";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import useToastMessage from "~/hooks/useToastMessage";
import usePageTitle from "~/hooks/usePageTitle";
import OnlineToggle from "~/components/publish/onlineToggle";
import BookCover from "~/components/publish/bookCover";
import ShareLinks from "~/components/publish/shareLinks";

import AccessListStatusButton from "~/components/accessList/accessListStatusButton";

export default function Publish() {
  usePageTitle("Publish");
  const { setError } = useToastMessage();
  const [versions, setVersions] = useState([]);
  const [publishedVersion, setPublishedVersion] = useState(null);
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
    if (data && dbUser) {
      const hasPublished = dbUser.publishedVersion !== null;
      if (!hasPublished) {
        history.push("/publish/new");
      } else {
        setVersions(data.stt_version.filter((v) => v.generated));
        setPublishedVersion(
          data.stt_version.find((v) => v.id === dbUser.publishedVersion)
        );
      }
    }
  }, [data, dbUser]);

  const hasPrevVersions = versions.slice(1).length >= 1;

  const websiteUrl = `${process.env.REACT_APP_READER_VIEW_URL}/${dbUser?.publicHandle}`;
  const isPublic = publishedVersion?.privacyStatus === "PUBLIC";
  const bookOnline = dbUser?.bookOnline;

  return (
    <Page scrollable>
      <div className="flex justify-end">
        <Button
          variant="cta"
          css="w-auto whitespace-nowrap mt-2 mb-4"
          onClick={() => history.push("/publish/new")}
        >
          Create new version
        </Button>
      </div>

      {publishedVersion ? (
        <Grid colSpan={["col-span-12 lg:col-span-6"]}>
          <BookCover coverUrl={publishedVersion.coverUrl} />
          <Grid colSpan={["col-span-12 md:col-span-6 lg:col-span-12"]}>
            <Card css="w-full md:h-full lg:h-fit-content">
              <Title>Your website</Title>

              <div className="flex mb-6">
                <a
                  href={websiteUrl}
                  className="inline-flex items-center text-offBlack font-bold underline hover:text-blue"
                  target="_blank"
                >
                  <Svg name="internet" size={16} css="mr-2" />
                  {websiteUrl}
                </a>
                <ClickToCopy
                  copyText="Copy url"
                  css="ml-4 w-24"
                  value={websiteUrl}
                />
              </div>

              <OnlineToggle
                isOnline={bookOnline}
                userId={user.id}
                isPublic={isPublic}
              />
            </Card>
            <Card css="w-full md:h-full lg:h-fit-content">
              <Title>Share your book</Title>
              <Text>
                Share your website by selecting one of the options below
              </Text>
              <ShareLinks
                title={publishedVersion.title}
                author={publishedVersion.author}
                isPublic={isPublic}
                shareUrl={websiteUrl}
              />
            </Card>
            <Card css="w-full md:h-full lg:h-fit-content">
              <Title>Privacy</Title>
              <BookPrivacyStatus prefix="Your book is" isPublic={isPublic} />

              <Grid colSpan={["col-span-12 lg:col-span-6"]} css="mt-6">
                <ManagePrivacySettingsButton />
                {!isPublic && <AccessListStatusButton userId={user.id} />}
              </Grid>
            </Card>
            <Card css="w-full md:h-full lg:h-fit-content">
              <Title>Older versions</Title>
              <VersionList
                publishedVersions={versions.filter(
                  (v) => v.id !== dbUser.publishedVersion
                )}
                deleteVersion={deleteVersionHandler}
              />
            </Card>
          </Grid>
        </Grid>
      ) : (
        <PublishSkeleton />
      )}
    </Page>
  );
}
