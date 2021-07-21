import Button from "~/components/button";
import PopoverColorPicker from "~/components/popoverColorPicker";

export default function GlobalCoverControls({
  imagePlacement,
  bgColor,
  update,
}) {
  return (
    <div className="w-full px-4">
      <h1 className="text-xl">Layout</h1>
      <div className="flex items-center my-6">
        <span className="mr-6">Background</span>
        <PopoverColorPicker
          color={bgColor}
          onChange={(val) => {
            update("bgColor", val);
          }}
        />
      </div>
      <div className="animate-fade-in my-2">
        <div className="flex items-center justify-between my-4">
          <span className="w-16">Image</span>
          <Button onClick={() => update("imagePlacement", "cover")}>
            <div className="border-2 border-black bg-gray h-8 w-6 shadow-lg">
              <div className="w-full h-full bg-white"></div>
            </div>
          </Button>
          <Button onClick={() => update("imagePlacement", "rectangle")}>
            <div className="border-2 border-black bg-gray h-8 w-6 shadow-lg">
              <div className="h-1/2 w-full bg-white"></div>
            </div>
          </Button>
          <Button onClick={() => update("imagePlacement", "oval")}>
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
          <Button onClick={() => update("imagePlacement", "square")}>
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
        </div>
      </div>
    </div>
  );
}
