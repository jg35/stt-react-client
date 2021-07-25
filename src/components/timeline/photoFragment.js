import Image from "~/components/image";

export default function PhotoFragment({ fragment }) {
  return (
    <div className="mx-auto">
      <Image
        src={fragment.mediaUrl}
        className="h-auto rounded"
        alt={fragment.mediaCaption}
        title={fragment.mediaCaption}
      />
    </div>
  );
}
