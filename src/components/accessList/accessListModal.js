import { Formik } from "formik";
import { useMutation, useQuery, gql } from "@apollo/client";
import {
  INSERT_ACCESS_TOKEN,
  DELETE_ACCESS_TOKEN,
  FETCH_PRIVATE_ACCESS_TOKENS,
} from "~/lib/gql";
import { AccessTokenPrivateSchema } from "~/lib/yup";
import useToastMessage from "~/hooks/useToastMessage";
import Modal from "~/components/modal";

import FormInput from "~/components/formInput";
import FormError from "~/components/formError";
import SubmitButton from "~/components/submitButton";
import AccessListItems from "~/components/accessList/accessListItems";

export default function AccessListModal({ userId, closeModal }) {
  const { setError } = useToastMessage();
  const { data, loading } = useQuery(FETCH_PRIVATE_ACCESS_TOKENS, {
    variables: { userId },
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
            isOpen={true}
            close={closeModal}
            size="md"
          >
            <div>
              <AccessListItems
                items={data.stt_accessToken}
                removeAccessToken={(item) => deleteTokenHandler(item.id)}
              />

              <h2 className="font-medium mb-2 text-lg text-gray">
                Add readers
              </h2>
              <form
                className="flex"
                onSubmit={props.handleSubmit}
                id="access-token-form"
              >
                <div className="flex-1">
                  <FormInput
                    name="email"
                    placeholder="Enter email"
                    handleChange={props.handleChange}
                    handleBlur={props.handleBlur}
                    value={props.values.email}
                    error={props.errors.email}
                  />
                  <FormError error={props.errors.email} />
                </div>
                <div className="ml-2">
                  <SubmitButton
                    disabled={!props.dirty}
                    isSubmitting={props.isSubmitting}
                    formId="access-token-form"
                  >
                    {!props.isSubmitting ? "Add" : "Adding..."}
                  </SubmitButton>
                </div>
              </form>
            </div>
          </Modal>
        );
      }}
    </Formik>
  );
}
