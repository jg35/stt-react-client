import { signInWithGoogle, signInWithFacebook } from "~/lib/auth";
import { Button } from "~/components/_styled";
import Svg from "~/components/svg";

export default function OAuthForm({ syncing, screen = "LOGIN" }) {
  return (
    <>
      <Button
        css="bg-offWhite border-offWhite text-offBlack my-4 hover:text-white hover:bg-google hover:border-google"
        onClick={signInWithGoogle}
        disabled={syncing}
      >
        <Svg name="google" css="mr-2" color="currentColor" />
        {screen === "LOGIN" ? "Continue" : "Sign up"} with Google
      </Button>

      <Button
        disabled={syncing}
        css="bg-offWhite border-offWhite text-facebook my-4 hover:text-offWhite hover:bg-facebook hover:border-facebook"
        onClick={signInWithFacebook}
      >
        <Svg name="facebook" css="mr-2" color="currentColor" />
        {screen === "LOGIN" ? "Continue" : "Sign up"} with Facebook
      </Button>
    </>
  );
}
