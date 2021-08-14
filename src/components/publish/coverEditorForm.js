import { useRef, useContext, useEffect } from "react";
import { css } from "@emotion/css";
import { cloneDeep, get } from "lodash";
import colors from "~/lib/colors";
import { CoverElementSchema } from "~/lib/yup";
import { setGoogleFontStyles } from "~/lib/uiManager";
import { UIContext } from "~/app";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";
import Image from "~/components/image";
import SnapElement from "~/components/publish/snapElement";
import TextElementControlList from "~/components/publish/textElementControlList";
import GlobalCoverControls from "~/components/publish/globalCoverControls";
import { Card, Title } from "~/components/_styled";

export default function CoverEditorForm({ values, setFieldValue }) {
  const cover = values.theme.cover;
  const signedImageUrl = useGetSignedImageUrl(
    cover.image ? cover.image + "-master" : null
  );
  const { uiState, updateUiState } = useContext(UIContext);
  const coverContainerRef = useRef(null);

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
    if (coverContainerRef.current) {
      const width = coverContainerRef.current.clientWidth;
      const height = coverContainerRef.current.clientHeight;
      let gFonts = [];
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
    }
  }, [coverContainerRef.current]);

  function updateGoogleFonts(fonts) {
    const googleFontStyles = fonts.reduce((styles, fontFamily) => {
      return setGoogleFontStyles(styles, fontFamily);
    }, uiState.googleFontStyles);

    updateUiState({ googleFontStyles }, false);
  }
  const height = 65;
  const width = (height / 4) * 3;

  const coverContainer = {
    width: `${width}vh`,
    height: `${height}vh`,
    minHeight: `${height}vh`,
    minWidth: `${width}vh`,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.lightGray,
    fontSize: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
  };

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
          width: 65%;
          &:after {
            content: "";
            display: block;
            padding-bottom: 100%;
          }
        `;
    }
  }

  function getRenderFontSize(size, parentWidth) {
    return `${(parentWidth / 100) * size}px`;
  }

  return (
    <div
      className="flex flex-col flex-1 p-4 rounded-b-lg"
      style={{
        backgroundColor: "#e5e5f7",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(to right, rgba(0, 0, 0, .1) 1px, #F8F8F8 1px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "-1px -1px",
      }}
    >
      <Card css="mb-4 mx-auto">
        <Title css="text-center mx-auto mb-0">
          Here you can add photos, alter layout, drag things around and add
          other text elements to make a beautiful cover for your book!
        </Title>
      </Card>
      <div className="flex justify-between w-full">
        <div className="w-80 flex justify-between flex-col">
          <div>
            <GlobalCoverControls
              imageUrl={cover.image}
              imagePlacement={cover.imagePlacement}
              bgColor={cover.bgColor}
              update={(field, value) =>
                setFieldValue(`theme.cover.${field}`, value)
              }
            />
          </div>
        </div>

        <div
          style={{
            ...coverContainer,
            ...(cover.imagePlacement === "cover"
              ? { backgroundImage: `url('${signedImageUrl}')` }
              : { backgroundColor: cover.bgColor }),
          }}
          className="container shadow-xl rounded-r-xl rounded-l"
          ref={coverContainerRef}
        >
          {coverContainerRef.current ? (
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
                    src={cover.image + "-master"}
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
        <div className="w-80 flex justify-between flex-col">
          <TextElementControlList
            elements={cover.elements}
            add={() => {
              const relativePosition = { x: 50, y: 50 };
              const newEl = CoverElementSchema.cast({
                content: "New text",
                relativePosition,
                size: 10,
                position: getPosition(
                  coverContainerRef.current,
                  relativePosition
                ),
              });

              setFieldValue(
                "theme.cover.elements",
                cover.elements.concat(newEl)
              );
              return newEl.id;
            }}
            remove={(elId) => {
              setFieldValue(
                "theme.cover.elements",
                cover.elements.filter((e) => e.id !== elId)
              );
            }}
            update={(elId, field, value) => {
              if (field === "font") {
                updateGoogleFonts([value]);
              }
              setFieldValue(
                `theme.cover.elements[${cover.elements.findIndex(
                  (e) => e.id === elId
                )}][${field}]`,
                value
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
