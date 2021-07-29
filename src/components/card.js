export default function Card({ children, css = "p-4 min-w-full", style = {} }) {
  return (
    <div
      className={`shadow-lg rounded-lg bg-white flex flex-col ${css}`}
      style={style}
    >
      {children}
    </div>
  );
}
