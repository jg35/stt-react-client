import useToastMessage from "~/hooks/useToastMessage";
import AccessListForm from "~/components/accessList/accessListForm";
import ManagePrivacyStatus from "~/components/accessList/managePrivacyStatus";
import SubmitButton from "~/components/submitButton";
import AccessListItems from "~/components/accessList/accessListItems";

import { Formik } from "formik";
import { useMutation, useQuery, gql } from "@apollo/client";
import {
  MANGE_PRIVACY_SETTINGS_VIEW,
  UPDATE_PRIVACY_SETTINGS,
  REGENERATE_PUBLIC_ACCESS_TOKEN,
} from "~/lib/gql";
import { PrivacySettingsForm, AccessTokenPrivateSchema } from "~/lib/yup";

export default function ManagePrivacy({ dbUser }) {
  const { setError, setSuccess } = useToastMessage();
  const { data, loading } = useQuery(MANGE_PRIVACY_SETTINGS_VIEW, {
    variables: { userId: dbUser.id },
  });
  const [updatePrivacySettings] = useMutation(UPDATE_PRIVACY_SETTINGS);
  const [regeneratePublicToken] = useMutation(REGENERATE_PUBLIC_ACCESS_TOKEN);

  if (loading) {
    return null;
  }

  function regeneratePublicTokenHandler(accessToken) {
    return regeneratePublicToken({
      variables: {
        id: accessToken.id,
      },
      update(cache, { data }) {
        const regenerateToken = data.stt_accessToken_regenerate.token;
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
          tokens: data.stt_accessToken,
          newToken: AccessTokenPrivateSchema.cast(),
        })}
        enableReinitialize
        onSubmit={({ privacyStatus, tokens }, formBag) => {
          return updatePrivacySettings({
            variables: {
              privacyStatus,
              newTokens: tokens.filter((t) => !t.id),
              savedTokenIds: tokens
                .filter((t) => t.id && t.type !== "PUBLIC")
                .map((t) => t.id),
              userId: dbUser.id,
            },
          }).catch((e) =>
            setError(e, { ref: "UPDATE", params: ["share list"] })
          );

          //   return updatePrivacySettings({
          //     variables: {
          //       privacyStatus,
          //       newTokens: tokens.filter((t) => !t.id),
          //       savedTokenIds: tokens.filter((t) => t.id).map((t) => t.id),
          //       userId: dbUser.id,
          //     },
          // update(cache, { data }) {
          //   cache.modify({
          //     fields: {
          //       stt_version(versions = []) {
          //         return versions.map(
          //           (v) => (v.privacyStatus = privacyStatus)
          //         );
          //       },
          //     },
          //   });
          //   formBag.resetForm({
          //     values: PrivacySettingsForm.cast({
          //       privacyStatus: privacyStatus,
          //       //   TODO token response
          //       tokens: tokens,
          //     }),
          //   });
          // },
          //   });
        }}
        validationSchema={PrivacySettingsForm}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(props) => {
          return (
            <form onSubmit={props.handleSubmit} id="manage-privacy-form">
              <ManagePrivacyStatus
                setPrivacyStatus={(status) =>
                  props.setFieldValue("privacyStatus", status)
                }
                privacyStatus={props.values.privacyStatus}
              />
              <div className="mt-6">
                <AccessListItems
                  regeneratePublicToken={regeneratePublicTokenHandler}
                  isPublic={props.values.privacyStatus === "PUBLIC"}
                  items={props.values.tokens}
                  removeAccessToken={(token) => {
                    props.setFieldValue(
                      "tokens",
                      props.values.tokens.filter((t) => t.email !== token.email)
                    );
                  }}
                />
                {props.values.privacyStatus === "PRIVATE" && (
                  <AccessListForm
                    formProps={{ ...props }}
                    addNewToken={() => {
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
                )}
              </div>
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
