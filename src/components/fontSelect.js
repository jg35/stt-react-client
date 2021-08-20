import axios from "axios";
import Select from "react-select";
import { useEffect, useState, useContext } from "react";
import { UIContext } from "~/app";
import { setGoogleFontStyles } from "~/lib/uiManager";
import { useGetSignedImageUrl } from "~/hooks/useSignedUrl";
import colors from "~/lib/colors";

export default function GoogleFontSelect({
  value,
  onChange,
  category = "display",
}) {
  const availableFontsUrl = useGetSignedImageUrl(
    "resources/fonts/available.json"
  );
  const fontSpriteUrl = useGetSignedImageUrl("resources/fonts/sprite50Px.png");
  const { uiState, updateUiState } = useContext(UIContext);
  const [options, setOptions] = useState([]);
  function selectFont(font) {
    updateGoogleFonts(font.family);
    onChange(font.family);
  }

  function updateGoogleFonts(fontFamily) {
    const googleFontStyles = setGoogleFontStyles(
      uiState.googleFontStyles,
      fontFamily
    );

    updateUiState({ googleFontStyles }, false);
  }

  useEffect(() => {
    // TODO cache this call in a hasura action
    if (availableFontsUrl && !options.length) {
      axios.get(availableFontsUrl).then(({ data }) => {
        const fontOptions = data.fonts.reduce((fonts, font, index) => {
          font.value = font.family;
          font.label = font.family;
          if (category === "all" || category === font.category) {
            const lastFont = fonts[fonts.length - 1];
            // Don't bother with variations of the same font
            if (
              !lastFont ||
              !lastFont.family.includes(font.value.slice(0, 5))
            ) {
              fonts.push(font);
            }
          }
          return fonts;
        }, []);
        setOptions(fontOptions);
      });
    }
  }, [availableFontsUrl]);
  return (
    options.length > 0 &&
    fontSpriteUrl && (
      <Select
        isSearchable={false}
        value={options.find((o) => o.family === value)}
        autoFocus
        options={options}
        onChange={(font) => {
          selectFont(font);
          return font;
        }}
        styles={{
          container: (styles) => ({
            ...styles,
            width: "100%",
          }),
          indicatorSeparator: () => {
            return {
              display: "none",
            };
          },
          control: (styles, state) => {
            let controlStyles = {
              cursor: "pointer",
              backgroundColor: colors.lightestGray,
              borderWidth: "2px",
              borderColor: colors.lightestGray,
              boxShadow: "none",
              ":hover": {
                borderColor: colors.lightestGray,
              },
            };
            if (state.isFocused) {
              controlStyles.borderColor = colors.lightestGray;
            }
            return { ...styles, ...controlStyles };
          },
          valueContainer: (styles, state) => {
            if (state.hasValue && !state.isFocused) {
              const selected = state.getValue()[0];
              return {
                ...styles,
                position: "relative",
                height: "100%",
                ":before": {
                  content: '""',
                  backgroundImage: `url(${fontSpriteUrl})`,
                  backgroundPositionY: `-${selected.sprite50PxY}px`,
                  position: "absolute",
                  height: "50px",
                  left: "6px",
                  width: "400px",
                  transform: "scale(.5) translateX(-50%)",
                },
              };
            }
            return styles;
          },
          singleValue: (styles, state) => ({
            ...styles,
            color: state.hasValue ? "transparent" : colors.black,
          }),
          menu: (styles) => ({
            ...styles,
            overflow: "hidden",
            borderWidth: "1px",
            boxShadow: "rgb(0 0 0 / 10%) 0px 0px 6px 2px",
            borderColor: colors.lightGray,
            maxHeight: "200px",
          }),
          option: (styles, state) => {
            return {
              ...styles,
              padding: "0",
              height: "25px",
              minHeight: "25px",
              position: "relative",
              overflow: "hidden",
              backgroundColor: state.isSelected
                ? colors.lightGray
                : colors.white,
              fontSize: 0,
              ":before": {
                content: '""',
                backgroundImage: `url(${fontSpriteUrl})`,
                backgroundPositionY: `-${state.data.sprite50PxY}px`,
                position: "absolute",
                transform: "scale(.5) translateX(-50%) translateY(-50%)",
                height: "50px",
                width: "400px",
                left: "6px",
              },
              ":hover": {
                backgroundColor: colors.lightestGray,
              },
            };
          },
        }}
      />
    )
  );
}
