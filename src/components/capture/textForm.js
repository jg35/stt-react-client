import DatePicker from "~/components/capture/datepicker";
import FormField from "~/components/formField";
import TextEditor from "~/components/capture/textEditor";
import { FormInput, Grid } from "~/components/_styled";

export default function TextForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  originatesFromQuestion,

  editContent = true,
  closeModal,
}) {
  return (
    <>
      {editContent && (
        <FormField label="Memory" error={errors.content}>
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
                const input = document.querySelector(".js-question-text-input");
                if (input) {
                  input.focus();
                }
              }
              return;
            }}
          />
        </FormField>
      )}

      <Grid colSpan={[`col-span-12 ${!editContent && "col-span-6"}`]}>
        <FormField label="Date" error={errors.date}>
          <DatePicker
            error={errors.date}
            date={values.date}
            popperPlacement="top-start"
            handleChange={(newDate) => {
              const date = newDate.toISOString().replace(/T.*/, "");
              const dateType = "MANUAL";
              setFieldValue("date", date);
              setFieldValue("dateType", dateType);
            }}
          />
        </FormField>

        <FormField label="Title" error={errors.title}>
          <FormInput
            name="title"
            placeholder="Title your memory (for reference)"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.title}
            error={errors.title}
          />
        </FormField>
      </Grid>
    </>
  );
}
