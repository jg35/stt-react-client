import { coverImages } from "~/lib/imageSizes";
import Image from "~/components/image";
import Svg from "~/components/svg";
import {
  LinkButton,
  ManagePrivacySettingsButton,
  BookPrivacyStatus,
} from "~/components/_styled";

import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
import { getTranslation } from "~/lib/util";

import OnlineToggle from "~/components/publish/onlineToggle";
import AccessListStatusButton from "~/components/accessList/accessListStatusButton";

export default function LatestVersion({
  version,
  handle,
  userId,
  bookOnline,
  onlyVersion,
}) {
  const shareUrl = `${process.env.REACT_APP_READER_VIEW_URL}/${handle}`;
  const isPublic = version.privacyStatus === "PUBLIC";
  return (
    <>
      <div
        className={`flex justify-center ${!onlyVersion && "lg:justify-end"}`}
      >
        <div className="bg-white rounded-lg shadow-xl border-l-8 border-r-8 border-t-4 border-b-4 border-white">
          <div className="w-full flex bg-white py-2 justify-between items-center rounded-t-lg">
            <div>
              <span className="flex mr-2">
                <EmailShareButton
                  url={shareUrl}
                  subject={getTranslation("share.email.subject")}
                  body={getTranslation("share.email.body", [
                    { key: "BOOK_NAME", value: version.title },
                    { key: "BOOK_AUTHOR", value: version.author },
                  ])}
                  separator={"\n\n"}
                >
                  <Svg name="email" css="m-1 md:mr-2 " />
                </EmailShareButton>
                <WhatsappShareButton
                  url={shareUrl}
                  title={getTranslation("share.whatsapp.title", [
                    { key: "BOOK_NAME", value: version.title },
                    { key: "BOOK_AUTHOR", value: version.author },
                  ])}
                >
                  <Svg name="whatsapp" css="m-1 md:mr-2 " />
                </WhatsappShareButton>
                <FacebookMessengerShareButton
                  url={shareUrl}
                  appId={process.env.REACT_APP_FACEBOOK_POGGL_APP_ID}
                  redirectUri={`${process.env.REACT_APP_BASE_URL}/publish`}
                >
                  <Svg name="facebookMessenger" css="m-1 md:mr-2 " />
                </FacebookMessengerShareButton>
                {isPublic && (
                  <>
                    <FacebookShareButton
                      url={shareUrl}
                      quote={getTranslation("share.facebook.quote")}
                    >
                      <Svg name="facebook" css="md:mr-2 " />
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={shareUrl}
                      hashtags={["storiestotell", "memoir", "autobiography"]}
                      title={getTranslation("share.twitter.title", [
                        { key: "BOOK_NAME", value: version.title },
                        { key: "BOOK_AUTHOR", value: version.author },
                      ])}
                    >
                      <Svg name="twitter" css="m-1 md:mr-2 " />
                    </TwitterShareButton>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center">
              {bookOnline !== null && (
                <OnlineToggle
                  isOnline={bookOnline}
                  userId={userId}
                  isPublic={isPublic}
                />
              )}
              <LinkButton
                external
                size="compact"
                css="w-auto font-medium"
                href={`${process.env.REACT_APP_READER_VIEW_URL}/${handle}`}
              >
                View
              </LinkButton>
              {/* <ClickToCopy
                copyText="Copy share url"
                value={`${process.env.REACT_APP_READER_VIEW_URL}/${handle}`}
              /> */}
            </div>
          </div>
          <Image
            src={version.coverUrl + coverImages["1200px"]}
            className="rounded mx-auto"
            style={{ minWidth: "150px", maxHeight: "60vh" }}
          />
          <div className="flex justify-between items-center pl-2">
            <BookPrivacyStatus prefix="Your book is" isPublic={isPublic} />
            <div className="flex">
              <ManagePrivacySettingsButton
                css={`
                  ${!isPublic && "hidden xs:block"}
                `}
              />
              {!isPublic && (
                <AccessListStatusButton
                  userId={version.userId}
                  showEmptyCta={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
