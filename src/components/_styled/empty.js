export default function Empty({
  title = "It's all empty here...",
  info = null,
}) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <p className="brand text-gray mb-6">{title}</p>
      {info && <p className="text-xl text-gray">{info}</p>}
    </div>
  );
}
