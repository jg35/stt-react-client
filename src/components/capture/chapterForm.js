import React from "react";
import { Formik } from "formik";
import { FragmentSchema } from "~/lib/yup";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";

export default function ChapterForm({ item, submitForm, closeModal }) {
  return (
    <Formik
      initialValues={FragmentSchema.cast(item)}
      onSubmit={submitForm}
      validationSchema={FragmentSchema}
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
            <input
              name="content"
              className="input mb-6"
              autoFocus
              placeholder="Enter chapter name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.content}
            />

            <div className="form-control">
              <label>Date</label>
              <DatePicker
                date={values.date}
                onChange={(newDate) => {
                  setFieldValue(
                    "date",
                    newDate.toISOString().replace(/T.*/, "")
                  );
                  setFieldValue("dateType", "MANUAL");
                }}
              />
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
