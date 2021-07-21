import { useEffect, useState, useRef, useContext } from "react";
import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";
import { UIContext } from "~/app";
import { setGoogleFontStyles } from "~/lib/uiManager";
import colors from "~/lib/colors";
import Button from "~/components/button";
import SnapElement from "~/components/publish/snapElement";
import TextElementControlList from "~/components/publish/textElementControlList";
import GlobalCoverControls from "~/components/publish/globalCoverControls";

const TEXT_ELEMENT = ({
  label,
  content = "",
  originalContent = null,
  color = "#ffffff",
  size = 5,
  font = "Libre Baskerville",
  relativePosition = { x: 0, y: 0 },
  id = uuid(),
  textAlign = "left",
}) => ({
  id,
  size,
  content,
  label,
  color,
  font,
  originalContent,
  relativePosition,
  position: { x: 0, y: 0 },
  textAlign,
  renderSize: function (parentWidth) {
    return `${(parentWidth / 100) * this.size}px`;
  },
});

export default function CoverEditor({ versionCover, updateCover }) {
  const { uiState, updateUiState } = useContext(UIContext);
  const coverContainerRef = useRef(null);
  const [cover, setCover] = useState({ ...versionCover });

  useEffect(() => {
    if (coverContainerRef.current) {
      const elements = cloneDeep(cover.elements).map((el) => TEXT_ELEMENT(el));
      const width = coverContainerRef.current.clientWidth;
      const height = coverContainerRef.current.clientHeight;
      let gFonts = [];
      elements.forEach((el) => {
        gFonts.push(el.font);
        el.position = {
          x: (width / 100) * el.relativePosition.x,
          y: (height / 100) * el.relativePosition.y,
        };
      });
      updateGoogleFonts(gFonts);
      setCover({ ...cover, elements });
    }
  }, [coverContainerRef.current]);

  function updateCoverField(field, value) {
    setCover((prev) => ({ ...prev, [field]: value }));
  }

  function updateTextElement(elId, field, value) {
    setCover((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => {
        if (el.id === elId) {
          el[field] = value;
          if (field === "font") {
            updateGoogleFonts([value]);
          }
          return el;
        }
        return el;
      }),
    }));
  }

  function addTextElement() {
    const newTextEl = TEXT_ELEMENT({
      content: "My new element",
      label: `Element ${cover.elements.length + 1}`,
    });
    newTextEl.position = { x: 0, y: 0 };

    setCover((prev) => ({
      ...cover,
      elements: prev.elements.concat(newTextEl),
    }));
    return newTextEl.id;
  }

  function removeTextElement(elId) {
    setCover((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== elId),
    }));
  }

  function updateGoogleFonts(fonts) {
    const googleFontStyles = fonts.reduce((styles, fontFamily) => {
      return setGoogleFontStyles(styles, fontFamily);
    }, uiState.googleFontStyles);

    updateUiState({ googleFontStyles }, false);
  }

  const coverContainer = {
    width: "60vh",
    height: "80vh",
    maxHeight: "1600px",
    maxWidth: "1200px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.lightGray,
    fontSize: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
  };

  function getImagePlacementSize(placement) {
    switch (placement) {
      case "rectangle":
        return {
          width: "100%",
          height: "50%",
        };
      case "oval":
        return {
          height: "50%",
          width: "50%",
          borderRadius: "50%",
          overflow: "hidden",
        };
      case "square":
        return {
          height: "40vh",
          width: "40vh",
        };
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-72 flex justify-between flex-col">
        <div>
          <GlobalCoverControls
            image={cover.image}
            imagePlacement={cover.imagePlacement}
            bgColor={cover.bgColor}
            update={updateCoverField}
          />
          <TextElementControlList
            elements={cover.elements}
            add={addTextElement}
            remove={removeTextElement}
            update={updateTextElement}
          />
        </div>
        <div className="py-2 px-4">
          <Button cta onClick={() => updateCover(cover)}>
            Save Cover
          </Button>
        </div>
      </div>

      <div
        style={{
          ...coverContainer,
          ...(cover.imagePlacement === "cover"
            ? { backgroundImage: `url('${cover.image}')` }
            : { backgroundColor: cover.bgColor }),
        }}
        className="container shadow-xl rounded-r-xl rounded-l"
        ref={coverContainerRef}
      >
        {coverContainerRef.current ? (
          <>
            {cover.imagePlacement !== "cover" && (
              <SnapElement
                size={getImagePlacementSize(cover.imagePlacement)}
                maxWidth={100}
                position={cover.imagePosition}
                parentRef={coverContainerRef}
                onChange={(val) => {
                  if (val) {
                    updateCoverField("imagePosition", val.position);
                    updateCoverField(
                      "imageRelativePosition",
                      val.relativePosition
                    );
                  }
                }}
              >
                <img src={cover.image} className="object-cover h-full w-full" />
              </SnapElement>
            )}
            {cover.elements.map((el, i) => {
              return (
                <SnapElement
                  key={el.id}
                  position={el.position}
                  elLength={cover.elements.length}
                  parentRef={coverContainerRef}
                  onChange={(val) => {
                    if (val) {
                      updateTextElement(el.id, "position", val.position);
                      updateTextElement(
                        el.id,
                        "relativePosition",
                        val.relativePosition
                      );
                    }
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: el.renderSize(
                        (coverContainerRef.current &&
                          coverContainerRef.current.clientWidth) ||
                          800
                      ),
                      fontFamily: el.font,
                      color: el.color,
                      lineHeight: 1,
                      textAlign: el.textAlign,
                    }}
                  >
                    {el.content}
                  </span>
                </SnapElement>
              );
            })}
          </>
        ) : null}
      </div>
    </div>
  );
}
