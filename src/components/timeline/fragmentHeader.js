import React from "react";
import { DateTime } from "luxon";
import colors from "~/lib/colors";
import Svg from "~/components/svg";
import Button from "~/components/button";
import Menu from "~/components/menu";
import { useMutation } from "@apollo/client";
import { UPDATE_FRAGMENT, DELETE_FRAGMENT } from "~/lib/gql";
import { showEditFragmentForm } from "~/lib/apollo";
import LoadingSpinner from "~/components/loadingSpinner";

export default function FragmentActions({ fragment }) {
  const [updateFragment, { loading: updateFragmentLoading }] =
    useMutation(UPDATE_FRAGMENT);
  const [deleteFragment, { loading: deleteFragmentLoading }] =
    useMutation(DELETE_FRAGMENT);
  const renderDate = fragment.date
    ? DateTime.fromISO(fragment.date).toFormat("ccc d MMM yyyy")
    : null;

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

  // function getIcon() {
  //   switch (fragment.type) {
  //     case "PHOTO":
  //       return <Svg name="photo" width="16" height="16" color={colors.black} />;
  //     case "TEXT":
  //       return (
  //         <Svg name="writing" width="16" height="16" color={colors.black} />
  //       );
  //     case "CHAPTER":
  //       return (
  //         <Svg name="chapter" width="18" height="18" color={colors.black} />
  //       );
  //   }
  // }

  const items = [
    {
      component: (
        <Button minimal css="w-full justify-between items-center">
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
      onClick: () => showEditFragmentForm(fragment),
    },
    {
      closeOnClick: false,
      component: (
        <Button minimal css="w-full justify-between items-center">
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
    },
  ];

  if (fragment.type !== "CHAPTER") {
    items.unshift({
      closeOnClick: false,
      component: (
        <Button minimal css={`w-full justify-between items-center`}>
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
    <div className="pb-2 flex justify-between items-center">
      <div className="text-center text-gray text-sm font-medium flex cursor-default">
        {renderDate
          ? `${renderDate}${fragment.dateType === "AUTO" ? " (auto)" : ""}`
          : "No date"}
      </div>
      <div style={{ minWidth: "4rem" }}></div>
      <div
        className="flex items-center justify-end"
        style={{ minWidth: "4rem" }}
      >
        {fragment.hidden && (
          <div
            className="px-2 py-1 cursor-default"
            title="This memory won't be included in your book"
          >
            <Svg
              css="cursor-default"
              name="private"
              color={colors.gray}
              width="18"
              height="18"
            />
          </div>
        )}
        <Menu
          autoClose={false}
          compact
          toggle={
            <Svg name="overflow" color={colors.black} width="24" height="24" />
          }
          items={items}
        />
      </div>
    </div>
  );
}
