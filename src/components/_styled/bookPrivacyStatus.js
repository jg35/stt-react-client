import { Text } from "~/components/_styled";

export default function BookPrivacyStatus({ isPublic, prefix = "" }) {
  const emojo = isPublic ? "🌎" : "🔒";

  const smText = isPublic ? `Public` : `Private`;
  const mdText = `${prefix} ${isPublic ? "public" : "private"}`;

  return (
    <Text css="text-offBlack font-medium text-lg mb-0 flex">
      <span>{emojo}&nbsp;</span>
      <span className="md:hidden">{smText}</span>
      <span className="hidden md:block">{mdText}</span>&nbsp;
    </Text>
  );
}
