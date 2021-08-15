import DatePicker from "~/components/capture/datepicker";
import { FormInput, FormLabel, Grid } from "~/components/_styled";
import FormField from "~/components/formField";
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
    <Grid colSpan={["col-span-12 md:col-span-8", "col-span-12 md:col-span-4"]}>
      <FormField label="Photo" error={errors.mediaUrl}>
        <Uppy
          isSubmitting={isSubmitting}
          mediaUrl={values.mediaUrl}
          onChange={(url) => setFieldValue("mediaUrl", url)}
          error={errors.mediaUrl}
        />
      </FormField>

      <div>
        <FormField label="Caption" error={errors.caption}>
          <FormInput
            name="mediaCaption"
            placeholder="Add a caption"
            value={values.mediaCaption}
            error={errors.mediaCaption}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        </FormField>
        <FormField label="Date" error={errors.date}>
          <DatePicker
            date={values.date}
            error={errors.date}
            handleChange={(newDate) => {
              setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
              setFieldValue("dateType", "MANUAL");
            }}
          />
        </FormField>
      </div>
    </Grid>
  );
}
