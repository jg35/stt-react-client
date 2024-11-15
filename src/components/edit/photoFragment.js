import Image from "~/components/image";
import imageSizes from "~/lib/imageSizes";

export default function PhotoFragment({ fragment }) {
  return (
    <figure>
      <Image
        src={fragment.mediaUrl + imageSizes["1400px"]}
        className="w-auto shadow mx-auto"
        data-preview-fragment-id={fragment.id}
        style={{ maxHeight: "500px" }}
      />
      <figcaption className="preview-element">
        {fragment.mediaCaption}
      </figcaption>
    </figure>
  );
}
