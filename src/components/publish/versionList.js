import { useMutation } from "@apollo/client";
import { sortBy } from "lodash";
import { DELETE_VERSION } from "~/lib/gql";
import VersionListItem from "~/components/publish/versionListItem";

export default function VersionList({ publishedVersions }) {
  const [deleteVersion, { loading: versionIsDeleting }] =
    useMutation(DELETE_VERSION);

  function deleteVersionHandler(id) {
    return deleteVersion({
      variables: {
        id,
      },
      update(cache) {
        const normalizedId = cache.identify({
          id,
          __typename: "stt_version",
        });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    });
  }
  const placeholderImg =
    "bg-blue opacity-30 flex items-center justify-center text-white";
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
                  deleteVersion={deleteVersionHandler}
                  isDeleting={versionIsDeleting}
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
