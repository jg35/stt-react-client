import { useContext, useState } from "react";
import { renderVersionDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import { Button, Title, Text } from "~/components/_styled";
import Svg from "~/components/svg";
import { UIContext } from "~/app";
import ViewOldVersionModal from "~/components/publish/viewOldVersionModal";

export default function VersionListItem({ last, version, deleteVersion }) {
  const [showPreview, setShowPreview] = useState(false);
  const { updateUiState, showDeleteWarning } = useContext(UIContext);
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
          <div className="flex flex-col justify-around">
            <Title css="text-base whitespace-nowrap truncate mr-2 mb-0">
              {version.title}
            </Title>

            <Text
              tag="span"
              size="compact"
              css="text-gray whitespace-nowrap truncate"
            >
              {renderVersionDate(version.publishedAt)}

              <span className="text-sm block -mt-1 mb-2">
                Version {version.version}
              </span>
            </Text>
          </div>

          <div>
            <Button
              size="compact"
              type="minimal"
              onClick={() => {
                showDeleteWarning({
                  title: "Are you sure you want to delete this version?",
                }).then(() => {
                  deleteVersion(version.id).then(() => {
                    updateUiState({ deleteModal: { show: false } });
                  });
                });
              }}
            >
              <Svg name="delete" height={16} width={16} />
            </Button>
          </div>
        </div>
        <div>
          <Button
            size="compact"
            css="w-auto"
            onClick={() => setShowPreview(true)}
          >
            View
          </Button>
          {showPreview && (
            <ViewOldVersionModal
              setShowPreview={setShowPreview}
              version={version}
            />
          )}
        </div>
      </div>
    </li>
  );
}
