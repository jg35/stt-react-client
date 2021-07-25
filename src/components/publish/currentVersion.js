import Button from "~/components/button";
import SubmitButton from "~/components/submitButton";
import EditableContent from "~/components/editableContent";
import SaveStatus from "~/components/saveStatus";
import Image from "~/components/image";

export default function CurrentVersion({
  version,
  isSaving,
  saveVersion,
  isPublishing,
  publishVersion,
  setShowCoverEditor,
}) {
  const placeholderImg =
    "bg-blue opacity-30 flex items-center justify-center text-white";

  return (
    <div className="flex relative">
      <div className="absolute right-0 top-0">
        <SaveStatus saving={isSaving} />
      </div>

      <Image src={version.coverUrl} className={`w-48 h-64`} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          publishVersion();
        }}
        className="flex-1 ml-6"
      >
        <div className="flex text-xl">
          <span className="mr-2 font-medium">Title:</span>
          <EditableContent
            fieldValue={version.title}
            placeholder="Enter a title"
            fieldTag="h1"
            css="font-normal focus:outline-none mb-2 cursor-text"
            update={(newValue) => saveVersion(newValue, "title", version.id)}
          />
        </div>
        <div className="flex text-lg">
          <span className="mr-2 font-medium">Author:</span>
          <EditableContent
            fieldValue={version.author}
            placeholder="Set the author"
            fieldTag="p"
            css="focus:outline-none mb-2 cursor-text"
            update={(newValue) => saveVersion(newValue, "title", version.id)}
          />
        </div>
        <SubmitButton
          style={{ width: "auto" }}
          isSubmitting={isPublishing}
          disabled={isSaving || !version.title || !version.author}
        >
          <span>{isPublishing ? "Publishing" : "Publish new version"}</span>
        </SubmitButton>
        <Button onClick={setShowCoverEditor}>Edit cover</Button>
      </form>
    </div>
  );
}
