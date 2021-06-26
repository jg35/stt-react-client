import React, { useContext, useState } from "react";
import { Formik } from "formik";
import { FragmentSchema } from "~/lib/yup";
import { getImgIxSrc } from "~/lib/util";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import DatePicker from "~/components/capture/datepicker";
import FormActions from "~/components/capture/formActions";
import Uppy from "~/components/uppy";

export default function PhotoForm({ item, submitForm, closeModal }) {
  const user = useContext(AuthContext);
  const [replaceUrl, setReplaceUrl] = useState("");

  return (
    <Formik
      initialValues={FragmentSchema.cast(item)}
      onSubmit={submitForm}
      validationSchema={FragmentSchema}
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
          {values.mediaUrl ? (
            <img
              src={`${getImgIxSrc(values.mediaUrl)}?height=250`}
              className="h-auto"
              alt={values.mediaCaption}
              title={values.mediaCaption}
            />
          ) : (
            <Uppy
              userId={user.id}
              mediaUrl={values.mediaUrl}
              onChange={(url) => setFieldValue("mediaUrl", url)}
            />
          )}

          {values.id && (
            <div className="my-2">
              <Button
                onClick={() => {
                  if (replaceUrl) {
                    setFieldValue("mediaUrl", replaceUrl);
                    setReplaceUrl(null);
                  } else {
                    setReplaceUrl(item.mediaUrl);
                    setFieldValue("mediaUrl", null);
                  }
                }}
              >
                {replaceUrl ? "Back" : "Replace image"}
              </Button>
            </div>
          )}

          {(values.mediaUrl || values.id) && (
            <>
              <div className="form-control mt-4">
                <label>Caption</label>
                <input
                  name="mediaCaption"
                  className="input"
                  value={values.mediaCaption}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control mt-4">
                <label>Date</label>
                <DatePicker
                  date={values.date}
                  onChange={(newDate) => {
                    setFieldValue(
                      "date",
                      newDate.toISOString().replace(/T.*/, "")
                    );
                    setFieldValue("dateType", "MANUAL");
                  }}
                />
              </div>
            </>
          )}

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
