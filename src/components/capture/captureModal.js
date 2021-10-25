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
  dob,
}) {
  const [closeWarning, setCloseWarning] = useState(false);
  const [overrideSize, setOverrideSize] = useState(null);
  const { setError } = useToastMessage();
  const [formTitle, setFormTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [insertFragment] = useMutation(INSERT_FRAGMENT);
  const [insertUserEvent] = useMutation(INSERT_USER_EVENT);
  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [updateUserEvent] = useMutation(UPDATE_USER_EVENT);
  const [getQuestions, { data: questionData }] = useLazyQuery(FETCH_QUESTIONS);
  const { uiState, updateUiState } = useContext(UIContext);
  const { showModal, item } = uiState.capture;

  useEffect(() => {
    if (item && item.questionId) {
      getQuestions();
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      setIsOpen(true);
    }
    if (item && item.type === "TEXT" && item.questionId && questionData) {
      const question = questionData.stt_question.find(
        (q) => q.id === item.questionId
      );
      setFormTitle(question.title);
    } else if (item) {
      let fragmentType;
      if (item.type === "TEXT") {
        fragmentType = "memory";
      } else if (item.type === "EVENT") {
        fragmentType = "life event";
      } else {
        fragmentType = lowerCase(item.type);
      }
      setFormTitle(`${item.id ? "Edit" : "New"} ${fragmentType}`);
    }
  }, [questionData, item]);

  function warnBeforeClose(isDirty) {
    if (!isDirty) {
      closeHandler();
    } else {
      setCloseWarning(true);
    }
  }

  function closeHandler() {
    setCloseWarning(false);
    const ANIMATE_CLOSE_TIME = 200;
    setIsOpen(false);
    setTimeout(() => {
      updateUiState({ capture: { showModal: false, item: null } }, false);
    }, ANIMATE_CLOSE_TIME);
  }

  function getSchema(type) {
    switch (type) {
      case "EVENT":
        return EventSchema(dob);
      case "TEXT":
      case "PHOTO":
      case "CHAPTER":
      default:
        return FragmentSchema(dob);
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
          data: omit(form, ["question"]),
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
          closeHandler();
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
            "question",
          ]),
          id: form.id,
        },
      }).then(() => {
        if (item.date !== form.date) {
          scrollToFragment(form.id);
        }
        closeHandler();
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
            smartDateReason: form.smartDateReason,
            isSmartDate: form.isSmartDate,
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
          closeHandler();
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
      }).then(() => {
        if (item.date !== form.date) {
          scrollToEvent(form.id);
        }
        closeHandler();
      });
    }
  }

  function getModalSize(type) {
    if (overrideSize) {
      return overrideSize;
    }
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
            outsideCloseWarning={closeWarning}
            cancelOutsideCloseWarning={() => setCloseWarning(false)}
            isOpen={isOpen}
            close={closeHandler}
            size={getModalSize(item.type)}
            noScroll={item.type !== "PHOTO"}
          >
            <form
              id="capture-form"
              className="h-full"
              onSubmit={props.handleSubmit}
            >
              <Title
                size="large"
                css="inline-block"
                style={{ maxWidth: "calc(100% - 4rem)" }}
              >
                {formTitle}
              </Title>
              {item.type === "EVENT" && <EventForm {...props} />}

              {item.type === "TEXT" && (
                <TextForm
                  {...props}
                  editContent={!editView}
                  closeHandler={closeHandler}
                  setModalSize={(size) => setOverrideSize(size)}
                />
              )}
              {item.type === "CHAPTER" && (
                <ChapterForm {...props} editContent={!editView} />
              )}
              {item.type === "PHOTO" && (
                <PhotoForm {...props} closeForm={closeHandler} />
              )}
              <FormActions
                isValid={props.isValid}
                formIsDirty={props.dirty}
                closeHandler={() => warnBeforeClose(props.dirty)}
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
