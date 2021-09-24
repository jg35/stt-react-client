import useToastMessage from "~/hooks/useToastMessage";
import ManagePrivacyStatus from "~/components/accessList/managePrivacyStatus";
import { Button, Title, FormLabel, Skeleton } from "~/components/_styled";
import AccessListStatusButton from "~/components/accessList/accessListStatusButton";
import FormHandleAvailabilityInput from "~/components/formHandleAvailabilityInput";

import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import {
  SECTION_FETCH_PRIVACY_SETTINGS,
  SECTION_UPDATE_PRIVACY_SETTINGS,
  ACTION_CHECK_HANDLE_AVAILABILITY,
} from "~/lib/gql";
import { PrivacySettingsForm } from "~/lib/yup";

export default function ManagePrivacy({
  dbUser,
  showShareList = true,
  onSubmitSuccess = null,
}) {
  const { setError } = useToastMessage();
  const { data, loading } = useCustomQuery(SECTION_FETCH_PRIVACY_SETTINGS, {
    userId: true,
  });
  const [updatePrivacySettings] = useMutation(SECTION_UPDATE_PRIVACY_SETTINGS);
  const [checkHandleAvailability] = useMutation(
    ACTION_CHECK_HANDLE_AVAILABILITY
  );

  if (loading || !data) {
    return (
      <div className="overflow-hidden">
        <Skeleton height="h-12" spacing="my-2" wrapSpacing="my-0" repeat={10} />
      </div>
    );
  }

  return (
    <div>
      <Title>Manage access to your book</Title>
      <Formik
        initialValues={PrivacySettingsForm.cast({
          privacyStatus: data.stt_version[0].privacyStatus,
          publicHandle: data.stt_user[0].publicHandle,
        })}
        enableReinitialize
        onSubmit={({ privacyStatus, tokens, publicHandle }, formBag) => {
          return updatePrivacySettings({
            variables: {
              publicHandle: publicHandle || null,
              privacyStatus,
              userId: dbUser.id,
            },
          })
            .then(() => {
              if (onSubmitSuccess) {
                onSubmitSuccess();
              }
            })
            .catch((e) =>
              setError(e, { ref: "UPDATE", params: ["share list"] })
            );
        }}
        validate={async (values) => {
          const errors = {};
          const { publicHandle, privacyStatus } = values;
          if (!privacyStatus) {
            errors.privacyStatus = "The privacy status is required";
          }
          if (!publicHandle.length) {
            errors.publicHandle = "The handle is required";
          } else if (publicHandle.length < 6) {
            errors.publicHandle = "Your handle must be at least 6 characters";
          } else if (!publicHandle.match(/^[a-z0-9]+$/i)) {
            errors.publicHandle =
              "The handle can only consist of letters and numbers and cannot contain any spaces";
          } else {
            const { data } = await checkHandleAvailability({
              variables: { handle: publicHandle },
            });
            const { available, message } = data.action_stt_handle_availability;
            if (!available) {
              errors.publicHandle =
                message || `${publicHandle} is not an available handle`;
            }
          }
          return errors;
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(props) => {
          return (
            <form onSubmit={props.handleSubmit} id="manage-privacy-form">
              <div className="mb-3">
                <FormHandleAvailabilityInput
                  value={props.values.publicHandle}
                  error={props.errors.publicHandle}
                  setFieldValue={props.setFieldValue}
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

              {showShareList && (
                <div className="mt-6">
                  <FormLabel>Manage your readers</FormLabel>

                  <div className="mt-4">
                    <AccessListStatusButton size="default" />
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 ">
                <Button
                  type="submit"
                  variant="cta"
                  css="md:w-36"
                  disabled={!props.dirty}
                  inProgress={props.isSubmitting}
                >
                  {props.isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
