import axios from "axios";
import Select from "react-select";
import { useEffect, useState, useContext } from "react";
import { UIContext } from "~/app";
import { setGoogleFontStyles } from "~/lib/uiManager";
import colors from "~/lib/colors";

export default function GoogleFontSelect({
  value,
  onChange,
  category = "all",
}) {
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
    axios
      .get(
        `${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/googleFonts/available`
      )
      .then(({ data: fonts }) => {
        setOptions(
          fonts.reduce((fonts, font, index) => {
            font.value = font.family;
            font.label = font.family;
            font.sprite16xPosY = `-${index * 16}px`;
            font.sprite24xPosY = `-${index * 24}px`;
            if (category === "all" || category === font.category) {
              fonts.push(font);
            }
            return fonts;
          }, [])
        );
      });
  }, []);
  return (
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
                backgroundImage: `url('gFontSprite-16px.png')`,
                backgroundPositionY: selected.sprite16xPosY,
                position: "absolute",
                height: "16px",
                left: "6px",
                width: "100%",
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
        }),
        option: (styles, state) => {
          return {
            ...styles,
            height: "32px",
            maxHeight: "32px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: state.isSelected ? colors.lightGray : colors.white,
            fontSize: 0,
            ":before": {
              content: '""',
              backgroundImage: `url('gFontSprite-24px.png')`,
              backgroundPositionY: state.data.sprite24xPosY,
              position: "absolute",
              top: "6px",
              height: "24px",
              left: "6px",
              width: "100%",
            },
            ":hover": {
              backgroundColor: colors.lightestGray,
            },
          };
        },
      }}
    />
  );
}
