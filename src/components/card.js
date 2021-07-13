export default function Card({ children }) {
  return (
    <div className="py-4">
      <div className="shadow-lg min-h-full min-w-full rounded-lg bg-white p-4">
        {children}
      </div>
    </div>
  );
}
