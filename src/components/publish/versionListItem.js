import { useContext } from "react";
import { renderVersionDate } from "~/lib/util";
import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import { Button, Title, Text } from "~/components/_styled";
import Svg from "~/components/svg";
import { UIContext } from "~/app";

export default function VersionListItem({ last, version, deleteVersion }) {
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
            <Button
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
              <Svg name="delete" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
