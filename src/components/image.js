import { omit } from "lodash";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function Image(props) {
  const src = useGetSignedImageUrl(props.src);
  if (src) {
    //   TODO use a placeholder while we wait for signed url
    return <img src={src} {...omit(props, ["src"])} />;
  }
  return null;
}
