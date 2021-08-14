import { useState } from "react";
import Card from "~/components/card";
import Button from "~/components/button";
import ButtonGroup from "~/components/buttonGroup";
import PopoverColorPicker from "~/components/popoverColorPicker";
import Uppy from "~/components/uppy";

export default function GlobalCoverControls({
  imageUrl,
  imagePlacement,
  bgColor,
  update,
}) {
  const [changeImage, setChangeImage] = useState(false);
  return (
    <div className="w-full px-4 animate-fade-in">
      <Card>
        <h1 className="text-xl pb-2 mb-4 ">Layout</h1>
        <div className="flex items-center border-b border-lightGray pb-6">
          <span className="mr-6">Background</span>
          <PopoverColorPicker
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
            <span className="w-16">Image</span>
            <ButtonGroup>
              <Button
                variant="minimal"
                size="compact"
                onClick={() => update("imagePlacement", "cover")}
              >
                <div className="border-2 border-black bg-gray h-8 w-6 shadow-lg">
                  <div className="w-full h-full bg-white"></div>
                </div>
              </Button>
              <Button
                variant="minimal"
                size="compact"
                onClick={() => update("imagePlacement", "rectangle")}
              >
                <div className="border-2 border-black bg-gray h-8 w-6 shadow-lg">
                  <div className="h-1/2 w-full bg-white"></div>
                </div>
              </Button>
              <Button
                variant="minimal"
                size="compact"
                onClick={() => update("imagePlacement", "oval")}
              >
                <div className="border-2 border-black bg-gray h-8 w-6 shadow-lg relative">
                  <div
                    className="h-1/2 w-1/2 bg-white absolute"
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
                <div className="border-2 border-black bg-gray h-8 w-6 shadow-lg relative">
                  <div
                    className="h-3 w-3 bg-white absolute"
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
            <Button variant="secondary" onClick={() => setChangeImage(true)}>
              {!imageUrl ? "Add" : "Change"} cover image
            </Button>
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
          </div>
        </div>
      </Card>
    </div>
  );
}
