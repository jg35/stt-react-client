export default function Card({ children, css = "py-4 w-full" }) {
  return (
    <div className={css}>
      <div className="shadow-lg h-full min-w-full rounded-lg bg-white p-4 flex flex-col">
        {children}
      </div>
    </div>
  );
}
