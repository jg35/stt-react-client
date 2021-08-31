export default function Empty({
  title = "It's all empty here...",
  info = null,
}) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full px-4 xs:px-8 text-center">
      <p className="brand text-4xl text-gray mb-6">{title}</p>
      {info && <p className="text-xl text-gray">{info}</p>}
    </div>
  );
}
