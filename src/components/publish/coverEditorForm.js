import { useRef, useContext, useEffect, useState } from "react";
import { css } from "@emotion/css";
import { cloneDeep } from "lodash";
import colors from "~/lib/colors";
import { CoverElementSchema } from "~/lib/yup";
import { setGoogleFontStyles } from "~/lib/uiManager";
import { UIContext } from "~/app";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";
import Image from "~/components/image";
import SnapElement from "~/components/publish/snapElement";
import TextElementControlList from "~/components/publish/textElementControlList";
import GlobalCoverControls from "~/components/publish/globalCoverControls";
import GlobalCoverControlsCollapse from "~/components/publish/globalCoverControlsCollapse";
import TextElementControlListCollapse from "~/components/publish/textElementControlListCollapse";
import { Button, Grid } from "~/components/_styled";
import imageSizes from "~/lib/imageSizes";

export default function CoverEditorForm({ values, setFieldValue, setValues }) {
  const [showLayoutControls, setShowLayoutControls] = useState(false);
  const [showTextControls, setShowTextControls] = useState(false);
  const [coverContainerStyle, setCoverContainerStyle] = useState({});
  const [renderDragEls, setRenderDragEls] = useState(false);

  function getCoverContainerStyle(height, width) {
    let sizeStyle = {};

    if (width && height) {
      const xAsBasis = width < height;
      // Cover should render as 4:3
      const ratioWidth = xAsBasis ? width : (height / 4) * 3;
      const ratioHeight = xAsBasis ? (width / 3) * 4 : height;
      sizeStyle = {
        width: `${ratioWidth}px`,
        height: `${ratioHeight}px`,
        minHeight: `${ratioHeight}px`,
        minWidth: `${ratioWidth}px`,
      };
    } else {
      sizeStyle = {
        height: "100%",
        width: "100%",
      };
    }

    return {
      ...sizeStyle,
      position: "relative",
      overflow: "hidden",
      backgroundColor: colors.lightGray,
      fontSize: "100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
    };
  }

  useEffect(() => {
    if (
      coverContainerStyle.height &&
      coverContainerStyle.height.includes("px")
    ) {
      setRenderDragEls(true);
    }
  }, [coverContainerStyle]);

  const cover = values.theme.cover;
  const signedImageUrl = useGetSignedImageUrl(
    cover.image ? cover.image + imageSizes["2000px"] : null
  );
  const { uiState, updateUiState } = useContext(UIContext);
  const coverContainerRef = useRef(null);
  const editContainer = useRef(null);

  function getPosition(coverContainer, relativePosition) {
    if (!coverContainer || !relativePosition) {
      return { x: 0, y: 0 };
    }
    const width = coverContainer.clientWidth;
    const height = coverContainer.clientHeight;
    return {
      x: (width / 100) * relativePosition.x,
      y: (height / 100) * relativePosition.y,
    };
  }

  useEffect(() => {
    document.querySelector("body").style.overflow = "hidden";
    return () => {
      document.querySelector("body").style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (coverContainerRef.current) {
      setCoverContainerStyle(
        getCoverContainerStyle(
          coverContainerRef.current.parentElement.clientHeight,
          coverContainerRef.current.parentElement.clientWidth
        )
      );

      let gFonts = [];

      setFieldValue(
        "theme.cover.imagePosition",
        getImagePositionFromRelative(cover.imageRelativePosition)
      );

      const elements = cloneDeep(cover.elements).map((el) => {
        gFonts.push(el.font);
        el.position = getPosition(
          coverContainerRef.current,
          el.relativePosition
        );
        return el;
      });
      setFieldValue("theme.cover.elements", elements);
      updateGoogleFonts(gFonts);

      const windowListener = () => {
        setCoverContainerStyle(
          getCoverContainerStyle(
            coverContainerRef.current.parentElement.clientHeight,
            coverContainerRef.current.parentElement.clientWidth
          )
        );
      };
      window.addEventListener("resize", windowListener);
      return () => {
        window.removeEventListener("resize", windowListener);
      };
    }
  }, [coverContainerRef.current]);

  function getImagePositionFromRelative(relativePosition) {
    return getPosition(coverContainerRef.current, relativePosition);
  }

  function updateGoogleFonts(fonts) {
    const googleFontStyles = fonts.reduce((styles, fontFamily) => {
      return setGoogleFontStyles(styles, fontFamily);
    }, uiState.googleFontStyles);

    updateUiState({ googleFontStyles }, false);
  }

  function getImageCss(placement) {
    switch (placement) {
      case "rectangle":
        return css`
          width: 100%;
          height: 50%;
        `;
      case "oval":
        return css`
          height: 50%;
          width: 50%;
          border-radius: 50%;
          overflow: hidden;
        `;
      case "square":
        return css`
          width: 60%;
          &:after {
            content: "";
            display: block;
            padding-bottom: 100%;
          }
        `;
    }
  }

  function getImageRelativePosition(
    placement,
    previousPlacement,
    previousRelPosition
  ) {
    switch (placement) {
      case "cover":
        return { x: 0, y: 0 };
      case "oval":
        if (
          previousPlacement === "cover" ||
          previousPlacement === "rectangle"
        ) {
          return { x: 25, y: 25 };
        }
        return { x: 25, y: previousRelPosition.y };
      case "square":
        if (
          previousPlacement === "cover" ||
          previousPlacement === "rectangle"
        ) {
          return { x: 25, y: 25 };
        }
        return { x: 20, y: previousRelPosition.y };
      case "rectangle":
        return { x: 0, y: 50 };
      default:
        return { x: 0, y: 0 };
    }
  }

  function setImagePlacement(placement) {
    const imageRelativePosition = getImageRelativePosition(
      placement,
      values.theme.cover.imagePlacement,
      values.theme.cover.imageRelativePosition
    );
    const imagePosition = getImagePositionFromRelative(imageRelativePosition);
    setFieldValue("theme.cover.imagePosition", imagePosition);
    setFieldValue("theme.cover.imageRelativePosition", imageRelativePosition);
    setFieldValue("theme.cover.imagePlacement", placement);
  }

  function getRenderFontSize(size, parentWidth) {
    return `${(parentWidth / 100) * size}px`;
  }

  const gridBackground = {
    backgroundColor: "#e5e5f7",
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(to right, rgba(0, 0, 0, .1) 1px, #F8F8F8 1px)",
    backgroundSize: "24px 24px",
    backgroundPosition: "-1px -1px",
  };

  function addTextElement() {
    const relativePosition = { x: 50, y: 50 };
    const newEl = CoverElementSchema.cast({
      content: "New text",
      relativePosition,
      size: 10,
      position: getPosition(coverContainerRef.current, relativePosition),
    });

    setFieldValue("theme.cover.elements", cover.elements.concat(newEl));
    return newEl.id;
  }

  function removeTextElement(elId) {
    setFieldValue(
      "theme.cover.elements",
      cover.elements.filter((e) => e.id !== elId)
    );
  }

  function updateTextElement(elId, field, value) {
    if (field === "font") {
      updateGoogleFonts([value]);
    }
    setFieldValue(
      `theme.cover.elements[${cover.elements.findIndex(
        (e) => e.id === elId
      )}][${field}]`,
      value
    );
  }

  return (
    <div
      className="rounded-b-lg flex-1 overflow-hidden"
      style={gridBackground}
      ref={editContainer}
    >
      <div className="xl:hidden relative">
        <div className="bg-white p-2 fixed bottom-8 left-8 flex rounded shadow z-40">
          <Button
            css="font-medium whitespace-nowrap mr-2"
            size="compact"
            onClick={() => {
              setShowLayoutControls(!showLayoutControls);
              if (showTextControls) {
                setShowTextControls(false);
              }
            }}
          >
            Edit layout
          </Button>
          <Button
            css="font-medium whitespace-nowrap mr-2"
            size="compact"
            onClick={() => {
              setShowTextControls(!showTextControls);
              if (showLayoutControls) {
                setShowLayoutControls(false);
              }
            }}
          >
            Edit text
          </Button>
          <Button
            css="font-medium whitespace-nowrap mr-2"
            size="compact"
            onClick={addTextElement}
          >
            Add text
          </Button>
        </div>
        <GlobalCoverControlsCollapse
          setImagePlacement={setImagePlacement}
          show={showLayoutControls}
          imageUrl={cover.image}
          imagePlacement={cover.imagePlacement}
          bgColor={cover.bgColor}
          update={(field, value) =>
            setFieldValue(`theme.cover.${field}`, value)
          }
        />

        <TextElementControlListCollapse
          show={showTextControls}
          elements={cover.elements}
          add={addTextElement}
          remove={removeTextElement}
          update={updateTextElement}
        />
      </div>

      {/* <Card css="m-2 mx-auto">
        <Title css="text-center mx-auto mb-0">
          Here you can add photos, alter layout, drag things around and add
          other text elements to make a beautiful cover for your book!
        </Title>
      </Card> */}

      <Grid
        css="py-6 md:py-10 min-h-full"
        colSpan={[
          "col-span-0 xl:col-span-3",
          "col-span-10 col-start-2 xl:col-start:4 xl:col-span-6",
          "col-span-0 xl:col-span-3",
        ]}
        autoRows="auto-rows-fr"
      >
        <div className="hidden xl:block">
          <GlobalCoverControls
            setImagePlacement={setImagePlacement}
            imageUrl={cover.image}
            imagePlacement={cover.imagePlacement}
            bgColor={cover.bgColor}
            update={(field, value) =>
              setFieldValue(`theme.cover.${field}`, value)
            }
          />
        </div>

        <div
          style={{
            ...coverContainerStyle,
            backgroundColor: cover.bgColor,
            ...(cover.imagePlacement === "cover"
              ? {
                  backgroundImage: `url('${signedImageUrl}')`,
                }
              : {}),
          }}
          className="container shadow-xl rounded-r-xl rounded-l mx-auto"
          ref={coverContainerRef}
        >
          {renderDragEls ? (
            <>
              {cover.imagePlacement !== "cover" && (
                <SnapElement
                  css={getImageCss(cover.imagePlacement)}
                  maxWidth={100}
                  position={cover.imagePosition}
                  parentRef={coverContainerRef}
                  onChange={(val) => {
                    if (val) {
                      setFieldValue("theme.cover.imagePosition", val.position);
                      setFieldValue(
                        "theme.cover.imageRelativePosition",
                        val.relativePosition
                      );
                    }
                  }}
                >
                  <Image
                    src={cover.image + imageSizes["2000px"]}
                    className="object-cover h-full w-full absolute"
                  />
                </SnapElement>
              )}
              {cover.elements.map((el, i) => {
                return (
                  <SnapElement
                    key={el.id}
                    position={el.position}
                    parentRef={coverContainerRef}
                    onChange={(val) => {
                      const elIndex = cover.elements.findIndex(
                        (e) => e.id === el.id
                      );
                      setFieldValue(
                        `theme.cover.elements[${elIndex}].position`,
                        val.position
                      );

                      setFieldValue(
                        `theme.cover.elements[${elIndex}].relativePosition`,
                        val.relativePosition
                      );
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: getRenderFontSize(
                          el.size,
                          (coverContainerRef.current &&
                            coverContainerRef.current.clientWidth) ||
                            800
                        ),
                        fontFamily: el.font,
                        color: el.color,
                        lineHeight: 1.4,
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

        <div className="hidden xl:block">
          <TextElementControlList
            elements={cover.elements}
            add={addTextElement}
            remove={removeTextElement}
            update={updateTextElement}
          />
        </div>
      </Grid>
    </div>
  );
}
