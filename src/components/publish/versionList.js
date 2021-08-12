import { sortBy } from "lodash";
import VersionListItem from "~/components/publish/versionListItem";

export default function VersionList({ publishedVersions, deleteVersion }) {
  return (
    <div className="overflow-scroll pb-2">
      {publishedVersions.length ? (
        <div className="inline-flex">
          <ul
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "scroll",
            }}
          >
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
      ) : (
        <p>
          Your published versions will appear here when you've created your
          first one
        </p>
      )}
    </div>
  );
}
