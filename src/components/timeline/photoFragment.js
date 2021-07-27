import Image from "~/components/image";
import imageSizes from "~/lib/imageSizes";

export default function PhotoFragment({ fragment }) {
  return (
    <div className="mx-auto">
      <Image
        src={fragment.mediaUrl + imageSizes["400px"]}
        className="h-auto rounded"
        alt={fragment.mediaCaption}
        title={fragment.mediaCaption}
      />
    </div>
  );
}
