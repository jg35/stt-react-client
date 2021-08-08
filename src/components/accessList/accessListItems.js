import { useState } from "react";
import Button from "@src/components/button";

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
          {itemLength !== 1 && "s"} can view your book
        </span>
      );
    }
    return <span>Public link</span>;
  }

  return (
    <div className="p-2">
      <h1 className="font-medium text-lg mb-6">{getStatus(items.length)}</h1>
      <ul className="mb-8">
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
                {!isPublic && <span className="w-36">{item.email}</span>}

                <a
                  target="_blank"
                  href={`${process.env.REACT_APP_READER_VIEW_URL}/${item.token}`}
                  className="truncate text-blue hover:text-black"
                >
                  {isPublic
                    ? `${process.env.REACT_APP_READER_VIEW_URL}/${item.token}`
                    : "Reader access link"}
                </a>
                <div className="w-36">
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
