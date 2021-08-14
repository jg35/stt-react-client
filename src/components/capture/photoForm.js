import DatePicker from "~/components/capture/datepicker";
import { FormInput, FormLabel } from "~/components/_styled";
import FormError from "~/components/formError";
import Uppy from "~/components/uppy";

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
          <FormLabel>Caption</FormLabel>
          <FormInput
            name="mediaCaption"
            placeholder="Add a caption"
            value={values.mediaCaption}
            error={errors.mediaCaption}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        </div>
        <div className="form-control w-full">
          <FormLabel>Date</FormLabel>
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
