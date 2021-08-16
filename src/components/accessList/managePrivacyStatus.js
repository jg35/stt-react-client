import { Button, FormLabel, Title, Text } from "~/components/_styled";

function PrivacyOption({ title, description, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="privacyStatus"
      css={
        active
          ? "border-black shadow-lg"
          : "border-lightestGray hover:border-lightGray hover:bg-lightestGray"
      }
    >
      <Title tag="h2" css="mt-2 mb-2">
        {title}
      </Title>
      <Text css="text-center w-full">{description}</Text>
    </Button>
  );
}

export default function ManagePrivacyStatus({
  privacyStatus,
  setPrivacyStatus,
}) {
  return (
    <>
      <FormLabel>Privacy status</FormLabel>
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/2 sm:pr-2 mt-2">
          <PrivacyOption
            onClick={() => setPrivacyStatus("PUBLIC")}
            active={privacyStatus === "PUBLIC"}
            title="Public 🌎 "
            description="Your book is viewable by anyone that knows your handle. You can change your handle at any time."
          />
        </div>

        <div className="w-full sm:w-1/2 sm:pl-2 mt-2">
          <PrivacyOption
            onClick={() => setPrivacyStatus("PRIVATE")}
            active={privacyStatus === "PRIVATE"}
            title="Private 🔒"
            description="Readers added to your share list will login with their email and a login token."
          />
        </div>
      </div>
    </>
  );
}
