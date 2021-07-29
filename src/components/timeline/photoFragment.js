import Image from "~/components/image";
import imageSizes from "~/lib/imageSizes";

export default function PhotoFragment({ fragment }) {
  return (
    <div className="flex-1 overflow-hidden">
      <Image
        style={{ objectFit: "cover", maxHeight: "100%" }}
        src={fragment.mediaUrl + imageSizes["400px"]}
        alt={fragment.mediaCaption}
        title={fragment.mediaCaption}
      />
    </div>
  );
}
