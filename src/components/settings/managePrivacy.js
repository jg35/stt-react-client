import { useEffect, useState } from "react";
import useToastMessage from "~/hooks/useToastMessage";
import AccessListForm from "~/components/accessList/accessListForm";
import ManagePrivacyStatus from "~/components/accessList/managePrivacyStatus";
import SubmitButton from "~/components/submitButton";
import AccessListItems from "~/components/accessList/accessListItems";
import FormHandleAvailabilityInput from "~/components/formHandleAvailabilityInput";

import { Formik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import {
  SECTION_FETCH_PRIVACY_SETTINGS,
  SECTION_UPDATE_PRIVACY_SETTINGS,
  ACTION_REGENERATE_TOKEN,
} from "~/lib/gql";
import { PrivacySettingsForm, AccessTokenPrivateSchema } from "~/lib/yup";
import { omit } from "lodash";

export default function ManagePrivacy({ dbUser }) {
  const { setError, setSuccess } = useToastMessage();
  const { data, loading } = useCustomQuery(SECTION_FETCH_PRIVACY_SETTINGS, {
    userId: true,
  });
  const [updatePrivacySettings] = useMutation(SECTION_UPDATE_PRIVACY_SETTINGS);
  const [regeneratePublicToken] = useMutation(ACTION_REGENERATE_TOKEN);

  if (loading) {
    return null;
  }

  function regeneratePublicTokenHandler(accessToken) {
    return regeneratePublicToken({
      variables: {
        id: accessToken.id,
      },
      update(cache, { data }) {
        const regenerateToken = data.action_stt_regenerate_token.token;
        cache.writeFragment({
          id: cache.identify(accessToken),
          data: {
            token: regenerateToken,
          },
          fragment: gql`
            fragment token on stt_accessToken {
              token
            }
          `,
        });
        setSuccess({ ref: "UPDATE", params: ["public share link"] });
      },
    }).catch((e) => {
      setError(e, { ref: "UPDATE", params: ["public share link"] });
    });
  }

  return (
    <div>
      <p className="font-medium mb-4 text-xl mx-auto bg-white py-2 text-left w-full">
        Manage access to your book
      </p>
      <Formik
        initialValues={PrivacySettingsForm.cast({
          privacyStatus: data.stt_version[0].privacyStatus,
          publicHandle: data.stt_user[0].publicHandle,
          tokens: data.stt_accessToken,
          newToken: AccessTokenPrivateSchema.cast(),
        })}
        enableReinitialize
        onSubmit={({ privacyStatus, tokens, publicHandle }, formBag) => {
          return updatePrivacySettings({
            variables: {
              publicHandle: publicHandle || null,
              privacyStatus,
              newTokens: tokens
                .filter((t) => !t.id)
                .map((t) => omit(t, ["type"])),
              savedTokenIds: tokens
                .filter((t) => t.id && t.type !== "PUBLIC")
                .map((t) => t.id),
              userId: dbUser.id,
            },
            update: (cache, { data }) => {
              data.delete_stt_accessToken.returning.forEach((t) => {
                cache.evict({
                  id: cache.identify({
                    id: t.id,
                    __typename: "stt_accessToken",
                  }),
                });
              });
              cache.gc();
              cache.modify({
                fields: {
                  stt_accessToken(tokens = []) {
                    const newRefs = data.insert_stt_accessToken.returning.map(
                      (t) => {
                        return cache.writeFragment({
                          data: t,
                          fragment: gql`
                            fragment token on stt_accessToken {
                              id
                            }
                          `,
                        });
                      }
                    );
                    return [...tokens, ...newRefs];
                  },
                },
              });
            },
          }).catch((e) =>
            setError(e, { ref: "UPDATE", params: ["share list"] })
          );
        }}
        validationSchema={PrivacySettingsForm}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(props) => {
          return (
            <form onSubmit={props.handleSubmit} id="manage-privacy-form">
              <div className="mb-6">
                <FormHandleAvailabilityInput
                  value={props.values.publicHandle}
                  error={props.errors.publicHandle}
                  handleBlur={props.handleBlur}
                  handleChange={props.handleChange}
                  setFieldError={props.setFieldError}
                  savedHandle={data.stt_user[0].publicHandle}
                />
              </div>
              <ManagePrivacyStatus
                setPrivacyStatus={(status) =>
                  props.setFieldValue("privacyStatus", status)
                }
                privacyStatus={props.values.privacyStatus}
              />

              {props.values.privacyStatus === "PRIVATE" && (
                <div className="mt-6">
                  <AccessListItems
                    regeneratePublicToken={regeneratePublicTokenHandler}
                    savedPublicStatus={data.stt_version[0].privacyStatus}
                    isPublic={props.values.privacyStatus === "PUBLIC"}
                    items={props.values.tokens}
                    removeAccessToken={(token) => {
                      props.setFieldValue(
                        "tokens",
                        props.values.tokens.filter(
                          (t) => t.email !== token.email
                        )
                      );
                    }}
                  />

                  <AccessListForm
                    formProps={{ ...props }}
                    addNewToken={() => {
                      console.log(props.values.newToken);
                      props.setFieldValue(
                        "tokens",
                        props.values.tokens.concat({ ...props.values.newToken })
                      );
                      props.setFieldValue(
                        "newToken",
                        AccessTokenPrivateSchema.cast()
                      );
                    }}
                  />
                </div>
              )}
              <div className="flex justify-end pt-6 mt-6 border-t border-lightGray">
                <SubmitButton
                  disabled={!props.dirty}
                  isSubmitting={props.isSubmitting}
                  formId="manage-privacy-form"
                >
                  {props.isSubmitting ? "Saving..." : "Save changes"}
                </SubmitButton>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
