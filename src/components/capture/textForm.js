import DatePicker from "~/components/capture/datepicker";
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
  originatesFromQuestion,
  editContent = true,
  closeHandler,
  setModalSize,
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
                originatesFromQuestion &&
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
        <FormField label="Date" error={errors.date}>
          <DatePicker
            smartDate={pick(values, [
              "smartDateReason",
              "smartDateConfidence",
              "isSmartDate",
            ])}
            error={errors.date}
            date={values.date}
            popperPlacement="top-start"
            handleChange={(newDate) => {
              setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
              setFieldValue("isSmartDate", false);
            }}
          />
        </FormField>
      </Grid>
    </>
  );
}
