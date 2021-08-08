import DatePicker from "~/components/capture/datepicker";
import FormError from "~/components/formError";
import TextEditor from "~/components/capture/textEditor";
import FormInput from "~/components/formInput";

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
        <div className="form-control">
          <label>Memory</label>
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
          <FormError error={errors.content} />
        </div>
      )}

      <div className="form-control">
        <label>Title</label>
        <FormInput
          name="title"
          autoFocus={false}
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
          }}
        />
        <FormError error={errors.date} />
      </div>
    </>
  );
}
