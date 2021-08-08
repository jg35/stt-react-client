function PrivacyOption({ title, description, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full p-2 rounded-lg mr-6 border-2 ease-in duration-400 transition h-48 cursor-pointer flex flex-col items-center justify-center text-center ${
        active
          ? "border-black shadow-lg bg-offWhite"
          : "border-lightGray bg-white"
      }`}
    >
      <h2 className="text-xl text-center my-2">{title}</h2>
      <p className="p-2">{description}</p>
    </div>
  );
}

export default function ManagePrivacyStatus({
  privacyStatus,
  setPrivacyStatus,
}) {
  return (
    <div className="flex">
      <div className="w-1/2 pr-2">
        <PrivacyOption
          onClick={() => setPrivacyStatus("PUBLIC")}
          active={privacyStatus === "PUBLIC"}
          title="Public 🌎 "
          description="Your book will be viewable by anyone that has the link. You can regenerate the link in your settings."
        />
      </div>

      <div className="w-1/2 pl-2">
        <PrivacyOption
          onClick={() => setPrivacyStatus("PRIVATE")}
          active={privacyStatus === "PRIVATE"}
          title="Private 🔒"
          description="A unique link will be generated for each email you add to your share list."
        />
      </div>
    </div>
  );
}
