import { signInWithGoogle, signInWithFacebook } from "@src/lib/auth";
import Button from "@src/components/button";
import Svg from "@src/components/svg";

export default function OAuthForm() {
  return (
    <>
      <p className="text-lg mb-4 font-medium font-medium text-center border-t border-lightGray mt-4 pt-4">
        Or continue with
      </p>
      <div className="flex items-center ">
        <div className="flex-1 pr-1">
          <Button
            bigCta
            css="text-xl py-3 px-4 w-full justify-center font-medium rounded bg-black text-white"
            onClick={signInWithGoogle}
          >
            <Svg name="google" css="h-5 w-5 mr-3" color="white" />
            Google
          </Button>
        </div>
        <div className="flex-1 pl-1">
          <Button
            bigCta
            css="text-xl py-3 px-4 w-full justify-center font-medium rounded text-white bg-facebook"
            onClick={signInWithFacebook}
          >
            <Svg name="facebook" css="h-5 w-5 mr-3" color="white" />
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}
