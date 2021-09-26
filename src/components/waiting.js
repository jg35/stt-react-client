export default function Waiting({ size = "12", color, css = "" }) {
  return (
    <div
      className={`waiting ${css}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundColor: color,
        // margin: `${size * 2.5}px auto`,
      }}
    ></div>
  );
}
