import { useState } from "react";
import themeOptions from "~/lib/theming";
import FontSelect from "~/components/fontSelect";

export default function Theming({ theme, saveTheme }) {
  const [fontSize, setFontSize] = useState(
    `chapter:${theme.chapterFontSize}|text:${theme.fontSize}`
  );
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl">Theme</h1>
      </div>
      <div className="form-control">
        <label>Font size</label>
        <select
          className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
          autoFocus
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            const [chapter, text] = e.target.value.split("|");
            saveTheme({
              fontSize: text.replace("text:", ""),
              chapterFontSize: chapter.replace("chapter:", ""),
            });
          }}
        >
          {themeOptions.fontSize.map((o, i) => (
            <option value={`chapter:${o.chapter}|text:${o.text}`} key={i}>
              {o.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label>Font family</label>
        <FontSelect
          category="SERIF"
          value={theme.fontFamily}
          onChange={(fontFamily) =>
            saveTheme({
              fontFamily,
            })
          }
        />
      </div>
      <div className="">
        <label>Line spacing</label>
        <select
          className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
          autoFocus
          value={theme.lineHeight}
          onChange={(e) =>
            saveTheme({
              lineHeight: e.target.value,
            })
          }
        >
          {themeOptions.lineHeight.map((o, i) => (
            <option value={o.value} key={i} className={o.value}>
              {o.title}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
