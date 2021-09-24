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
  return <Svg name={name} size={32} hoverColor={name} />;
}

export default function ShareLinks({ title, author, shareUrl, isPublic }) {
  return (
    <div className="flex mr-2">
      <EmailShareButton
        url={shareUrl}
        subject={getTranslationString("share.email.subject")}
        separator={"\n\n"}
      >
        <SocialIcon name="gmail" />
      </EmailShareButton>
      <WhatsappShareButton
        url={shareUrl}
        title={getTranslationString("share.social.title")}
      >
        <SocialIcon name="whatsapp" />
      </WhatsappShareButton>
      <FacebookMessengerShareButton
        url={shareUrl}
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        redirectUri={`${process.env.REACT_APP_BASE_URL}/publish`}
      >
        <SocialIcon name="facebookMessenger" />
      </FacebookMessengerShareButton>
      {isPublic && (
        <>
          <FacebookShareButton
            url={shareUrl}
            quote={getTranslationString("share.social.title")}
          >
            <SocialIcon name="facebook" />
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            hashtags={["storiestotell", "memoir", "autobiography"]}
            title={getTranslationString("share.social.title")}
          >
            <SocialIcon name="twitter" />
          </TwitterShareButton>
        </>
      )}
    </div>
  );
}
