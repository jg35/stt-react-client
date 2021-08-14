import { useState } from "react";
import { Button, Text, Title } from "~/components/_styled";

export default function AccessListItems({
  items,
  removeAccessToken,
  isPublic = false,
  regeneratePublicToken,
}) {
  const [isRegen, setIsRegen] = useState(false);
  const itemLength = items.filter((f) =>
    isPublic ? f.type === "PUBLIC" : f.type === "PRIVATE"
  ).length;

  return (
    <div>
      <Title size="compact" tag="h2">
        Readers
      </Title>
      <Text>
        When your book is private, readers will gain access by enterring their
        email and login token.
      </Text>
      <ul className="mb-8">
        <li className="flex justify-between py-2 font-medium items-center">
          <span className="w-36">Email</span>
          <span className="w-36">Login token</span>
          <span className="w-36"></span>
        </li>
        {items
          .filter((f) =>
            isPublic ? f.type === "PUBLIC" : f.type === "PRIVATE"
          )
          .map((item) => {
            return (
              <li
                className="flex justify-between p-2 shadow mb-4 rounded items-center bg-offWhite"
                key={item.id || item.email}
              >
                {!isPublic && (
                  <span className="w-36 truncate">{item.email}</span>
                )}

                <span className="w-36 truncate"> {item.token}</span>
                <div className="w-36 flex justify-end">
                  {!isPublic ? (
                    <Button
                      size="compact"
                      css="w-auto"
                      onClick={() => removeAccessToken(item)}
                    >
                      Remove access
                    </Button>
                  ) : (
                    <Button
                      size="compact"
                      css="w-auto"
                      onClick={() => {
                        setIsRegen(true);
                        regeneratePublicToken(item).then(() => {
                          setIsRegen(false);
                        });
                      }}
                    >
                      {isRegen ? "Regenerating link..." : "Regenerate Link"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
