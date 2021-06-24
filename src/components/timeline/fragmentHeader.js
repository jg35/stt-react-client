import React from "react";
import { DateTime } from "luxon";
import colors from "../../lib/colors";
import Svg from "../svg";
import Button from "../button";
import Menu from "../menu";
import { useMutation } from "@apollo/client";
import { UPDATE_FRAGMENT, DELETE_FRAGMENT } from "../../lib/gql";
import { showEditFragmentForm } from "../../lib/apollo";

export default function FragmentActions({ fragment }) {
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [deleteFragment] = useMutation(DELETE_FRAGMENT);
  const formatDate = DateTime.fromISO(fragment.date).toFormat("ccc d MMM yyyy");

  function setVisibility(hidden) {
    updateFragment({
      variables: {
        id: fragment.id,
        data: {
          hidden,
        },
      },
    });
  }

  function deleteHandler() {
    deleteFragment({
      variables: { id: fragment.id },
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

  const sections = [
    [
      <Button
        minimal
        css="w-full justify-end items-center"
        onClick={() => showEditFragmentForm(fragment)}
      >
        Edit
        <Svg
          name="edit"
          css="ml-2"
          width="18"
          height="18"
          color={colors.gray}
        />
      </Button>,
    ],
    [
      <Button
        minimal
        css="w-full justify-end items-center"
        onClick={() => deleteHandler()}
      >
        Delete
        <Svg
          name="delete"
          css="ml-2"
          width="18"
          height="18"
          color={colors.gray}
        />
      </Button>,
    ],
  ];

  if (fragment.type !== "CHAPTER") {
    sections.unshift([
      <Button
        minimal
        css="w-full justify-end items-center"
        onClick={() => setVisibility(!fragment.hidden)}
      >
        {fragment.hidden ? "Make  public" : "Make  private"}
        <Svg
          name={fragment.hidden ? "public" : "private"}
          css="ml-2"
          width="16"
          height="16"
          color={colors.gray}
        />
      </Button>,
    ]);
  }

  return (
    <div className="pb-2 flex justify-between items-center">
      <div className="text-sm text-center text-gray font-bold flex cursor-default">
        <Svg
          css="cursor-default mr-2"
          name="calendar"
          width="18"
          height="18"
          color={colors.gray}
        />
        {`${formatDate}${fragment.dateType === "AUTO" ? " (auto)" : ""}`}
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
          compact
          toggle={
            <Svg name="overflow" color={colors.black} width="24" height="24" />
          }
          sections={sections}
        />
      </div>
    </div>
  );
}
