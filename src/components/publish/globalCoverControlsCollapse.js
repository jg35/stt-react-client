import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Title,
  FormLabel,
  Grid,
} from "~/components/_styled";
import PopoverColorPicker from "~/components/popoverColorPicker";
import CollapseControlWrapper from "~/components/publish/collapseControlWrapper";
import Uppy from "~/components/uppy";

export default function GlobalCoverControls({
  imageUrl,
  imagePlacement,
  bgColor,
  update,
  show,
}) {
  const [changeImage, setChangeImage] = useState(false);

  return (
    <>
      <CollapseControlWrapper isCollapsed={show}>
        <div className="flex-1 flex items-center justify-center border-r border-gray mx-2 px-2 min-h-full">
          <FormLabel css="mr-4 hidden sm:block">Background</FormLabel>
          <PopoverColorPicker
            color={bgColor}
            onChange={(val) => {
              update("bgColor", val);
            }}
          />
        </div>

        <div
          className="flex-1 flex justify-center items-center border-r border-gray mx-2 px-2"
          style={{
            opacity: imageUrl ? "1" : ".1",
            pointerEvents: imageUrl ? "auto" : "none",
          }}
        >
          <FormLabel css="mr-2 hidden sm:block">Image</FormLabel>
          <div className="flex">
            <Button
              variant="minimal"
              size="compact"
              onClick={() => update("imagePlacement", "cover")}
            >
              <div className="border-2 border-black h-8 w-6 shadow-lg">
                <div className="w-full h-full bg-lightGray"></div>
              </div>
            </Button>
            <Button
              variant="minimal"
              size="compact"
              onClick={() => update("imagePlacement", "rectangle")}
            >
              <div
                className="border-2 border-black h-8 w-6 shadow-lg"
                style={{ background: bgColor }}
              >
                <div className="h-1/2 w-full bg-lightGray"></div>
              </div>
            </Button>
            <Button
              variant="minimal"
              size="compact"
              onClick={() => update("imagePlacement", "oval")}
            >
              <div
                className="border-2 border-black h-8 w-6 shadow-lg relative"
                style={{ background: bgColor }}
              >
                <div
                  className="h-1/2 w-1/2 absolute bg-lightGray"
                  style={{
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
              </div>
            </Button>
            <Button
              variant="minimal"
              size="compact"
              onClick={() => update("imagePlacement", "square")}
            >
              <div
                className="border-2 border-black h-8 w-6 shadow-lg relative"
                style={{ background: bgColor }}
              >
                <div
                  className="h-3 w-3 absolute bg-lightGray"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex-1 flex justify-center mx-2 px-2">
          <Button
            variant="secondary"
            size="compact"
            css="w-auto whitespace-nowrap"
            onClick={() => setChangeImage(true)}
          >
            {!imageUrl ? "Add" : "Change"} photo
          </Button>
        </div>
      </CollapseControlWrapper>

      {changeImage && (
        <Uppy
          asModal={true}
          imageFolder="coverImages"
          mediaUrl={imageUrl}
          onClose={() => setChangeImage(false)}
          onChange={(url) => {
            update("image", url);
            setChangeImage(false);
            // wait until the image is loaded?
            // setChangeImage(false);
          }}
        />
      )}
    </>
  );
}
