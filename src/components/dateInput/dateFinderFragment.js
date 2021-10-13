export default function DateFinderFragment({ fragment }) {
  return (
    <div
      className={`w-2/3 bg-lightGray rounded-lg py-1 px-2 mr-1.5 my-1 cursor-pointer overflow-y-scroll`}
    >
      <p className="w-full truncate">{fragment.content}</p>
    </div>
  );
}
