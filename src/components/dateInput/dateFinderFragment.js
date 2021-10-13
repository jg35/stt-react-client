export default function DateFinderFragment({ fragment }) {
  return (
    <div
      style={{
        maxWidth: "60%",
      }}
      className={` bg-lightGray rounded-lg py-1 px-2 mr-1.5 my-1 cursor-pointer overflow-y-scroll`}
    >
      <p className="w-full truncate">{fragment.content}</p>
    </div>
  );
}
