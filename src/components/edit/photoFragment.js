import Image from "~/components/image";

export default function PhotoFragment({ fragment, theme }) {
  return (
    <figure className="my-8">
      <Image
        src={fragment.mediaUrl}
        className="w-full shadow"
        data-preview-fragment-id={fragment.id}
      />
      <figcaption
        className={`text-center ${theme.lineHeight} ${theme.fontFamily} ${theme.fontSize}`}
      >
        {fragment.mediaCaption}
      </figcaption>
    </figure>
  );
}
