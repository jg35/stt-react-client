import Image from "~/components/image";
import imageSizes from "~/lib/imageSizes";

export default function PhotoFragment({ fragment, theme }) {
  return (
    <figure className="my-8">
      <Image
        src={fragment.mediaUrl + imageSizes["1400px"]}
        className="w-full shadow"
        data-preview-fragment-id={fragment.id}
      />
      <figcaption
        style={{
          lineHeight: theme.lineHeight,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize,
        }}
        className={`text-center`}
      >
        {fragment.mediaCaption}
      </figcaption>
    </figure>
  );
}
