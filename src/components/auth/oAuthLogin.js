import { signInWithGoogle, signInWithFacebook } from "~/lib/auth";
import { Button, Title } from "~/components/_styled";
import Svg from "~/components/svg";

export default function OAuthForm({ syncing }) {
  return (
    <>
      <Title
        tag="h2"
        size="compact"
        css="text-center border-t border-lightGray mt-4 mb-4 pt-4"
      >
        Or continue with
      </Title>
      <div className="flex items-center ">
        <div className="flex-1 pr-1">
          <Button variant="cta" onClick={signInWithGoogle} disabled={syncing}>
            <Svg name="google" css="mr-2" color="text-white" />
            Google
          </Button>
        </div>
        <div className="flex-1 pl-1">
          <Button
            disabled={syncing}
            variant="cta"
            css="bg-facebook border-facebook"
            onClick={signInWithFacebook}
          >
            <Svg name="facebook" css="mr-2" color="text-white" />
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}
