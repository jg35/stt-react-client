import React from "react";
import { Formik } from "formik";
import { FragmentSchema } from "~/lib/yup";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";
import FormError from "~/components/formError";
import FormInput from "~/components/formInput";

export default function ChapterForm({ item, submitForm, closeModal }) {
  return (
    <Formik
      initialValues={FragmentSchema.cast(item)}
      onSubmit={submitForm}
      validationSchema={FragmentSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        status,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <FormInput
                name="content"
                placeholder="Enter chapter name"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.content}
                error={errors.content}
              />
              <FormError error={errors.content} />
            </div>

            <div className="form-control">
              <label>Date</label>
              <DatePicker
                date={values.date}
                error={errors.date}
                handleChange={(newDate) => {
                  setFieldValue(
                    "date",
                    newDate.toISOString().replace(/T.*/, "")
                  );
                  setFieldValue("dateType", "MANUAL");
                }}
              />
              <FormError error={errors.date} />
            </div>

            <FormActions
              isSubmitting={isSubmitting}
              closeModal={closeModal}
              itemId={values.id}
            />
          </form>
        );
      }}
    </Formik>
  );
}
