import { useState } from "react";
import { Form, Formik } from "formik";
import { omit } from "lodash";
import { useMutation } from "@apollo/client";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { UserSettingsSchema } from "~/lib/yup";
import {
  ACTION_UPDATE_USER_DETAILS,
  UPDATE_USER,
  FETCH_QUESTIONS,
} from "~/lib/gql";
import { refreshToken } from "~/lib/firebase";

import DatePicker from "~/components/capture/datepicker";
import CountrySelect from "~/components/countrySelect";
import FormField from "~/components/formField";
import { Button, Title, Grid, Tag, FormLabel } from "~/components/_styled";
import Svg from "~/components/svg";

import useToastMessage from "~/hooks/useToastMessage";

export default function ManageUser({ dbUser }) {
  const [showHiddenQuestions, setShowHiddenQuestions] = useState(false);
  const [showHiddenTags, setShowHiddenTags] = useState(false);
  const { data } = useCustomQuery(FETCH_QUESTIONS, {});
  const [syncUser] = useMutation(ACTION_UPDATE_USER_DETAILS);
  const [updateUser] = useMutation(UPDATE_USER);
  const { setError } = useToastMessage();

  function updateUserHandler(values) {
    return Promise.all([
      updateUser({
        variables: {
          data: omit(values, ["dob", "location"]),
          userId: dbUser.id,
        },
      }),
      syncUser({
        variables: { data: omit(values, ["hiddenQuestions"]) },
        update: async (cache, { data }) => {
          const { updated } = data.action_update_user_details;
          if (updated) {
            await refreshToken();
            // Reset cache as session variable has changed
            cache.reset();
          }
        },
      }),
    ]);
  }
  return (
    <Formik
      initialValues={UserSettingsSchema.cast(dbUser)}
      onSubmit={(values) =>
        updateUserHandler(values).catch((e) => {
          setError(e, { ref: "UPDATE", params: ["account"] });
        })
      }
      validationSchema={UserSettingsSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        dirty,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        values,
      }) => {
        return (
          <div className="animate-fade-in">
            <Title>Update your user settings</Title>
            <form id="manage-user-settings-form" onSubmit={handleSubmit}>
              <div>
                <Grid colSpan={["col-span-12"]}>
                  <FormField label="Date of birth" error={errors.dob}>
                    <DatePicker
                      minDate={new Date().setYear(
                        new Date().getFullYear() - 100
                      )}
                      maxDate={new Date().setYear(
                        new Date().getFullYear() - 18
                      )}
                      placeholder="DD/MM/YYYY"
                      error={errors.dob}
                      date={values.dob}
                      handleChange={(newDate) => {
                        setFieldValue(
                          "dob",
                          newDate.toISOString().replace(/T.*/, "")
                        );
                      }}
                    />
                  </FormField>
                  <FormField label="Your country" error={errors.location}>
                    <CountrySelect
                      name="location"
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      value={values.location}
                      error={errors.location}
                    />
                  </FormField>
                </Grid>
              </div>
              {data?.stt_question.length && (
                <>
                  <Title size="compact" tag="h2" css="mb-6">
                    Manage questions
                  </Title>

                  <div className="mb-4">
                    <FormLabel>Hidden questions</FormLabel>
                    {values.hiddenQuestions.ids.length ? (
                      <ul className="flex flex-wrap animate-fade-in mt-2">
                        {values.hiddenQuestions.ids.map((id, key) => (
                          <li
                            className="my-1 whitespace-nowrap"
                            title="Show this question"
                            key={key}
                            onClick={() =>
                              setFieldValue(
                                "hiddenQuestions.ids",
                                values.hiddenQuestions.ids.filter(
                                  (hId) => hId !== id
                                )
                              )
                            }
                          >
                            <Tag css="font-normal text-base" interactive>
                              {data.stt_question.find((q) => q.id === id).title}
                            </Tag>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-4 mb-2">All questions visible</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <FormLabel>Hidden tags</FormLabel>
                    {values.hiddenQuestions.tags.length ? (
                      <ul className="flex flex-wrap animate-fade-in mt-2">
                        {values.hiddenQuestions.tags.map((tag, key) => (
                          <li
                            className="my-1 whitespace-nowrap"
                            title="Show this tag"
                            key={key}
                            onClick={() =>
                              setFieldValue(
                                "hiddenQuestions.tags",
                                values.hiddenQuestions.tags.filter(
                                  (hTag) => hTag !== tag
                                )
                              )
                            }
                          >
                            <Tag interactive>#{tag.replace(/\s/g, "-")}</Tag>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-4 mb-2">All tags visible</div>
                    )}
                  </div>
                </>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="cta"
                  css="md:w-36"
                  disabled={!dirty}
                  inProgress={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}
