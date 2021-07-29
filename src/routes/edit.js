import React, { useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { sortBy, debounce } from "lodash";
import { FETCH_EDIT_VIEW, UPDATE_FRAGMENT, UPDATE_VERSION } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import CaptureModal from "~/components/capture/captureModal";
import Card from "~/components/card";

import EditPreview from "~/components/edit/editPreview";
import EditPreviewSkeleton from "~/components/edit/editPreviewSkeleton";
import EditPreviewContainer from "~/components/edit/editPreviewContainer";
import Theming from "~/components/edit/theming";
import ThemingSkeleton from "~/components/edit/themingSkeleton";
import { ThemeSchema } from "../lib/yup";

export default function Edit() {
  const { user } = useContext(AuthContext);
  const { data } = useQuery(FETCH_EDIT_VIEW, {
    variables: { userId: user.id },
  });

  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [themeValues, setThemeValues] = useState(null);
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    if (data) {
      if (data.stt_fragment.length) {
        setFragments(sortBy(data.stt_fragment, "date"));
      }
      // Don't keep refreshing from db
      if (!themeValues) {
        setThemeValues({ ...ThemeSchema.cast(), ...data.stt_version[0].theme });
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

  function saveThemeHandler(newTheme) {
    const theme = { ...themeValues, ...newTheme };
    // Local update
    setThemeValues(theme);

    saveTheme(theme);
  }

  const saveTheme = useCallback(
    debounce((theme) => {
      updateVersion({
        variables: {
          data: {
            theme,
          },
          id: data.stt_version[0].id,
        },
      });
    }, 3000),
    [data]
  );

  return (
    <Page>
      <div
        className="flex h-full w-full justify-center"
        style={{ margin: "0 auto" }}
      >
        <EditPreviewContainer>
          {themeValues ? (
            <EditPreview
              fragments={fragments}
              saveFragment={saveFragment}
              theme={themeValues}
            />
          ) : (
            <EditPreviewSkeleton />
          )}
        </EditPreviewContainer>

        <Card
          css="w-72 p-4 max-w-xs flex-shrink"
          style={{ height: "fit-content" }}
        >
          {themeValues ? (
            <Theming theme={themeValues} saveTheme={saveThemeHandler} />
          ) : (
            <ThemingSkeleton />
          )}
        </Card>
      </div>
      <CaptureModal editView />
    </Page>
  );
}
