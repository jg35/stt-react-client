import React, { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { sortBy } from "lodash";
import { FETCH_EDIT_VIEW, UPDATE_FRAGMENT, UPDATE_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";
import FragmentList from "~/components/timeline/fragmentList";
import { ThemeSchema } from "~/lib/yup";

import EditPreview from "~/components/edit/editPreview";
import EditPreviewSkeleton from "~/components/edit/editPreviewSkeleton";

export default function Edit() {
  const { user } = useContext(AuthContext);
  const { data } = useQuery(FETCH_EDIT_VIEW, {
    variables: { userId: user.id },
  });
  const [themeValues, setThemeValues] = useState(ThemeSchema.cast());
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    if (data) {
      if (data.stt_version[0]) {
        setThemeValues({ ...ThemeSchema.cast(), ...data.stt_version[0].theme });
      }
      if (data.stt_fragment.length) {
        setFragments(sortBy(data.stt_fragment, "date"));
      }
    }
  }, [data]);

  function saveFragment(newContent, fragmentId) {
    return updateFragment({
      variables: {
        data: {
          content: newContent,
        },
        id: fragmentId,
      },
    });
  }

  const themeOptions = {
    chapters: {
      fontFamily: [],
      fontSize: [
        { value: "sm", title: "Smaller" },
        { value: "md", title: "Normal" },
        { value: "lg", title: "Bigger" },
      ],
    },
    text: {
      fontSize: [
        { value: "sm", title: "Smaller" },
        { value: "md", title: "Normal" },
        { value: "lg", title: "Bigger" },
      ],
    },
  };

  const setTheme = (newValues) => {
    const theme = { ...themeValues, ...newValues };
    // Local update
    setThemeValues(theme);
    // // DB update
    updateVersion({
      variables: {
        data: {
          theme,
        },
        id: data.stt_version[0].id,
      },
    });
  };

  return (
    <Page>
      <div
        className="flex h-full w-full justify-between"
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        <Card css="w-4/12 pr-4 pb-4">
          <h1 className="mb-6 text-xl">Timeline items</h1>
          <div className="overflow-scroll pr-4">
            <FragmentList fragments={fragments} editView />
          </div>
        </Card>

        {data ? (
          <EditPreview
            fragments={fragments}
            saveFragment={saveFragment}
            theme={themeValues}
          />
        ) : (
          <EditPreviewSkeleton />
        )}
        <Card css="w-3/12 pb-4 max-w-xs">
          <h1 className="mb-6 text-xl">Theme</h1>

          <h2 className="mb-4 text-lg text-gray">Chapters</h2>
          <div className="form-control">
            <label>Font size</label>
            <select
              className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
              autoFocus
              value={themeValues.chapters.fontSize}
              onChange={(e) =>
                setTheme({ chapters: { fontSize: e.target.value } })
              }
            >
              {themeOptions.chapters.fontSize.map((o, i) => (
                <option value={o.value} key={i}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>

          <h2 className="mb-4 text-lg text-gray">Text</h2>
          <div className="form-control">
            <label>Font size</label>
            <select
              className="outline-none bg-lightestGray mt-1 p-2 rounded w-full appearance-none"
              autoFocus
              value={themeValues.text.fontSize}
              onChange={(e) => setTheme({ text: { fontSize: e.target.value } })}
            >
              {themeOptions.text.fontSize.map((o, i) => (
                <option value={o.value} key={i}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>
    </Page>
  );
}
