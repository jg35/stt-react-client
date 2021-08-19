import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  FormInput,
  FormInputRange,
  FormLabel,
  Title,
} from "~/components/_styled";
import Svg from "~/components/svg";
import PopoverColorPicker from "~/components/popoverColorPicker";
import FontSelect from "~/components/fontSelect";

export default function TextElementControls({
  update,
  element,
  remove,
  expandedId,
  expand,
  isSticky = false,
}) {
  const [isExpanded, setIsExpanded] = useState(expandedId === element.id);
  useEffect(() => {
    setIsExpanded(expandedId === element.id);
  }, [expandedId]);
  return (
    <div
      className={`animate-fade-in rounded-t shadow relative ${
        !isExpanded && "rounded-b"
      } ${!isSticky && "mb-4"}`}
    >
      <div
        className={`flex justify-between cursor-pointer py-2 px-4 items-center bg-lightestGray`}
        onClick={() => expand(isExpanded ? null : element.id)}
      >
        <Title tag="h2" size="compact" css="font-normal truncate mb-0">
          {element.content}
        </Title>

        <div className="flex">
          {!element.originalContent && (
            <Button size="compact" onClick={() => remove(element.id)}>
              <Svg name="cancel" width={16} height={16} />
            </Button>
          )}
          <Svg css="ml-2" width={12} height={12} name="chevron" />
        </div>
      </div>

      {isExpanded && (
        <div className="animate-fade-in px-4 pb-4 absolute top-10 left-0 bg-white z-40 shadow rounded-b w-full">
          <div className="flex items-center justify-between my-4">
            <FormLabel css="w-16 text-black">Text</FormLabel>
            <FormInput
              placeholder="Enter content"
              size="compact"
              value={element.content}
              handleChange={(e) =>
                update(element.id, "content", e.target.value)
              }
            />
          </div>

          <div className="flex justify-between items-center my-6">
            <FormLabel css="w-16 text-black">Font</FormLabel>
            <FontSelect
              value={element.font}
              onChange={(font) => update(element.id, "font", font)}
            />
          </div>
          <div className="flex justify-between items-center my-6">
            <FormLabel css="w-16 text-black">Size</FormLabel>
            <FormInputRange
              step={0.1}
              min={1}
              max={20}
              handleChange={(e) =>
                update(element.id, "size", parseInt(e.target.value))
              }
              value={element.size}
            />
          </div>
          <div className="flex items-center my-6">
            <FormLabel css="w-16 text-black">Color</FormLabel>
            <PopoverColorPicker
              x="left-0"
              color={element.color}
              onChange={(val) => {
                update(element.id, "color", val);
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-6 mb-4">
            <FormLabel css="w-16 text-black">Align</FormLabel>
            <ButtonGroup>
              <Button
                variant="minimal"
                css={element.textAlign === "left" && "border-black"}
                onClick={() => update(element.id, "textAlign", "left")}
              >
                <Svg name="alignLeft" width={16} height={16} />
              </Button>
              <Button
                variant="minimal"
                css={element.textAlign === "center" && "border-black"}
                onClick={() => update(element.id, "textAlign", "center")}
              >
                <Svg name="alignCenter" width={16} height={16} />
              </Button>
              <Button
                variant="minimal"
                css={element.textAlign === "right" && "border-black"}
                onClick={() => update(element.id, "textAlign", "right")}
              >
                <Svg name="alignRight" width={16} height={16} />
              </Button>
            </ButtonGroup>
          </div>

          {element.originalContent &&
            element.content !== element.originalContent && (
              <Button
                onClick={() =>
                  update(element.id, "content", element.originalContent)
                }
              >
                Reset text content
              </Button>
            )}
        </div>
      )}
    </div>
  );
}
