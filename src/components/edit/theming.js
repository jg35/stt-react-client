export default function Theming({ theme, saveTheme }) {
  const themeOptions = {
    fontFamily: [
      { value: "theme-family-futura", title: "Futura" },
      { value: "theme-family-museo", title: "Museo Sans" },
      { value: "theme-family-baskerville", title: "Baskerville" },
      { value: "theme-family-garamond", title: "Garamond" },
    ],
    fontSize: [
      { value: "text-base", title: "Smaller" },
      { value: "text-lg", title: "Normal" },
      { value: "text-xl", title: "Bigger" },
    ],

    chapterFontSize: [
      { value: "text-2xl", title: "Smaller" },
      { value: "text-3xl", title: "Normal" },
      { value: "text-5xl", title: "Bigger" },
    ],

    margin: [
      { value: "px-16", title: "Narrow" },
      { value: "px-8", title: "Normal" },
      { value: "px-0", title: "Wide" },
    ],
    lineHeight: [
      { value: "leading-tight", title: "Tight" },
      { value: "leading-snug", title: "Snug" },
      { value: "leading-normal", title: "Normal" },
      { value: "leading-relaxed", title: "Relaxed" },
      { value: "leading-loose", title: "Loose" },
    ],
  };

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
        <select
          className={`outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none ${theme.fontFamily}`}
          autoFocus
          value={theme.fontFamily}
          onChange={(e) =>
            saveTheme({
              fontFamily: e.target.value,
            })
          }
        >
          {themeOptions.fontFamily.map((o, i) => (
            <option value={o.value} key={i}>
              {o.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label>Margin</label>
        <select
          className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
          autoFocus
          value={theme.margin}
          onChange={(e) =>
            saveTheme({
              margin: e.target.value,
            })
          }
        >
          {themeOptions.margin.map((o, i) => (
            <option value={o.value} key={i} className={o.value}>
              {o.title}
            </option>
          ))}
        </select>
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
