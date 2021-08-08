import { useState } from "react";
import { debounce } from "lodash";
import SubmitButton from "@src/components/submitButton";
import EditableContent from "@src/components/editableContent";
import SaveStatus from "@src/components/saveStatus";
import Image from "@src/components/image";
import { coverImages } from "@src/lib/imageSizes";

export default function CurrentVersion({
  version,
  isSaving,
  saveVersion,
  isPublishing,
  publishVersion,
  setShowCoverEditor,
}) {
  const [imageHovering, setImageHovering] = useState(false);
  const placeholderImg =
    "bg-blue opacity-30 flex items-center justify-center text-white";

  return (
    <>
      <div className="flex relative">
        <div className="absolute right-0 top-0">
          <SaveStatus saving={isSaving} />
        </div>
        <div className="relative">
          <Image
            onMouseEnter={() => setImageHovering(true)}
            className="rounded-lg shadow-lg cursor-pointer"
            src={version.coverUrl + coverImages["600px"]}
            style={{ minWidth: "300px", width: "300px" }}
          />
          {imageHovering && (
            <div
              onMouseLeave={debounce(() => setImageHovering(false), 200)}
              onClick={setShowCoverEditor}
              style={{ backgroundColor: "rgba(0, 0, 0, .3)" }}
              className="animate-fade-in w-full h-full absolute top-0 left-0 cursor-pointer flex items-center justify-center rounded-lg"
            >
              <span className="text-xl bg-white rounded-lg shadow p-4">
                Edit cover
              </span>
            </div>
          )}
        </div>

        <div className="ml-6 flex flex-col justify-between w-full min-h-full">
          <div>
            <h2 className="text-lg mb-2">Metadata</h2>
            <div className="text-lg mb-4">
              <label>Title</label>
              <div className="bg-lightGray rounded p-2">
                <EditableContent
                  fieldValue={version.title}
                  placeholder="Enter a title"
                  fieldTag="h1"
                  css="font-normal focus:outline-none cursor-text"
                  update={(newValue) =>
                    saveVersion(newValue, "title", version.id)
                  }
                />
              </div>
            </div>
            <div className="text-lg mb-4">
              <label>Author</label>
              <div className="bg-lightGray rounded p-2">
                <EditableContent
                  fieldValue={version.author}
                  placeholder="Set the author"
                  fieldTag="p"
                  css="focus:outline-none cursor-text"
                  update={(newValue) =>
                    saveVersion(newValue, "title", version.id)
                  }
                />
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              publishVersion();
            }}
            className="py-2"
          >
            <SubmitButton
              style={{ width: "auto" }}
              isSubmitting={isPublishing}
              disabled={isSaving || !version.title || !version.author}
            >
              <span>{isPublishing ? "Publishing" : "Publish new version"}</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </>
  );
}
