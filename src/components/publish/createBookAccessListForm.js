import { Formik } from "formik";
import { useMutation, useQuery, gql } from "@apollo/client";
import {
  DELETE_ACCESS_TOKEN,
  INSERT_ACCESS_TOKEN,
  FETCH_PRIVATE_ACCESS_TOKENS,
} from "~/lib/gql";
import { AccessTokenPrivateSchema } from "~/lib/yup";
import FormInput from "~/components/formInput";
import FormError from "~/components/formError";
import Button from "~/components/button";
import VersionAccessListItems from "~/components/publish/versionAccessListItems";

export default function CreateBookAccessListForm({ userId }) {
  const { data, loading } = useQuery(FETCH_PRIVATE_ACCESS_TOKENS, {
    variables: { userId },
  });
  const [deleteVersionToken] = useMutation(DELETE_ACCESS_TOKEN);
  const [createVersionToken] = useMutation(INSERT_ACCESS_TOKEN);
  if (!data) {
    return null;
  }
  return (
    <>
      <VersionAccessListItems
        future={true}
        items={data.stt_accessToken}
        removeAccessToken={(item) => {
          deleteVersionToken({
            variables: {
              id: item.id,
            },
            update(cache) {
              const normalizedId = cache.identify({
                id: item.id,
                __typename: "stt_accessToken",
              });
              cache.evict({ id: normalizedId });
              cache.gc();
            },
          });
        }}
      />
      <h2 className="font-medium mb-2 text-lg text-gray">Add more viewers</h2>

      <Formik
        initialValues={AccessTokenPrivateSchema.cast()}
        onSubmit={(values, formBag) => {
          createVersionToken({
            variables: {
              data: values,
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
          });
        }}
        validationSchema={AccessTokenPrivateSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(tokenForm) => {
          return (
            <div className="flex">
              <div className="flex-1">
                <FormInput
                  name="email"
                  placeholder="Enter email"
                  handleChange={tokenForm.handleChange}
                  handleBlur={tokenForm.handleBlur}
                  value={tokenForm.values.email}
                />
                <FormError error={tokenForm.errors.email} />
              </div>
              <div className="ml-2">
                <Button
                  cta
                  type="button"
                  css="h-14"
                  onClick={tokenForm.handleSubmit}
                >
                  {tokenForm.isSubmitting ? "Adding viewer..." : "Add viewer"}
                </Button>
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
}
