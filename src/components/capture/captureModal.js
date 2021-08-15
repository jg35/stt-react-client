import React, { useEffect, useState, useContext } from "react";
import { Formik } from "formik";
import { useMutation, useLazyQuery, gql } from "@apollo/client";
import useToastMessage from "~/hooks/useToastMessage";
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
import FormActions from "~/components/capture/formActions";
import { UIContext } from "~/app";
import { EventSchema, FragmentSchema } from "~/lib/yup";
import { Title } from "~/components/_styled";

export default function CaptureModal({
  editView = false,
  scrollToFragment,
  scrollToEvent,
}) {
  const { setError } = useToastMessage();
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
    updateUiState({ capture: { showModal: false, item: null } }, false);
  }

  function getSchema(type) {
    switch (type) {
      case "EVENT":
        return EventSchema;
      case "TEXT":
      case "PHOTO":
      case "CHAPTER":
      default:
        return FragmentSchema;
    }
  }

  function getSubmitHandler(type) {
    switch (type) {
      case "EVENT":
        return saveUserEventHandler;
      case "TEXT":
      case "PHOTO":
      case "CHAPTER":
      default:
        return saveFragmentHandler;
    }
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
                if (uiState.capture.revealAfterCreate) {
                  scrollToFragment(data.insert_stt_fragment_one.id);
                }
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
            "signedMediaUrl",
          ]),
          id: form.id,
        },
      }).then(() => {
        if (item.date !== form.date) {
          scrollToFragment(form.id);
        }
        closeModal();
      });
    }
  }

  function saveUserEventHandler(form) {
    if (!form.id) {
      return insertUserEvent({
        variables: {
          data: {
            title: form.title,
            date: form.date,
          },
        },
        update(cache, { data }) {
          cache.modify({
            fields: {
              stt_userEvent(userEvents = []) {
                if (uiState.capture.revealAfterCreate) {
                  scrollToEvent(data.insert_stt_userEvent_one.id);
                }
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
          data: {
            title: form.title,
            date: form.date,
          },
          id: form.id,
        },
      }).then(() => closeModal());
    }
  }

  function getModalSize(type) {
    switch (type) {
      case "TEXT":
        return "lg";
      case "PHOTO":
        return "full";
      default:
        return "md";
    }
  }

  return showModal && item ? (
    <Formik
      initialValues={getSchema(item.type).cast(item)}
      onSubmit={(values) =>
        getSubmitHandler(item.type)(values).catch((e) => {
          let label = item.type === "TEXT" ? "memory" : item.type.toLowerCase();
          setError(e, {
            ref: values.id ? "UPDATE" : "CREATE",
            params: [label],
          });
        })
      }
      validationSchema={getSchema(item.type)}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(props) => {
        return (
          <Modal
            formIsDirty={props.dirty}
            isOpen={true}
            close={closeModal}
            size={getModalSize(item.type)}
          >
            <form
              id="capture-form"
              className="h-full p-2 overflow-scroll"
              onSubmit={props.handleSubmit}
            >
              <Title size="large">{formTitle}</Title>
              {item.type === "EVENT" && <EventForm {...props} />}

              {item.type === "TEXT" && (
                <TextForm
                  {...props}
                  editContent={!editView}
                  originatesFromQuestion={originatesFromQuestion}
                  closeModal={closeModal}
                />
              )}
              {item.type === "CHAPTER" && (
                <ChapterForm {...props} editContent={!editView} />
              )}
              {item.type === "PHOTO" && (
                <PhotoForm {...props} closeForm={closeModal} />
              )}
              <FormActions
                formIsDirty={props.dirty}
                closeModal={closeModal}
                itemId={props.values.id}
                isSubmitting={props.isSubmitting}
              />
            </form>
          </Modal>
        );
      }}
    </Formik>
  ) : null;
}
