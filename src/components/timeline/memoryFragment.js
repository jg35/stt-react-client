import React from "react";
import colors from "../../lib/colors";
import Svg from "../svg";
import Button from "../button";
import Menu from "../menu";
import { useMutation } from "@apollo/client";
import { UPDATE_FRAGMENT, DELETE_FRAGMENT } from "../../lib/gql";

export default function MemoryFragment({ fragment }) {
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [deleteFragment] = useMutation(DELETE_FRAGMENT);

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

  const sections = [
    [
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
          color={colors.darkGray}
        />
      </Button>,
    ],
    [
      <Button minimal css="w-full justify-end items-center">
        Edit
        <Svg
          name="edit"
          css="ml-2"
          width="18"
          height="18"
          color={colors.darkGray}
        />
      </Button>,
    ],
    [
      <Button
        minimal
        css="w-full justify-end items-center"
        onClick={() => deleteFragment({ variables: { id: fragment.id } })}
      >
        Delete
        <Svg
          name="delete"
          css="ml-2"
          width="18"
          height="18"
          color={colors.darkGray}
        />
      </Button>,
    ],
  ];
  return (
    <div className="w-72 h-full flex flex-col">
      <div className="pb-2 flex justify-end items-center">
        {fragment.hidden && (
          <Svg
            css="cursor-default"
            title="Memory is private"
            name="private"
            color={colors.gray}
            width="18"
            height="18"
          />
        )}
        <Menu
          compact
          toggle={
            <Svg name="overflow" color={colors.gray} width="24" height="24" />
          }
          sections={sections}
        />
      </div>
      <div className="text-md truncate px-1">{fragment.content}</div>
    </div>
  );
}
