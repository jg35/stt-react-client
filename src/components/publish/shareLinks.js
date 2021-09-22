import Svg from "~/components/svg";
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";

import { getTranslationString } from "~/lib/util";

function SocialIcon({ name }) {
  return <Svg name={name} size={32} hoverColor={`text-${name}`} />;
}

export default function ShareLinks({ title, author, shareUrl, isPublic }) {
  return (
    <div className="flex mr-2">
      <EmailShareButton
        url={shareUrl}
        subject={getTranslationString("share.email.subject")}
        body={getTranslationString("share.email.body", [
          { key: "BOOK_NAME", value: title },
          { key: "BOOK_AUTHOR", value: author },
        ])}
        separator={"\n\n"}
      >
        <SocialIcon name="gmail" />
      </EmailShareButton>
      <WhatsappShareButton
        url={shareUrl}
        title={getTranslationString("share.whatsapp.title", [
          { key: "BOOK_NAME", value: title },
          { key: "BOOK_AUTHOR", value: author },
        ])}
      >
        <SocialIcon name="whatsapp" />
      </WhatsappShareButton>
      <FacebookMessengerShareButton
        url={shareUrl}
        appId={process.env.REACT_APP_FACEBOOK_POGGL_APP_ID}
        redirectUri={`${process.env.REACT_APP_BASE_URL}/publish`}
      >
        <SocialIcon name="facebookMessenger" />
      </FacebookMessengerShareButton>
      {isPublic && (
        <>
          <FacebookShareButton
            url={shareUrl}
            quote={getTranslationString("share.facebook.quote")}
          >
            <SocialIcon name="facebook" />
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            hashtags={["storiestotell", "memoir", "autobiography"]}
            title={getTranslationString("share.twitter.title", [
              { key: "BOOK_NAME", value: title },
              { key: "BOOK_AUTHOR", value: author },
            ])}
          >
            <SocialIcon name="twitter" />
          </TwitterShareButton>
        </>
      )}
    </div>
  );
}
