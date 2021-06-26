import React, { useContext, useState } from "react";
import { Formik } from "formik";
import { FragmentSchema } from "~/lib/yup";
import { getImgIxSrc } from "~/lib/util";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";
import FormInput from "~/components/formInput";
import FormError from "~/components/formError";
import Uppy from "~/components/uppy";

function ToggleUrl({ replaceUrl, onClick }) {
  return (
    <div className="mt-2">
      <Button onClick={onClick}>{replaceUrl ? "Back" : "Replace image"}</Button>
    </div>
  );
}

export default function PhotoForm({ item, submitForm, closeModal }) {
  const user = useContext(AuthContext);
  const [replaceUrl, setReplaceUrl] = useState("");

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
        <form onSubmit={handleSubmit}>
          <div class="form-control">
            {values.mediaUrl ? (
              <>
                <div style={{ height: "250px" }}>
                  <img
                    src={`${getImgIxSrc(values.mediaUrl)}?height=250`}
                    className="h-auto rounded"
                    alt={values.mediaCaption}
                    title={values.mediaCaption}
                  />
                </div>
                <ToggleUrl
                  replaceUrl={replaceUrl}
                  onClick={() => {
                    setReplaceUrl(item.mediaUrl);
                    setFieldValue("mediaUrl", null);
                  }}
                />
              </>
            ) : (
              <>
                <Uppy
                  userId={user.id}
                  mediaUrl={values.mediaUrl}
                  onChange={(url) => setFieldValue("mediaUrl", url)}
                  error={errors.mediaUrl}
                />
                <div className="flex justify-between items-center">
                  {values.id && (
                    <ToggleUrl
                      replaceUrl={replaceUrl}
                      onClick={() => {
                        setFieldValue("mediaUrl", replaceUrl);
                        setReplaceUrl(null);
                      }}
                    />
                  )}
                  <FormError error={errors.mediaUrl} />
                </div>
              </>
            )}
          </div>

          <div className="form-control">
            <label>Caption</label>
            <FormInput
              name="mediaCaption"
              placeholder="Add a caption"
              value={values.mediaCaption}
              error={errors.mediaCaption}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label>Date</label>
            <DatePicker
              date={values.date}
              handleChange={(newDate) => {
                setFieldValue("date", newDate.toISOString().replace(/T.*/, ""));
                setFieldValue("dateType", "MANUAL");
              }}
            />
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
