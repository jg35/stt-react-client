import { useState } from "react";
import { Formik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import {
  ACTION_GENERATE_TOKEN,
  DELETE_ACCESS_TOKEN,
  FETCH_PRIVATE_ACCESS_TOKENS,
} from "~/lib/gql";
import { AccessTokenPrivateSchema } from "~/lib/yup";
import useToastMessage from "~/hooks/useToastMessage";
import Modal from "~/components/modal";

import { Button, FormInput, Grid } from "~/components/_styled";
import FormField from "~/components/formField";
import AccessListItems from "~/components/accessList/accessListItems";

export default function AccessListModal({ closeModal, show }) {
  const { setError } = useToastMessage();
  const [isOpen, setIsOpen] = useState(show);
  const { data, loading } = useCustomQuery(FETCH_PRIVATE_ACCESS_TOKENS, {
    userId: true,
  });
  const [createAccessToken] = useMutation(ACTION_GENERATE_TOKEN);
  const [deleteAccessToken] = useMutation(DELETE_ACCESS_TOKEN);

  function closeHandler() {
    const ANIMATE_CLOSE_TIME = 200;
    setIsOpen(false);
    setTimeout(() => {
      closeModal();
    }, ANIMATE_CLOSE_TIME);
  }

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
            email: values.email,
          },
          update(cache, { data }) {
            cache.modify({
              fields: {
                stt_accessToken(tokens = []) {
                  const newToken = cache.writeFragment({
                    data: {
                      ...data.action_stt_generate_token,
                      __typename: "stt_accessToken",
                    },
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
            isOpen={isOpen}
            close={closeHandler}
            size="lg"
          >
            <div>
              <AccessListItems
                items={data.stt_accessToken}
                removeAccessToken={(item) => deleteTokenHandler(item.id)}
              />

              <form onSubmit={props.handleSubmit} id="access-token-form">
                <Grid
                  colSpan={[
                    "col-span-12 md:col-span-9 lg:col-span-10",
                    "col-span-12 md:col-span-3 lg:col-span-2",
                  ]}
                  css="items-center"
                >
                  <FormField
                    label="Add reader email"
                    error={props.errors.email}
                    css="lg:w-full"
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

                  <Button
                    type="submit"
                    variant="cta"
                    css="-mt-1"
                    disabled={!props.dirty}
                    inProgress={props.isSubmitting}
                  >
                    {!props.isSubmitting ? "Save" : "Saving..."}
                  </Button>
                </Grid>
              </form>
            </div>
          </Modal>
        );
      }}
    </Formik>
  );
}
