import { renderVersionDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import { Title, Text } from "~/components/_styled";
import VersionLink from "~/components/publish/versionLink";
import DeleteModal from "~/components/deleteModal";

export default function VersionListItem({ last, version, deleteVersion }) {
  return (
    <li
      className={`max-w-md flex ${!last && "mr-4 border-lightGray border-r"}`}
    >
      <Image
        src={version.coverUrl + coverImages["300px"]}
        className="shadow rounded mr-4"
        style={{ minWidth: "75px", width: "75px" }}
      />

      <div
        className="flex flex-col justify-between"
        style={{ minWidth: "150px" }}
      >
        <div className="flex justify-between px-1">
          <div className="flex-1">
            <Title css="text-base whitespace-nowrap truncate mr-2 mb-0">
              {version.title}
            </Title>
            <Text
              tag="span"
              size="compact"
              css="text-gray whitespace-nowrap truncate"
            >
              {renderVersionDate(version.publishedAt)}
            </Text>
          </div>

          <div>
            <DeleteModal
              iconSize={16}
              onlyIcon={true}
              deleteSuccessMessage="DELETE_VERSION"
              title="Are you sure you want to delete this version?"
              deleteHandler={() => deleteVersion(version.id)}
            />
          </div>
        </div>

        {/* <div className="flex">
          {version.publishedFormats.split(",").map((format) => (
            <Text tag="span" size="compact" css="mr-1 block" key={format}>
              <VersionLink
                small
                format={format}
                publishedPath={version.publishedPath}
              />
            </Text>
          ))}
        </div> */}
      </div>
    </li>
  );
}
