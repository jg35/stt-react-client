import imageSizes from "~/lib/imageSizes";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function PhotoFragment({ fragment }) {
  const url = useGetSignedImageUrl(
    fragment.lockMediaUrl
      ? fragment.mediaUrl
      : fragment.mediaUrl + imageSizes["1400px"]
  );
  const caption = fragment.mediaCaption;
  return (
    <div
      className="flex-1 relative rounded-b"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255,255,255.9)",
      }}
    >
      {caption && (
        <>
          <div className="absolute w-full bottom-0 left-0 py-1 px-2 h-auto bg-offBlack bg-opacity-80 text-white text-center">
            {caption}
          </div>
        </>
      )}
    </div>
  );
}
