import React from "react";
import { Formik } from "formik";
import { FragmentSchema } from "~/lib/yup";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";
import FormError from "~/components/formError";
import TextEditor from "~/components/capture/textEditor";
import FormInput from "~/components/formInput";

export default function TextForm({
  item,
  setItem,
  submitForm,
  closeModal,
  originatesFromQuestion,
  editContent = true,
}) {
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
      }) => (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {editContent && (
            <div className="form-control h-full">
              <TextEditor
                name="content"
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={values.content}
                error={errors.content}
                onKeyUp={(e) => {
                  if (
                    originatesFromQuestion &&
                    e.key === "Backspace" &&
                    e.target.value.length === 0
                  ) {
                    closeModal();
                    const input = document.querySelector(
                      ".js-question-text-input"
                    );
                    if (input) {
                      input.focus();
                    }
                  }
                  return;
                }}
              />
              <FormError error={errors.content} />
            </div>
          )}

          <div className="form-control">
            <label>Title</label>
            <FormInput
              name="title"
              placeholder="Title your memory (for reference)"
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
                const date = newDate.toISOString().replace(/T.*/, "");
                const dateType = "MANUAL";
                setFieldValue("date", date);
                setFieldValue("dateType", dateType);
                setItem({ date });
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
