import { getImgIxSrc } from "~/lib/util";

export default function PhotoFragment({ fragment, theme }) {
  return (
    <figure className="my-8">
      <img
        src={`${getImgIxSrc(fragment.mediaUrl)}?width=600`}
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
