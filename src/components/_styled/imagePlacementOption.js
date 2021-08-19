import { Button } from "~/components/_styled";

export default function ImagePlacementOption({
  value,
  bgColor,
  setImagePlacement,
}) {
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
      onClick={() => setImagePlacement(value)}
    >
      {shape}
    </Button>
  );
}
