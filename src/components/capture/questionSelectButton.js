import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";
import Svg from "~/components/svg";
import { Button } from "~/components/_styled";

export default function QuestionSelectButton({ questionSet, toggle }) {
  const url = useGetSignedImageUrl(questionSet.imageUrl);
  return (
    <div className="px-1" id="question-select-button">
      <Button
        onClick={toggle}
        variant="minimal"
        css="relative border-none text-base hover:border-none shadow whitespace-nowrap overflow-hidden"
        style={{
          paddingLeft: 6,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <p>{questionSet.title}</p>
        <div
          className="ml-2 rounded-r bg-repeat-none bg-cover bg-center "
          style={{
            height: "32px",
            width: "32px",
            backgroundImage: `url(${url})`,
          }}
        >
          <div className="bg-black bg-opacity-30 w-full h-full flex items-center justify-center  p-1">
            <Svg name="search" color="white" size={12} />
          </div>
        </div>
      </Button>
    </div>
  );
}
