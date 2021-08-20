import { Text } from "~/components/_styled";

export default function BookPrivacyStatus({
  isPublic,
  prefix = "",
  describe = false,
}) {
  const emojo = isPublic ? "🌎" : "🔒";

  const smText = isPublic ? `Public` : `Private`;
  const mdText = `${prefix} ${isPublic ? "public" : "private"}`;
  const describeText = isPublic
    ? "Anyone that knows your handle will be able to read your book"
    : "Readers on your share list will be able to login and read your book";

  return (
    <>
      <Text css="font-medium text-lg mb-0 flex">
        <span>{emojo}&nbsp;</span>
        <span className="md:hidden">{smText}</span>
        <span className="hidden md:block">{mdText}</span>&nbsp;
      </Text>

      {describe && <Text css="mt-2">{describeText}</Text>}
    </>
  );
}
