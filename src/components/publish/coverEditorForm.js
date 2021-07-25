import { useRef, useContext, useEffect } from "react";
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

export default function CoverEditorForm({ values, setFieldValue }) {
  const signedImageUrl = useGetSignedImageUrl(values.image);
  const { uiState, updateUiState } = useContext(UIContext);
  const coverContainerRef = useRef(null);

  useEffect(() => {
    if (coverContainerRef.current) {
      const width = coverContainerRef.current.clientWidth;
      const height = coverContainerRef.current.clientHeight;
      let gFonts = [];
      const elements = cloneDeep(values.elements).map((el) => {
        gFonts.push(el.font);
        el.position = {
          x: (width / 100) * el.relativePosition.x,
          y: (height / 100) * el.relativePosition.y,
        };
        return el;
      });
      setFieldValue("elements", elements);
      updateGoogleFonts(gFonts);
    }
  }, [coverContainerRef.current]);

  function updateGoogleFonts(fonts) {
    const googleFontStyles = fonts.reduce((styles, fontFamily) => {
      return setGoogleFontStyles(styles, fontFamily);
    }, uiState.googleFontStyles);

    updateUiState({ googleFontStyles }, false);
  }

  const coverContainer = {
    width: "450px",
    height: "600px",
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
    <div className="flex justify-center w-full mb-6">
      <div className="w-72 flex justify-between flex-col">
        <div>
          <GlobalCoverControls
            imageUrl={values.image}
            imagePlacement={values.imagePlacement}
            bgColor={values.bgColor}
            update={(field, value) => setFieldValue(field, value)}
          />
        </div>
      </div>

      <div
        style={{
          ...coverContainer,
          ...(values.imagePlacement === "cover"
            ? { backgroundImage: `url('${signedImageUrl}')` }
            : { backgroundColor: values.bgColor }),
        }}
        className="container shadow-xl rounded-r-xl rounded-l"
        ref={coverContainerRef}
      >
        {coverContainerRef.current ? (
          <>
            {values.imagePlacement !== "cover" && (
              <SnapElement
                css={getImageCss(values.imagePlacement)}
                maxWidth={100}
                position={values.imagePosition}
                parentRef={coverContainerRef}
                onChange={(val) => {
                  if (val) {
                    setFieldValue("imagePosition", val.position);
                    setFieldValue(
                      "imageRelativePosition",
                      val.relativePosition
                    );
                  }
                }}
              >
                <Image
                  src={values.image}
                  className="object-cover h-full w-full absolute"
                />
              </SnapElement>
            )}
            {values.elements.map((el, i) => {
              return (
                <SnapElement
                  key={el.id}
                  position={el.position}
                  parentRef={coverContainerRef}
                  onChange={(val) => {
                    const elIndex = values.elements.findIndex(
                      (e) => e.id === el.id
                    );
                    setFieldValue(
                      `elements[${elIndex}].position`,
                      val.position
                    );

                    setFieldValue(
                      `elements[${elIndex}].relativePosition`,
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
      <div className="w-72 flex justify-between flex-col">
        <TextElementControlList
          elements={values.elements}
          add={() => {
            const newEl = CoverElementSchema.cast({
              label: `Custom element ${values.elements.length + 1}`,
            });
            setFieldValue("elements", values.elements.concat(newEl));
            return newEl.id;
          }}
          remove={(elId) => {
            setFieldValue(
              "elements",
              values.elements.filter((e) => e.id !== elId)
            );
          }}
          update={(elId, field, value) => {
            if (field === "font") {
              updateGoogleFonts([value]);
            }
            setFieldValue(
              `elements[${values.elements.findIndex(
                (e) => e.id === elId
              )}][${field}]`,
              value
            );
          }}
        />
      </div>
    </div>
  );
}
