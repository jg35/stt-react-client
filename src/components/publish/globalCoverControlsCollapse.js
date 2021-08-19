import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Title,
  FormLabel,
  Grid,
  ImagePlacementOption,
} from "~/components/_styled";
import Svg from "~/components/svg";
import PopoverColorPicker from "~/components/popoverColorPicker";
import CollapseControlWrapper from "~/components/publish/collapseControlWrapper";
import Uppy from "~/components/uppy";

export default function GlobalCoverControls({
  imageUrl,
  bgColor,
  update,
  show,
  setImagePlacement,
}) {
  const [changeImage, setChangeImage] = useState(false);

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
            <ImagePlacementOption
              value="cover"
              setImagePlacement={setImagePlacement}
              bgColor={bgColor}
            />
            <ImagePlacementOption
              value="rectangle"
              setImagePlacement={setImagePlacement}
              bgColor={bgColor}
            />
            <ImagePlacementOption
              value="oval"
              setImagePlacement={setImagePlacement}
              bgColor={bgColor}
            />
            <ImagePlacementOption
              value="square"
              setImagePlacement={setImagePlacement}
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
