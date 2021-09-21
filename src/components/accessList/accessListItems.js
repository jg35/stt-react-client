import { Button, ClickToCopy, Text, Title, Grid } from "~/components/_styled";
import Svg from "~/components/svg";
import { getHTMLTranslation } from "~/lib/util";

export default function AccessListItems({ items, removeAccessToken }) {
  return (
    <div>
      <Title size="compact" tag="h2">
        Readers
      </Title>
      <Text css="mb-6">
        {getHTMLTranslation(
          "components.accessList.accessListItems.description"
        )}
      </Text>
      {items.length > 0 && (
        <ul className="my-6">
          <li className="py-2 font-medium">
            <Grid colSpan={["col-span-5", "col-span-5", "col-span-2"]}>
              <span className="block">Email</span>
              <span className="block">Login token</span>
              <span className="block"></span>
            </Grid>
          </li>
          {items
            .filter((f) => f.type === "PRIVATE")
            .map((item) => {
              return (
                <li
                  className="p-2 shadow mb-4 rounded bg-offWhite"
                  key={item.id || item.email}
                >
                  <Grid
                    colSpan={["col-span-5", "col-span-5", "col-span-2"]}
                    css="items-center"
                  >
                    <span className="block truncate">{item.email}</span>
                    <span className="block truncate">
                      <ClickToCopy
                        value={item.token}
                        copyText={item.token}
                        css="font-normal w-auto justify-start"
                      />
                    </span>
                    <div className="flex justify-end">
                      <Button
                        size="compact"
                        css="w-auto"
                        onClick={() => removeAccessToken(item)}
                      >
                        <span className="hidden sm:block">Remove</span>
                        <Svg name="cancel" css="sm:hidden" size={16}></Svg>
                      </Button>
                    </div>
                  </Grid>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
