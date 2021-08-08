import Image from "@src/components/image";
import imageSizes from "@src/lib/imageSizes";

export default function PhotoFragment({ fragment }) {
  return (
    <figure>
      <Image
        src={fragment.mediaUrl + imageSizes["1400px"]}
        className="w-full shadow"
        data-preview-fragment-id={fragment.id}
      />
      <figcaption>{fragment.mediaCaption}</figcaption>
    </figure>
  );
}
