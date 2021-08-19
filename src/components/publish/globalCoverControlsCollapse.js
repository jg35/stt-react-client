import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Title,
  FormLabel,
  Grid,
} from "~/components/_styled";
import Svg from "~/components/svg";
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

  function ImagePlacementButton({ value, update, bgColor }) {
    let shape;
    switch (value) {
      case "cover":
        shape = (
          <div className="border-2 border-black h-8 w-6 shadow-lg">
            <div className="w-full h-full bg-lightGray"></div>
          </div>
        );
        break;
      case "rectangle":
        shape = (
          <div
            className="border-2 border-black h-8 w-6 shadow-lg"
            style={{ background: bgColor }}
          >
            <div className="h-1/2 w-full bg-lightGray"></div>
          </div>
        );
        break;
      case "oval":
        shape = (
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
        );
        break;
      case "square":
        shape = (
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
        );
        break;
    }
    return (
      <Button
        size="compact"
        css="mr-1"
        variant="minimal"
        onClick={() => update("imagePlacement", value)}
      >
        {shape}
      </Button>
    );
  }

  return (
    <>
      <CollapseControlWrapper isCollapsed={!show}>
        <div className="flex-1 flex justify-center">
          <Button
            size="compact"
            css="w-auto whitespace-nowrap mr-2"
            onClick={() => setChangeImage(true)}
          >
            <span className="hidden md:block">
              {!imageUrl ? "Add" : "Change"} photo
            </span>
            <span className="md:hidden">
              <Svg name="photo" css="h-8 w-8" />
            </span>
          </Button>
        </div>

        <div
          className="flex-1 flex justify-center items-center border-l-2 border-r-2 border-lightGray px-2"
          style={{
            opacity: imageUrl ? "1" : ".1",
            pointerEvents: imageUrl ? "auto" : "none",
          }}
        >
          <FormLabel css="mx-2 hidden sm:block">Image</FormLabel>
          <div className="flex">
            <ImagePlacementButton
              value="cover"
              update={update}
              bgColor={bgColor}
            />
            <ImagePlacementButton
              value="rectangle"
              update={update}
              bgColor={bgColor}
            />
            <ImagePlacementButton
              value="oval"
              update={update}
              bgColor={bgColor}
            />
            <ImagePlacementButton
              value="square"
              update={update}
              bgColor={bgColor}
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <FormLabel css="ml-2 mr-4 hidden sm:block">Background</FormLabel>
          <PopoverColorPicker
            color={bgColor}
            onChange={(val) => {
              update("bgColor", val);
            }}
          />
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
