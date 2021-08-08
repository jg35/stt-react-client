import Image from "~/components/image";
import imageSizes from "~/lib/imageSizes";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function PhotoFragment({ fragment }) {
  const url = useGetSignedImageUrl(fragment.mediaUrl + imageSizes["400px"]);
  return (
    <div
      className="flex-1 relative"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute w-full h-8 opacity-50 bottom-0 bg-black rounded-b-md"></div>
      <span className="absolute w-full h-8 text-white py-1 px-2 block bottom-0">
        {fragment.title || fragment.mediaCaption}
      </span>
    </div>
  );
}
