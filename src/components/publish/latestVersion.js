import { renderVersionDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import VersionLink from "~/components/publish/versionLink";
import WebLink from "~/components/publish/webLink";
import DeleteModal from "~/components/deleteModal";
import Svg from "~/components/svg";

export default function LatestVersion({
  version,
  isDeleting,
  deleteVersion,
  index,
}) {
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
              <h1 className="text-xl">{version.title}</h1>
              <p className="text-lg text-gray">by {version.author}</p>
              <p className="">
                Published {renderVersionDate(version.publishedAt)}
              </p>
            </div>

            <div>
              <DeleteModal
                onlyIcon={true}
                title="Are you sure you want to delete this version?"
                deleteHandler={() => deleteVersion(version.id)}
                isDeleting={isDeleting}
              />
            </div>
          </div>
          <div>
            <div className="mb-6">
              <span className="text-lg font-medium ml-1">Share</span>
              <div className="flex">
                <Svg name="facebook" width={32} height={32} css="m-1" />
                <Svg name="email" width={32} height={32} css="m-1" />
                <Svg name="whatsapp" width={32} height={32} css="m-1" />
                <Svg name="instagram" width={32} height={32} css="m-1" />
              </div>
            </div>
            <div>
              <span className="text-lg font-medium ml-1">Download</span>
              <div className="flex">
                {version.publishedFormats.split(",").map((format) => (
                  <span className="text-lg m-1 block">
                    <VersionLink
                      key={format}
                      format={format}
                      publishedPath={version.publishedPath}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
