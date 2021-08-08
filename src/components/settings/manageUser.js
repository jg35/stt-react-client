import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { UserSettingsSchema } from "@src/lib/yup";
import { UPDATE_USER } from "@src/lib/gql";

import DatePicker from "@src/components/capture/datepicker";
import CountrySelect from "@src/components/countrySelect";
import FormError from "@src/components/formError";
import SubmitButton from "@src/components/submitButton";

import useToastMessage from "@src/hooks/useToastMessage";

export default function UserSettings({ dbUser }) {
  const [updateUser] = useMutation(UPDATE_USER);
  const { setError } = useToastMessage();

  function updateUserHandler(values) {
    return updateUser({
      variables: { userId: dbUser.id, data: values },
      update(cache, { data }) {
        // cache.modify({
        //   fields: {
        //     stt_user(user = {}) {
        //       return { ...user, ...data.update_stt_user_by_pk };
        //     },
        //     stt_user_by_pk(user = {}) {
        //       return { ...user, ...data.update_stt_user_by_pk };
        //     },
        //   },
        // });
      },
    });
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
            <p className="font-medium mb-4 text-xl mx-auto bg-white py-2 text-left w-full">
              Update your user settings
            </p>
            <form id="manage-user-settings-form" onSubmit={handleSubmit}>
              <div className="form-control">
                <label>Date of birth</label>
                <DatePicker
                  minDate={new Date().setYear(new Date().getFullYear() - 100)}
                  maxDate={new Date().setYear(new Date().getFullYear() - 18)}
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
              </div>
              <div className="form-control my-6">
                <label>Your country</label>
                <CountrySelect
                  name="location"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.location}
                  error={errors.location}
                />
                <FormError error={errors.location} />
              </div>
              <div className="flex justify-end">
                <SubmitButton
                  formId="manage-user-settings-form"
                  disabled={!dirty}
                  isSubmitting={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </SubmitButton>
              </div>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}
