import { Button, Title, Text } from "~/components/_styled";

function PrivacyOption({ title, description, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      css={`rounded-lg mr-6 ease-in duration-400 h-48 flex-col items-center font-normal ${
        active
          ? "border-black shadow-lg bg-offWhite"
          : "border-lightGray bg-white"
      }`}
    >
      <Title tag="h2" css="text-center mt-2 mb-2">
        {title}
      </Title>
      <Text>{description}</Text>
    </Button>
  );
}

export default function ManagePrivacyStatus({
  privacyStatus,
  setPrivacyStatus,
}) {
  return (
    <>
      <Text css="font-medium">Privacy status</Text>
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
    </>
  );
}
