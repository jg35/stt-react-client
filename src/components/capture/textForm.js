import DatePicker from "~/components/dateInput";
import FormField from "~/components/formField";
import TextEditor from "~/components/capture/textEditor";
import { Grid } from "~/components/_styled";
import { pick } from "lodash";

export default function TextForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  editContent = true,
  closeHandler,
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
            onExpand={(expand) => {
              // if (expand) {
              //   setModalSize("fullscreen");
              // } else {
              //   setModalSize(null);
              // }
            }}
            onKeyUp={(e) => {
              if (
                values.questionId &&
                e.key === "Backspace" &&
                e.target.value.length === 0
              ) {
                closeHandler();
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
        <DatePicker
          smartDate={values.smartDate}
          error={errors.date}
          date={values.date}
          handleChange={(newDate) => {
            setFieldValue("date", newDate);
            setFieldValue("smartDate.isSmartDate", false);
          }}
        />
      </Grid>
    </>
  );
}
