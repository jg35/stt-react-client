import themeOptions from "~/lib/theming";
import FontSelect from "~/components/fontSelect";

export default function Theming({ theme, saveTheme }) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl">Theme</h1>
      </div>
      <div className="form-control">
        <label>Body text size</label>
        <select
          className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
          autoFocus
          value={theme.fontSize}
          onChange={(e) => saveTheme({ fontSize: e.target.value })}
        >
          {themeOptions.fontSize.map((o, i) => (
            <option value={o.value} key={i}>
              {o.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label>Chapter font size</label>
        <select
          className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
          autoFocus
          value={theme.chapterFontSize}
          onChange={(e) => saveTheme({ chapterFontSize: e.target.value })}
        >
          {themeOptions.chapterFontSize.map((o, i) => (
            <option value={o.value} key={i}>
              {o.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label>Font family</label>
        <FontSelect
          category="serif"
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
