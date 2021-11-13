import sortBy from "lodash/sortBy";
import VersionListItem from "~/components/publish/versionListItem";

export default function VersionList({ publishedVersions, deleteVersion }) {
  return (
    <div className="overflow-x-scroll pb-2">
      <div className="inline-flex">
        <ul className="w-full flex flexnowrap overflow-x-scroll">
          {sortBy(publishedVersions, ["date", "id"])
            .reverse()
            .map((v, i) => (
              <VersionListItem
                last={i === publishedVersions.length - 1}
                deleteVersion={deleteVersion}
                version={v}
                key={v.id}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
