import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { UIContext } from "~/app";
import { UPDATE_FRAGMENT, DELETE_FRAGMENT } from "~/lib/gql";
import colors from "~/lib/colors";
import { makeEditFragmentForm } from "~/lib/uiManager";
import Menu from "~/components/menu";
import Button from "~/components/button";
import Svg from "~/components/svg";
import LoadingSpinner from "~/components/loadingSpinner";

export default function FragmentHeaderMenu({
  fragment,
  excludeActions = [],
  menuColor = colors.black,
}) {
  const { updateUiState } = useContext(UIContext);
  const [updateFragment, { loading: updateFragmentLoading }] =
    useMutation(UPDATE_FRAGMENT);
  const [deleteFragment, { loading: deleteFragmentLoading }] =
    useMutation(DELETE_FRAGMENT);

  function setVisibility(hidden) {
    return updateFragment({
      variables: {
        id: fragment.id,
        data: {
          hidden,
        },
      },
    });
  }

  function deleteHandler() {
    return deleteFragment({
      variables: {
        id: fragment.id,
      },
      update(cache) {
        const normalizedId = cache.identify({
          id: fragment.id,
          __typename: "stt_fragment",
        });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    });
  }

  const items = [];

  if (!excludeActions.includes("EDIT")) {
    items.push({
      component: (
        <Button
          minimal
          css="w-full justify-between items-center"
          id="edit-fragment-btn"
        >
          Edit
          <Svg
            name="edit"
            css="ml-2"
            width="18"
            height="18"
            color={colors.darkGray}
          />
        </Button>
      ),
      onClick: () => updateUiState(makeEditFragmentForm(fragment)),
    });
  }

  if (!excludeActions.includes("DELETE")) {
    items.push({
      closeOnClick: false,
      component: (
        <Button
          minimal
          css="w-full justify-between items-center"
          id="delete-fragment-btn"
        >
          {!deleteFragmentLoading && <span>Delete</span>}
          {deleteFragmentLoading && (
            <span className="animate-pulse">Deleting...</span>
          )}
          {!deleteFragmentLoading && (
            <Svg
              name="delete"
              css="ml-2"
              width="18"
              height="18"
              color={colors.darkGray}
            />
          )}
          <LoadingSpinner loading={deleteFragmentLoading} />
        </Button>
      ),
      onClick: (close) => {
        deleteHandler().then(() => close());
      },
    });
  }

  if (
    fragment.type !== "CHAPTER" &&
    !excludeActions.includes("CHANGE_VISIBILITY")
  ) {
    items.unshift({
      closeOnClick: false,
      component: (
        <Button
          minimal
          css={`w-full justify-between items-center`}
          id="privacy-fragment-btn"
        >
          <div>
            {!updateFragmentLoading && (
              <span className="">
                {fragment.hidden ? "Make public" : "Make private"}
              </span>
            )}
            {updateFragmentLoading && (
              <span className="animate-pulse">
                {fragment.hidden ? "Making public..." : "Making private..."}
              </span>
            )}
          </div>
          <div className="flex">
            <LoadingSpinner loading={updateFragmentLoading} />
            {!updateFragmentLoading && (
              <Svg
                name={fragment.hidden ? "public" : "private"}
                css="ml-2"
                width="16"
                height="16"
                color={colors.darkGray}
              />
            )}
          </div>
        </Button>
      ),
      onClick: (close) => {
        setVisibility(!fragment.hidden).then(() => close());
      },
    });
  }

  return (
    <Menu
      autoClose={false}
      compact
      toggle={<Svg name="overflow" color={menuColor} width="24" height="24" />}
      items={items}
    />
  );
}
