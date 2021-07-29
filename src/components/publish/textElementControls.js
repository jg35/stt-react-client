import { useState, useEffect } from "react";
import Button from "~/components/button";
import Svg from "~/components/svg";
import PopoverColorPicker from "~/components/popoverColorPicker";
import FontSelect from "~/components/fontSelect";
import FormInput from "~/components/formInput";

export default function TextElementControls({
  update,
  element,
  remove,
  expandedId,
  expand,
}) {
  const [isExpanded, setIsExpanded] = useState(expandedId === element.id);
  useEffect(() => {
    setIsExpanded(expandedId === element.id);
  }, [expandedId]);
  return (
    <div
      className={`animate-fade-in mb-4 w-full rounded-t shadow relative ${
        !isExpanded && "rounded-b"
      }`}
    >
      <div
        className="flex justify-between cursor-pointer py-2 px-4 items-center bg-lightestGray "
        onClick={() => expand(isExpanded ? null : element.id)}
      >
        <h2 className="text-lg font-normal">{element.content}</h2>
        <div className="flex">
          {!element.originalContent && (
            <Button onClick={() => remove(element.id)}>Remove</Button>
          )}
          <Svg css="ml-2" width={12} height={12} name="chevron" />
        </div>
      </div>

      {isExpanded && (
        <div className="animate-fade-in px-4 pb-4 absolute top-11 left-0 bg-white z-40 shadow rounded-b">
          <div className="flex items-center justify-between my-4">
            <span className="w-16">Text</span>
            <FormInput
              placeholder="Enter content"
              compact
              autoFocus={false}
              value={element.content}
              handleChange={(e) =>
                update(element.id, "content", e.target.value)
              }
            />
          </div>

          <div className="flex justify-between items-center my-6">
            <label className="w-16">Font</label>
            <FontSelect
              value={element.font}
              onChange={(font) => update(element.id, "font", font)}
            />
          </div>
          <div className="flex justify-between items-center my-6">
            <label className="w-16">Size</label>
            <input
              className="flex-1"
              value={element.size}
              type="range"
              step={0.1}
              min={1}
              max={20}
              onChange={(e) =>
                update(element.id, "size", parseInt(e.target.value))
              }
            />
          </div>
          <div className="flex items-center my-6">
            <span className="w-16">Color</span>
            <PopoverColorPicker
              color={element.color}
              onChange={(val) => {
                update(element.id, "color", val);
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-6 mb-4">
            <span className="w-16">Align</span>
            <div className="flex flex-1 justify-between">
              <Button
                minimal
                css={element.textAlign === "left" ? "font-medium" : "font-base"}
                onClick={() => update(element.id, "textAlign", "left")}
              >
                <Svg name="alignLeft" width={16} height={16} />
              </Button>
              <Button
                minimal
                css={
                  element.textAlign === "center" ? "font-medium" : "font-base"
                }
                onClick={() => update(element.id, "textAlign", "center")}
              >
                <Svg name="alignCenter" width={16} height={16} />
              </Button>
              <Button
                minimal
                css={
                  element.textAlign === "right" ? "font-medium" : "font-base"
                }
                onClick={() => update(element.id, "textAlign", "right")}
              >
                <Svg name="alignRight" width={16} height={16} />
              </Button>
            </div>
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
