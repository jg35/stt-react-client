import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";
import { FETCH_LOCAL_UI_STATE, FETCH_QUESTIONS } from "~/lib/gql";
import { lowerCase, omit } from "lodash";
import { uiStateVar } from "~/lib/apollo";
import {
  INSERT_FRAGMENT,
  INSERT_USER_EVENT,
  UPDATE_FRAGMENT,
  UPDATE_USER_EVENT,
} from "~/lib/gql";

import ChapterForm from "~/components/capture/chapterForm";
import PhotoForm from "~/components/capture/photoForm";
import TextForm from "~/components/capture/textForm";
import EventForm from "~/components/capture/eventForm";

export default function CaptureModal() {
  const [formTitle, setFormTitle] = useState("");
  const [insertFragment] = useMutation(INSERT_FRAGMENT);
  const [insertUserEvent] = useMutation(INSERT_USER_EVENT);
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [updateUserEvent] = useMutation(UPDATE_USER_EVENT);
  const [getQuestions, { data: questionData }] = useLazyQuery(FETCH_QUESTIONS);
  const { data } = useQuery(FETCH_LOCAL_UI_STATE);
  const { showModal, item, originatesFromQuestion } = data.uiState.capture;

  useEffect(() => {
    if (originatesFromQuestion) {
      getQuestions();
    }
  }, [item]);

  useEffect(() => {
    if (item && item.type === "TEXT" && originatesFromQuestion) {
      const question = questionData.stt_question.find(
        (q) => q.id === item.questionId
      );
      setFormTitle(question.title);
    } else if (item) {
      const fragmentType =
        item.type === "TEXT" ? "memory" : lowerCase(item.type);
      setFormTitle(`${item.id ? "Edit" : "New"} ${fragmentType}`);
    }
  }, [questionData, item]);

  function closeModal() {
    uiStateVar({
      ...data.uiState,
      ...{ capture: { showModal: false, item: null } },
    });
  }

  function saveFragmentHandler(form) {
    if (!form.id) {
      insertFragment({
        variables: {
          data: form,
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
          data: omit(form, [
            "__typename",
            "id",
            "userId",
            "createdAt",
            "updatedAt",
          ]),
          id: form.id,
        },
      }).then(() => closeModal());
    }
  }

  function saveUserEventHandler(form) {
    const data = {
      title: form.title,
      date: form.date,
    };
    if (!form.id) {
      insertUserEvent({
        variables: {
          data,
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
          data,
          id: form.id,
        },
      }).then(() => closeModal());
    }
  }

  if (showModal && item) {
    return (
      <div
        className="animate-fade-in absolute w-full h-full bg-lightestGray left-0 top-0 z-50 bg-opacity-90 flex justify-center items-center"
        onClick={closeModal}
        onKeyUp={(e) => {
          if (e.key === "Escape") {
            closeModal();
          }
          return true;
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`animate-fade-in m-1 shadow-lg rounded-lg bg-white p-4 flex justify-between flex-col pt-10 pl-10 pr-6 ${
            item.type === "TEXT"
              ? "h-3/6 w-4/5 max-w-5xl"
              : "h-auto w-2/5 max-w-2xl"
          }`}
        >
          <div className="flex-1 flex flex-col relative">
            <h1 className="modal-title">{formTitle}</h1>
            {item.type === "EVENT" && (
              <EventForm
                item={item}
                submitForm={saveUserEventHandler}
                closeModal={closeModal}
              />
            )}
            {item.type === "TEXT" && (
              <TextForm
                item={item}
                submitForm={saveFragmentHandler}
                closeModal={closeModal}
                originatesFromQuestion={originatesFromQuestion}
              />
            )}
            {item.type === "CHAPTER" && (
              <ChapterForm
                item={item}
                submitForm={saveFragmentHandler}
                closeModal={closeModal}
              />
            )}
            {item.type === "PHOTO" && (
              <PhotoForm
                item={item}
                submitForm={saveFragmentHandler}
                closeModal={closeModal}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
