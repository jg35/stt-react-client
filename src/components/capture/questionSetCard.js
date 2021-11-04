import { Title, Text, Button } from "~/components/_styled";
import Svg from "~/components/svg";
import ProgressRing from "~/components/progressRing";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";

export default function QuestionSetCard({ set, selectQuestionSet }) {
  const url = useGetSignedImageUrl(set.imageUrl);
  const hiddenCount = set.questions.filter((q) => q.hidden).length;
  const completed = !set.shuffleOrder.length;
  return (
    <div className="h-40 my-2 p-1">
      <div
        className={`bg-lightBlack shadow h-full w-64 md:w-72 flex rounded-md overflow-hidden transition ease-in duration-200 ${
          completed ? "cursor-default" : "cursor-pointer hover:bg-black "
        }`}
        onClick={() => {
          if (!completed) {
            selectQuestionSet(set.id);
          }
        }}
      >
        <div
          className={`flex-1 bg-cover overflow-hidden rounded-l-md bg-center bg-repeat-none filter transition ease-in duration-200 ${
            completed ? "grayscale" : "grayscale-70 hover:grayscale-0"
          }`}
          style={{
            backgroundImage: `url(${url})`,
          }}
        >
          <div className="w-full h-full bg-black bg-opacity-30 text-white flex flex-col pl-4 py-3 pr-2 justify-between whitespace-normal">
            <div className="flex justify-between items-start w-full">
              <div>
                <Text css="my-0 text-sm font-medium">
                  {set.questions.length} questions{" "}
                  {/* {hiddenCount > 0 && `(${hiddenCount} skipped)`} */}
                </Text>
                <Title css="mb-0">{set.title}</Title>
              </div>
              <ProgressRing
                text={`${Math.floor(
                  (100 / set.count) * (set.count - set.shuffleOrder.length)
                )}%`}
                progress={Math.floor(
                  (100 / set.count) * (set.count - set.shuffleOrder.length)
                )}
              />
            </div>

            {/* TODO: detail view */}
            {/* <div>
                <Button
                  size="compact"
                  variant="cta"
                  title="Explore"
                  css="flex items-center w-auto"
                >
                  <Svg name="search" color="currentColor" size={16} />
                </Button>
              </div> */}

            <Text css="my-0 text-sm font-medium">{set.description}</Text>
          </div>
        </div>

        <Button
          variant="cta"
          size="compact"
          css={`w-auto h-full rounded-l-none border-transparent bg-transparent hover:bg-transparent hover:border-transparent ${
            completed && "cursor-default"
          }`}
        >
          <Svg name="chevronRight" color="currentColor" size={16} />
        </Button>
      </div>
    </div>
  );
}
