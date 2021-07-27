import { sortBy } from "lodash";
import { renderFragmentDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import VersionLink from "~/components/publish/versionLink";
import WebLink from "~/components/publish/webLink";

export default function VersionList({ publishedVersions }) {
  const placeholderImg =
    "bg-blue opacity-30 flex items-center justify-center text-white";
  return (
    <>
      <h2 className="text-lg mb-6">Published versions</h2>
      <ul style={{ maxWidth: "768px" }}>
        <li className="flex">
          <div className="w-20 p-2"></div>
          <div className="flex-1 px-4 font-medium">Published</div>

          <div className="flex-1 px-4 font-medium">Title</div>
          <div className="flex-1 px-4 font-medium">Author</div>
          <div className="flex-1 px-4 font-medium">Links</div>
        </li>
        {sortBy(publishedVersions, ["date", "id"])
          .reverse()
          .map((v, i) => {
            return (
              <li key={v.id} className="flex mb-6 items-center">
                <div className="w-12 h-16">
                  <Image
                    src={v.coverUrl + coverImages["300px"]}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 px-4">
                  {renderFragmentDate(v.publishedAt)}
                </div>

                <div className="flex-1 px-4">{v.title}</div>
                <div className="flex-1 px-4">{v.author}</div>
                <div className="flex-1 px-4 flex justify-between">
                  {v.publishedFormats.split(",").map((format) => (
                    <VersionLink
                      key={format}
                      format={format}
                      publishedPath={v.publishedPath}
                    />
                  ))}
                  <WebLink versionId={v.id} />
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
}
