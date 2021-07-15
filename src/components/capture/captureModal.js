import React, { useEffect, useState, useContext } from "react";
import { useMutation, useLazyQuery, gql } from "@apollo/client";
import { FETCH_QUESTIONS } from "~/lib/gql";
import { lowerCase, omit } from "lodash";
import {
  INSERT_FRAGMENT,
  INSERT_USER_EVENT,
  UPDATE_FRAGMENT,
  UPDATE_USER_EVENT,
} from "~/lib/gql";

import Modal from "~/components/modal";
import ChapterForm from "~/components/capture/chapterForm";
import PhotoForm from "~/components/capture/photoForm";
import TextForm from "~/components/capture/textForm";
import EventForm from "~/components/capture/eventForm";
import { UIContext } from "~/app";

export default function CaptureModal({ editView = false }) {
  const [formTitle, setFormTitle] = useState("");
  const [insertFragment] = useMutation(INSERT_FRAGMENT);
  const [insertUserEvent] = useMutation(INSERT_USER_EVENT);
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [updateUserEvent] = useMutation(UPDATE_USER_EVENT);
  const [getQuestions, { data: questionData }] = useLazyQuery(FETCH_QUESTIONS);
  const { uiState, updateUiState } = useContext(UIContext);
  const { showModal, item, originatesFromQuestion } = uiState.capture;

  useEffect(() => {
    if (originatesFromQuestion) {
      getQuestions();
    }
  }, [item]);

  useEffect(() => {
    if (
      item &&
      item.type === "TEXT" &&
      originatesFromQuestion &&
      questionData
    ) {
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
    updateUiState({ capture: { showModal: false, item: null } });
  }

  function setItem(field) {
    updateUiState({
      capture: {
        ...uiState.capture,
        item: {
          ...item,
          ...field,
        },
      },
    });
  }

  function saveFragmentHandler(form) {
    // TODO - error handling
    if (!form.id) {
      return insertFragment({
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
      return updateFragment({
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
      }).then(() => {
        closeModal();
      });
    }
  }

  function saveUserEventHandler(form) {
    const data = {
      title: form.title,
      date: form.date,
    };
    if (!form.id) {
      return insertUserEvent({
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
      return updateUserEvent({
        variables: {
          data,
          id: form.id,
        },
      }).then(() => closeModal());
    }
  }

  return showModal && item ? (
    <Modal
      isOpen={true}
      close={closeModal}
      size={item && item.type === "text" ? "lg" : "md"}
    >
      <div className="flex-1 flex flex-col relative h-full">
        <h1 className="modal-title">{formTitle}</h1>
        {item.type === "EVENT" && (
          <EventForm
            setItem={setItem}
            item={item}
            submitForm={saveUserEventHandler}
            closeModal={closeModal}
          />
        )}
        {item.type === "TEXT" && (
          <TextForm
            editContent={!editView}
            setItem={setItem}
            item={item}
            submitForm={saveFragmentHandler}
            closeModal={closeModal}
            originatesFromQuestion={originatesFromQuestion}
          />
        )}
        {item.type === "CHAPTER" && (
          <ChapterForm
            editContent={!editView}
            setItem={setItem}
            item={item}
            submitForm={saveFragmentHandler}
            closeModal={closeModal}
          />
        )}
        {item.type === "PHOTO" && (
          <PhotoForm
            setItem={setItem}
            item={item}
            submitForm={saveFragmentHandler}
            closeModal={closeModal}
          />
        )}
      </div>
    </Modal>
  ) : null;
}
