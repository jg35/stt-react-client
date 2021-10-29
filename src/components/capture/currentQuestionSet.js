import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function CurrentQuestionSet({ set }) {
  return <div className="h-40">{set.title}</div>;
}
