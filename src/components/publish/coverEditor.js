import { Formik } from "formik";
import { CoverSchema, ThemeSchema } from "~/lib/yup";

import Modal from "~/components/modal";
import FormActions from "~/components/capture/formActions";
import CoverEditorForm from "~/components/publish/coverEditorForm";

export default function CoverEditor({
  versionCover,
  updateCover,
  closeCoverEditor,
}) {
  console.log(ThemeSchema.cast());
  console.log(CoverSchema.cast());
  return (
    <Modal isOpen={true} size="full">
      <Formik
        initialValues={CoverSchema.cast(versionCover)}
        onSubmit={(values) => {
          return updateCover(values).then(() => {
            closeCoverEditor();
          });
        }}
        validationSchema={CoverSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(props) => {
          return (
            <form onSubmit={props.handleSubmit} className="px-6">
              <CoverEditorForm {...props} />
              {/* <FormError error={props.errors &&} /> */}
              <FormActions
                closeModal={closeCoverEditor}
                itemId={true}
                isSubmitting={props.isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
}
