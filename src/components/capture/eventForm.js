import React from "react";
import { Formik } from "formik";
import { EventSchema } from "~/lib/yup";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";

export default function EventForm({ item, submitForm, closeModal }) {
  return (
    <Formik
      initialValues={EventSchema.cast(item)}
      onSubmit={submitForm}
      validationSchema={EventSchema}
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
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            className="input mb-6"
            autoFocus
            placeholder="Enter event title"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.title}
          />

          <div className="form-control">
            <label>Date</label>
            <DatePicker
              date={values.date}
              onChange={(newDate) => {
                setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
                setFieldValue("dateType", "MANUAL");
              }}
            />
          </div>

          <FormActions
            closeModal={closeModal}
            itemId={values.id}
            isSubmitting={isSubmitting}
          />
        </form>
      )}
    </Formik>
  );
}
