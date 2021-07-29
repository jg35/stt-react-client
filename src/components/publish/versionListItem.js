import { renderVersionDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import VersionLink from "~/components/publish/versionLink";
import WebLink from "~/components/publish/webLink";
import DeleteModal from "~/components/deleteModal";
import Svg from "~/components/svg";

export default function VersionItem({ version, isDeleting, deleteVersion }) {
  return (
    <li
      key={version.id}
      className="mr-4 max-w-md border-lightGray border-r flex"
    >
      <Image
        src={version.coverUrl + coverImages["300px"]}
        className="shadow rounded mr-4"
        style={{ minWidth: "75px", width: "75px" }}
      />

      <div className="flex flex-col justify-between">
        <div className="flex justify-between px-1">
          <div className="flex-1">
            <h1 className="font-medium whitespace-no-wrap truncate mr-2">
              {version.title}
            </h1>
            <span className="text-gray">
              {renderVersionDate(version.publishedAt)}
            </span>
          </div>

          <div>
            <DeleteModal
              iconSize={16}
              onlyIcon={true}
              title="Are you sure you want to delete this version?"
              deleteHandler={() => deleteVersion(version.id)}
              isDeleting={isDeleting}
            />
          </div>
        </div>

        <div className="flex">
          {version.publishedFormats.split(",").map((format) => (
            <span className="text-lg mr-1 block">
              <VersionLink
                small
                key={format}
                format={format}
                publishedPath={version.publishedPath}
              />
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
