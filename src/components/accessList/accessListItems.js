import { useState } from "react";
import Button from "~/components/button";

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
  function getStatus() {
    if (!isPublic) {
      return (
        <span>
          {itemLength > 0 ? itemLength : "No"} reader
          {itemLength !== 1 && "s"} have access to your book
        </span>
      );
    }
    return <span>Public link</span>;
  }

  return (
    <div>
      <label className="mb-2 text-lg font-medium block">Readers</label>
      <p className="mb-4 block">
        When your book is private, readers will gain access by enterring their
        email and login token.
      </p>
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
                    <Button onClick={() => removeAccessToken(item)}>
                      Remove access
                    </Button>
                  ) : (
                    <Button
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
