import Button from "@src/components/button";
import DatePicker from "@src/components/capture/datepicker";
import FormInput from "@src/components/formInput";
import FormError from "@src/components/formError";
import Uppy from "@src/components/uppy";

export default function PhotoForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  isSubmitting,
}) {
  return (
    <div className="flex">
      <div class="form-control">
        <Uppy
          isSubmitting={isSubmitting}
          mediaUrl={values.mediaUrl}
          onChange={(url) => setFieldValue("mediaUrl", url)}
          error={errors.mediaUrl}
        />
        <FormError error={errors.mediaUrl} />
      </div>

      <div className="flex flex-col ml-10 w-96">
        <div className="form-control w-full">
          <label>Caption</label>
          <FormInput
            autoFocus={false}
            name="mediaCaption"
            placeholder="Add a caption"
            value={values.mediaCaption}
            error={errors.mediaCaption}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        </div>
        <div className="form-control w-full">
          <label>Date</label>
          <DatePicker
            date={values.date}
            error={errors.date}
            handleChange={(newDate) => {
              setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
              setFieldValue("dateType", "MANUAL");
            }}
          />
          <FormError error={errors.date} />
        </div>
      </div>
    </div>
  );
}
