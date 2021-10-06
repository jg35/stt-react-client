import { Text } from "~/components/_styled";

export default function AuthCardSeperator({
  children: content,
  margin = "my-8",
}) {
  return (
    <div className={`border-t border-lightGray ${margin} relative`}>
      <Text
        style={{
          transform: "translate(-50%, -50%)",
        }}
        css="text-center text-gray absolute bg-white inline-block left-1/2 top-1/2 px-6"
      >
        {content}
      </Text>
    </div>
  );
}
