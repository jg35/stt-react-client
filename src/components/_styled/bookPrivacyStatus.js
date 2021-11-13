import { Text } from "~/components/_styled";
import { getHTMLTranslation } from "~/lib/util";
import capitalize from "lodash/capitalize";

export default function BookPrivacyStatus({
  isPublic,
  prefix = "",
  describe = false,
}) {
  const emojo = isPublic ? "🌎" : "🔒";

  const text = capitalize(
    `${prefix ? prefix + " " : ""}${isPublic ? "public" : "private"}`
  );
  const describeText = isPublic
    ? getHTMLTranslation("components.bookPrivacyStatus.description.public")
    : getHTMLTranslation("components.bookPrivacyStatus.description.private");

  return (
    <>
      <Text css="mb-0 flex">
        <span>{emojo}&nbsp;</span>
        <span>{text}</span>
      </Text>

      {describe && <Text css="mt-2">{describeText}</Text>}
    </>
  );
}
