import React from "react";
import { Formik } from "formik";

import { EventSchema } from "~/lib/yup";
import FormError from "~/components/formError";
import FormInput from "~/components/formInput";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";

export default function EventForm({ item, submitForm, closeModal }) {
  return (
    <Formik
      initialValues={EventSchema.cast(item)}
      onSubmit={submitForm}
      validationSchema={EventSchema}
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
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <FormInput
              name="title"
              placeholder="Enter event title"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.title}
              error={errors.title}
            />
            <FormError error={errors.title} />
          </div>

          <div className="form-control">
            <label>Date</label>
            <DatePicker
              error={errors.date}
              date={values.date}
              handleChange={(newDate) => {
                setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
                setFieldValue("dateType", "MANUAL");
              }}
            />
            <FormError error={errors.date} />
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
