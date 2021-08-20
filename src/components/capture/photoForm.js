import { useState } from "react";
import DatePicker from "~/components/capture/datepicker";
import { FormInput, Grid } from "~/components/_styled";
import FormField from "~/components/formField";
import Image from "~/components/image";
import Uppy from "~/components/uppy";

export default function PhotoForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  isSubmitting,
}) {
  const [uppyOpen, setUppyOpen] = useState(!values.mediaUrl);
  return (
    <Grid
      colSpan={[
        "col-span-12 lg:col-span-9 2xl:col-span-12",
        "col-span-12 lg:col-span-3 2xl:col-span-12",
      ]}
    >
      <FormField label="Photo" error={errors.mediaUrl}>
        {values.mediaUrl && (
          <div
            style={{ background: "rgba(0,0,0,.78)" }}
            className="flex flex-col justify-center items-center rounded shadow w-full relative"
            onClick={() => setUppyOpen(true)}
          >
            <div className="rounded cursor-pointer">
              <Image
                src={values.mediaUrl + "-master"}
                className="object-cover rounded"
                style={{ maxHeight: "50vh" }}
              />
            </div>
            <span className="absolute bottom-0 block bg-black text-white text-center rounded-b py-2 font-medium opacity-70 w-full">
              Click to edit
            </span>
          </div>
        )}
        <Uppy
          isSubmitting={isSubmitting}
          mediaUrl={values.mediaUrl}
          open={uppyOpen}
          onClose={() => {
            setUppyOpen(false);
          }}
          onChange={(url) => {
            setFieldValue("mediaUrl", url);
            setUppyOpen(false);
          }}
          error={errors.mediaUrl}
        />
      </FormField>

      <Grid colSpan={["col-span-12"]}>
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
            popperPlacement="top-start"
            handleChange={(newDate) => {
              setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
              setFieldValue("dateType", "MANUAL");
            }}
          />
        </FormField>
      </Grid>
    </Grid>
  );
}
