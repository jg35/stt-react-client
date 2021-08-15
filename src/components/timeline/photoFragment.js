import imageSizes from "~/lib/imageSizes";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function PhotoFragment({ fragment }) {
  const url = useGetSignedImageUrl(fragment.mediaUrl + imageSizes["1400px"]);
  const caption = fragment.title || fragment.mediaCaption;
  return (
    <div
      className="flex-1 relative rounded-b"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(0,0,0,.9)",
      }}
    >
      {caption && (
        <>
          <div className="absolute w-full h-10 bottom-0 bg-black rounded-b-md rounded-b"></div>
          <span className="h-10 absolute bottom-0 block text-white text-center rounded-b py-2 font-medium w-full rounded-b">
            {caption}
          </span>
        </>
      )}
      {/* {caption && (
        <>
          <div className="absolute w-full h-8 opacity-50 bottom-0 bg-black rounded-b-md"></div>
          <span className="absolute w-full h-8 text-white py-1 px-2 block bottom-0">
            {fragment.title || fragment.mediaCaption}
          </span>
        </>
      )} */}
    </div>
  );
}
