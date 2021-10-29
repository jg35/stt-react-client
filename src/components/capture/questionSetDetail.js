import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function QuestionSetDetail({ set }) {
  return <div className="h-80">{set.title}</div>;
}
