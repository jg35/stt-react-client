import { renderVersionDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import DeleteModal from "~/components/deleteModal";
import Svg from "~/components/svg";
import AccessListStatusButton from "~/components/accessList/accessListStatusButton";
import { Title, Text } from "~/components/_styled";

export default function LatestVersion({ version, deleteVersion, onlyVersion }) {
  return (
    <div>
      <div className="px-2"></div>
      <div className="flex rounded-lg">
        <div className="mr-4">
          <Image
            src={version.coverUrl + coverImages["300px"]}
            className="shadow-lg rounded-md"
            style={{ minWidth: "150px" }}
          />
        </div>

        <div className="w-full min-h-full flex flex-col justify-between">
          <div className="flex justify-between ml-1 mt-1">
            <div className="flex-1">
              <Title tag="h2">{version.title}</Title>
              <Text size="large" css="text-gray">
                by {version.author}
              </Text>
              <Text>Published {renderVersionDate(version.publishedAt)}</Text>
            </div>

            <div>
              <DeleteModal
                onlyIcon={true}
                deleteSuccessMessage={
                  onlyVersion ? "DELETE_VERSION" : "DELETE_LATEST_VERSION"
                }
                title="Are you sure you want to delete this version?"
                deleteHandler={() => deleteVersion(version.id)}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <AccessListStatusButton
                isPublic={version.privacyStatus === "PUBLIC"}
                userId={version.userId}
              />
            </div>
          </div>
          <div>
            <div>
              <Text tag="span" css="font-medium ml-1">
                Share
              </Text>
              <div className="flex">
                <Svg name="facebook" width={32} height={32} css="m-1" />
                <Svg name="email" width={32} height={32} css="m-1" />
                <Svg name="whatsapp" width={32} height={32} css="m-1" />
                <Svg name="instagram" width={32} height={32} css="m-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
