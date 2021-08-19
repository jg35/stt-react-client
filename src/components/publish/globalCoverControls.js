import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Title,
  FormLabel,
} from "~/components/_styled";
import PopoverColorPicker from "~/components/popoverColorPicker";
import Uppy from "~/components/uppy";
import { values } from "lodash";

export default function GlobalCoverControls({
  imageUrl,
  imagePlacement,
  bgColor,
  update,
}) {
  const [changeImage, setChangeImage] = useState(false);
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
              opacity: imageUrl ? "1" : ".1",
              pointerEvents: imageUrl ? "auto" : "none",
            }}
          >
            <FormLabel css="w-16">Image</FormLabel>
            <ButtonGroup>
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
            </ButtonGroup>
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
                // wait until the image is loaded?
                // setChangeImage(false);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
