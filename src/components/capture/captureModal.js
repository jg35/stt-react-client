import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { FETCH_LOCAL_UI_STATE } from "../../lib/gql";
import { omit } from "lodash";
import Button from "../button";
import Svg from "../svg";
import { uiStateVar } from "../../lib/apollo";
import {
  INSERT_FRAGMENT,
  INSERT_USER_EVENT,
  UPDATE_FRAGMENT,
  UPDATE_USER_EVENT,
} from "../../lib/gql";

import TextForm from "./textForm";
import ChapterForm from "./chapterForm";
import EventForm from "./eventForm";

export default function CaptureModal() {
  const { data } = useQuery(FETCH_LOCAL_UI_STATE);
  const [insertFragment] = useMutation(INSERT_FRAGMENT);
  const [insertUserEvent] = useMutation(INSERT_USER_EVENT);
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [updateUserEvent] = useMutation(UPDATE_USER_EVENT);
  const { showModal, item, fullScreen } = data.uiState.capture;
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (item) {
      setEditItem(item);
    }
  }, [item]);

  function setFullScreen() {
    uiStateVar({
      ...data.uiState,
      ...{ capture: { showModal, item: editItem, fullScreen: !fullScreen } },
    });
  }

  function closeModal() {
    uiStateVar({
      ...data.uiState,
      ...{ capture: { showModal: false, item: null, fullScreen } },
    });
  }

  function save() {
    editItem.userId = "DdU0u5ivF2bH4eqEsHTtNgUGCki1";
    switch (editItem.type) {
      case "TEXT":
      case "CHAPTER":
      case "PHOTO":
        if (!editItem.id) {
          insertFragment({
            variables: {
              data: editItem,
            },
            update(cache, { data }) {
              cache.modify({
                fields: {
                  stt_fragment(fragments = []) {
                    const newFragmentRef = cache.writeFragment({
                      data: data.insert_stt_fragment_one,
                      fragment: gql`
                        fragment fragment on stt_fragment {
                          id
                        }
                      `,
                    });
                    return [...fragments, newFragmentRef];
                  },
                },
              });
              closeModal();
            },
          });
        } else {
          updateFragment({
            variables: {
              data: omit(editItem, ["__typename", "createdAt"]),
              id: editItem.id,
            },
          }).then(() => closeModal());
        }
        break;
      case "EVENT":
        if (!editItem.id) {
          insertUserEvent({
            variables: {
              data: omit(editItem, ["type"]),
            },
            update(cache, { data }) {
              cache.modify({
                fields: {
                  stt_userEvent(userEvents = []) {
                    const newUserEventRef = cache.writeFragment({
                      data: data.insert_stt_userEvent_one,
                      fragment: gql`
                        fragment event on stt_userEvent {
                          id
                        }
                      `,
                    });
                    return [...userEvents, newUserEventRef];
                  },
                },
              });
              closeModal();
            },
          });
        } else {
          updateUserEvent({
            variables: {
              data: {
                title: editItem.title,
                date: editItem.date,
              },
              id: editItem.id,
            },
          }).then(() => closeModal());
        }
        break;
      default:
        break;
    }
  }

  if (showModal && editItem) {
    return (
      <div
        className="animate-fade-in absolute w-full h-full bg-lightestGray left-0 top-0 z-50 bg-opacity-90 flex justify-center items-center"
        onClick={closeModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`animate-fade-in m-1 shadow-lg rounded-lg bg-white p-4 flex justify-between flex-col pt-10 pl-10 pr-6 ${
            editItem.type === "TEXT"
              ? "h-3/6 w-4/5 max-w-5xl"
              : "h-auto w-2/5 max-w-2xl"
          }`}
        >
          <div className="flex-1">
            {item.type === "TEXT" && (
              <TextForm item={editItem} setItem={setEditItem} />
            )}
            {item.type === "EVENT" && (
              <EventForm item={editItem} setItem={setEditItem} />
            )}
            {item.type === "CHAPTER" && (
              <ChapterForm item={editItem} setItem={setEditItem} />
            )}
          </div>

          {/* <div className="flex justify-end py-2">
            <Button onClick={setFullScreen}>
              <Svg name={fullScreen ? "compress" : "fullscreen"} />
            </Button>
          </div> */}
          <div className="flex justify-end pt-6 mt-6 border-t border-lightGray">
            <Button
              minimal
              css="text-lg mr-2 w-32 py-2 duration-300"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              css="text-lg w-32 py-2 duration-300 ease-in"
              onClick={save}
              cta
            >
              {item.id ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
