import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import DeleteModal from "~/components/deleteModal";
import Svg from "~/components/svg";
import {
  ClickToCopy,
  LinkButton,
  Paper,
  BookPrivacyStatus,
} from "~/components/_styled";

import AccessListStatusButton from "~/components/accessList/accessListStatusButton";

export default function LatestVersion({
  version,
  deleteVersion,
  onlyVersion,
  handle,
}) {
  return (
    // <Paper>
    <div className="bg-white rounded-lg shadow-xl border-l-8 border-r-8 border-t-4 border-b-4 border-white">
      <div className="w-full flex bg-white p-2 justify-between items-center rounded-t-lg">
        <div>
          {/* TODO */}
          <span className="flex mr-2">
            <Svg name="facebook" css="md:mr-2 md:h-8 md:w-8" />
            <Svg name="email" css="m-1 md:mr-2 md:h-8 md:w-8" />
            <Svg name="whatsapp" css="m-1 md:mr-2 md:h-8 md:w-8" />
            <Svg name="instagram" css="m-1 md:mr-2 md:h-8 md:w-8" />
          </span>
        </div>

        <div className="flex">
          <LinkButton
            external
            size="compact"
            css="w-auto font-medium"
            href={`${process.env.REACT_APP_READER_VIEW_URL}/${handle}`}
          >
            View
          </LinkButton>
          <ClickToCopy
            copyText="Copy share url"
            text={`${process.env.REACT_APP_READER_VIEW_URL}/${handle}`}
          />
        </div>
      </div>
      <Image
        src={version.coverUrl + coverImages["1200px"]}
        className="rounded"
        style={{ minWidth: "150px" }}
      />
      <div className="flex justify-between items-center px-2">
        <BookPrivacyStatus
          prefix="Your book is"
          isPublic={version.privacyStatus === "PUBLIC"}
        />
        <AccessListStatusButton
          isPublic={version.privacyStatus === "PUBLIC"}
          userId={version.userId}
        />
      </div>
    </div>
    // </Paper>
  );
}
