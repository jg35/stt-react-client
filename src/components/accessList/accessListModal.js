import { Formik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import {
  INSERT_ACCESS_TOKEN,
  DELETE_ACCESS_TOKEN,
  FETCH_PRIVATE_ACCESS_TOKENS,
} from "~/lib/gql";
import { AccessTokenPrivateSchema } from "~/lib/yup";
import useToastMessage from "~/hooks/useToastMessage";
import Modal from "~/components/modal";

import { Button, FormInput } from "~/components/_styled";
import FormField from "~/components/formField";
import AccessListItems from "~/components/accessList/accessListItems";

export default function AccessListModal({ closeModal, show }) {
  const { setError } = useToastMessage();
  const { data, loading } = useCustomQuery(FETCH_PRIVATE_ACCESS_TOKENS, {
    userId: true,
  });
  const [createAccessToken] = useMutation(INSERT_ACCESS_TOKEN);
  const [deleteAccessToken] = useMutation(DELETE_ACCESS_TOKEN);

  function deleteTokenHandler(id) {
    return deleteAccessToken({
      variables: { id },
      update(cache) {
        const normalizedId = cache.identify({
          id,
          __typename: "stt_accessToken",
        });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    }).catch((e) => setError(e, { ref: "DELETE", params: ["share token"] }));
  }

  if (loading) {
    return null;
  }

  return (
    <Formik
      initialValues={AccessTokenPrivateSchema.cast()}
      enableReinitialize
      onSubmit={(values, formBag) => {
        return createAccessToken({
          variables: {
            data: {
              email: values.email,
            },
          },
          update(cache, { data }) {
            cache.modify({
              fields: {
                stt_accessToken(tokens = []) {
                  const newToken = cache.writeFragment({
                    data: data.insert_stt_accessToken_one,
                    fragment: gql`
                      fragment token on stt_accessToken {
                        id
                      }
                    `,
                  });

                  return [...tokens, newToken];
                },
              },
            });
            formBag.resetForm({
              values: AccessTokenPrivateSchema.cast(),
            });
          },
        }).catch((e) => setError(e, { ref: "ADD_TO_SHARE_LIST" }));
      }}
      validationSchema={AccessTokenPrivateSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(props) => {
        return (
          <Modal
            formIsDirty={props.dirty}
            isOpen={show}
            close={closeModal}
            size="lg"
          >
            <div>
              <AccessListItems
                items={data.stt_accessToken}
                removeAccessToken={(item) => deleteTokenHandler(item.id)}
              />

              <form
                className="flex items-center"
                onSubmit={props.handleSubmit}
                id="access-token-form"
              >
                <FormField
                  label="Add reader"
                  error={props.errors.email}
                  css="flex-1"
                >
                  <FormInput
                    name="email"
                    placeholder="Enter email"
                    handleChange={props.handleChange}
                    handleBlur={props.handleBlur}
                    value={props.values.email}
                    error={props.errors.email}
                  />
                </FormField>
                <div className="ml-2 w-32">
                  <Button
                    type="submit"
                    variant="cta"
                    css="-mt-2"
                    disabled={!props.dirty}
                    inProgress={props.isSubmitting}
                  >
                    {!props.isSubmitting ? "Save" : "Saving..."}
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        );
      }}
    </Formik>
  );
}
