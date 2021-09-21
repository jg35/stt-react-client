import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { UIContext } from "~/app";
import { UPDATE_FRAGMENT, DELETE_FRAGMENT } from "~/lib/gql";
import colors from "~/lib/colors";
import { makeEditFragmentForm } from "~/lib/uiManager";
import Menu from "~/components/menu";
import Svg from "~/components/svg";
import LoadingSpinner from "~/components/loadingSpinner";
import useToastMessage from "~/hooks/useToastMessage";

export default function FragmentHeaderMenu({
  fragment,
  excludeActions = [],
  menuColor = "black",
}) {
  const { setError } = useToastMessage();
  const { updateUiState, showDeleteWarning } = useContext(UIContext);
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
    }).catch((e) => setError(e, { ref: "FRAGMENT_VISIBILITY" }));
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
    }).catch((e) => {
      let label =
        fragment.type === "TEXT" ? "memory" : fragment.type.toLowerCase();
      setError(e, { ref: "DELETE", params: [label] });
    });
  }

  const items = [];

  if (!excludeActions.includes("EDIT")) {
    items.push({
      component: (
        <span
          className="flex w-full justify-between items-center"
          id="edit-fragment-btn"
        >
          Edit
          <Svg name="edit" css="ml-2" size={18} color="darkGray" />
        </span>
      ),
      onClick: () => updateUiState(makeEditFragmentForm(fragment), false),
    });
  }

  if (!excludeActions.includes("DELETE")) {
    items.push({
      closeOnClick: false,
      component: (
        <span className="w-full flex justify-between">
          Delete
          <Svg name="delete" size={18} color="darkGray" />
        </span>
      ),
      onClick: (close) => {
        let type =
          fragment.type === "TEXT" ? "memory" : fragment.type.toLowerCase();
        showDeleteWarning({
          title: `Are you sure you want to delete this ${type}?`,
        })
          .then(() => {
            deleteHandler().then(() => {
              updateUiState({ deleteModal: { show: false } });
            });
          })
          .catch(() => {
            updateUiState({ deleteModal: { show: false } });
          })
          .finally(() => close());
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
        <div
          className={`flex min-w-full justify-between items-center`}
          id="privacy-fragment-btn"
        >
          <div>
            {!updateFragmentLoading && (
              <>{fragment.hidden ? "Make public" : "Make private"}</>
            )}
            {updateFragmentLoading && (
              <>{fragment.hidden ? "Making public..." : "Making private..."}</>
            )}
          </div>
          <div className="flex">
            <LoadingSpinner loading={updateFragmentLoading} />
            {!updateFragmentLoading && (
              <Svg
                name={fragment.hidden ? "public" : "private"}
                css="ml-2"
                size={16}
                color="darkGray"
              />
            )}
          </div>
        </div>
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
      toggle={<Svg name="overflow" color={menuColor} size={24} />}
      items={items}
    />
  );
}
