import React from "react";
import { Formik } from "formik";
import { FragmentSchema } from "~/lib/yup";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";
import TextEditor from "~/components/capture/textEditor";

export default function TextForm({
  item,
  submitForm,
  closeModal,
  originatesFromQuestion,
}) {
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
      }) => (
        <form onSubmit={handleSubmit}>
          <TextEditor
            onChange={(e) => setFieldValue("content", e.target.value)}
            value={values.content}
            onKeyUp={(e) => {
              if (
                originatesFromQuestion &&
                e.key === "Backspace" &&
                e.target.value.length === 0
              ) {
                closeModal();
                const input = document.querySelector(".js-question-text-input");
                if (input) {
                  input.focus();
                }
              }
              return;
            }}
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
