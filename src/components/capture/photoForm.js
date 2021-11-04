import { useState, useEffect } from "react";
import DatePicker from "~/components/dateInput";
import { InProgress, FormInput, Grid } from "~/components/_styled";
import FormField from "~/components/formField";
import { pick } from "lodash";
import Image from "~/components/image";
import Uppy from "~/components/uppy";
import imageSizes from "~/lib/imageSizes";

export default function PhotoForm({
  handleChange,
  handleBlur,
  values,
  errors,
  setFieldValue,
  isSubmitting,
}) {
  const [uppyOpen, setUppyOpen] = useState(!values.mediaUrl);
  const [uppyReady, setUppyReady] = useState(false);

  useEffect(() => {
    document.querySelector("#capture-form-wrapper").style["width"] = uppyOpen
      ? "0"
      : "";
  }, [uppyOpen]);
  return (
    <Grid colSpan={["col-span-12"]}>
      <FormField label="Photo" error={errors.mediaUrl}>
        {values.mediaUrl && (
          <div
            style={{ background: "rgba(0,0,0,.78)" }}
            className="flex flex-col justify-center items-center rounded shadow w-full relative"
            onClick={() => setUppyOpen(true)}
          >
            <div className="rounded cursor-pointer">
              <Image
                src={values.mediaUrl + imageSizes["1400px"]}
                className="object-cover rounded"
                style={{ maxHeight: "50vh" }}
              />
            </div>
            <span className="absolute bottom-0 block bg-black text-white text-center rounded-b py-2 font-medium opacity-70 w-full cursor-pointer">
              {uppyOpen && !uppyReady ? (
                <span className="flex justify-center items-center">
                  <InProgress inProgress={true} />
                  Getting master image...
                </span>
              ) : (
                "Click to edit"
              )}
            </span>
          </div>
        )}
        <Uppy
          isSubmitting={isSubmitting}
          mediaUrl={values.mediaUrl}
          open={uppyOpen}
          onClose={() => {
            setUppyOpen(false);
            setUppyReady(false);
          }}
          onReady={() => setUppyReady(true)}
          onChange={(url) => {
            setFieldValue("mediaUrl", url);
            setUppyOpen(false);
          }}
          error={errors.mediaUrl}
        />
      </FormField>

      <Grid
        colSpan={[
          "col-span-12 md:col-span-5 lg:col-span-6",
          "col-span-12 md:col-span-7 lg:col-span-6",
        ]}
      >
        <FormField label="Caption" error={errors.caption}>
          <FormInput
            name="mediaCaption"
            css="max-w-md"
            placeholder="Add a caption"
            value={values.mediaCaption}
            error={errors.mediaCaption}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        </FormField>
        <DatePicker
          smartDate={values.smartDate}
          date={values.date}
          error={errors.date}
          handleChange={(newDate) => {
            setFieldValue("date", newDate);
            setFieldValue("smartDate.isSmartDate", false);
          }}
        />
      </Grid>
    </Grid>
  );
}
