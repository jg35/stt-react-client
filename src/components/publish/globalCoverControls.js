import { useState } from "react";
import {
  Button,
  Card,
  Title,
  FormLabel,
  ImagePlacementOption,
} from "~/components/_styled";
import PopoverColorPicker from "~/components/popoverColorPicker";
import Uppy from "~/components/uppy";

export default function GlobalCoverControls({
  imageUrl,
  bgColor,
  update,
  setImagePlacement,
}) {
  const [uppyOpen, setUppyOpen] = useState(false);
  return (
    <div className="w-full px-4 animate-fade-in">
      <Card>
        <Title className="text-xl pb-2 mb-4 ">Layout</Title>
        <div className="flex items-center border-b border-lightGray pb-6">
          <FormLabel css="mr-6">Background</FormLabel>
          <PopoverColorPicker
            x="left-0"
            color={bgColor}
            onChange={(val) => {
              update("bgColor", val);
            }}
          />
        </div>
        <div className="my-2">
          <div
            className="flex items-center justify-between my-4 border-b border-lightGray pb-2"
            style={{
              pointerEvents: imageUrl ? "auto" : "none",
            }}
          >
            <FormLabel css="mr-6">Image</FormLabel>
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
          <div>
            <Button variant="secondary" onClick={() => setUppyOpen(true)}>
              {!imageUrl ? "Add" : "Change"} cover image
            </Button>
            <Uppy
              open={uppyOpen}
              imageFolder="coverImages"
              mediaUrl={imageUrl}
              onClose={() => setUppyOpen(false)}
              onChange={(url) => {
                update("image", url);
                setUppyOpen(false);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
