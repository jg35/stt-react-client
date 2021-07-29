import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router";
import { Formik } from "formik";
import { useQuery, useMutation } from "@apollo/client";
import { pick, cloneDeep } from "lodash";

import { AuthContext } from "~/components/authWrap";
import { VersionSchema, CoverElementSchema, CoverSchema } from "~/lib/yup";
import { FETCH_PUBLISH_VIEW, UPDATE_VERSION, PUBLISH_VERSION } from "~/lib/gql";
import Page from "~/components/page";
import Card from "~/components/card";
import PublishSkeleton from "~/components/publish/publishSkeleton";
import PublishStepper from "~/components/publish/publishStepper";
import CoverEditorForm from "~/components/publish/coverEditorForm";
import PublishOptionsForm from "~/components/publish/publishOptionsForm";
import CreateBookForm from "~/components/publish/createBookForm";

export default function PublishNewVersion() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [publishVersion] = useMutation(PUBLISH_VERSION);
  const { data } = useQuery(FETCH_PUBLISH_VIEW, {
    variables: { userId: user.id },
  });

  useEffect(() => {
    if (data && data.stt_version) {
      const version = cloneDeep(data.stt_version.find((v) => !v.generated));

      if (!version.publishedAt) {
        version.publishedAt = new Date().toISOString().replace(/T.*/, "");
      }
      if (!version.author) {
        version.author = user.displayName;
      }
      // Should only run once user reaches the second step
      if (!version.theme.cover && version.author && version.title) {
        version.theme.cover = CoverSchema.cast({
          elements: [
            CoverElementSchema.cast({
              content: version.title,
              originalContent: version.title,
              size: 10,
              relativePosition: { y: 10, x: 10 },
            }),
            CoverElementSchema.cast({
              content: version.author,
              originalContent: version.author,
              relativePosition: { y: 80, x: 10 },
            }),
          ],
        });
      }
      setCurrentVersion(version);
    }
  }, [data]);

  function publishVersionHandler() {
    // TODO update the action to also generate the cover
    return publishVersion({ variables: { userId: user.id } }).then(() => {
      // Redirect to publish view
      history.push("/publish");
    });
  }

  function saveVersionHandler(values) {
    return updateVersion({
      variables: {
        data: pick(values, [
          "title",
          "author",
          "publishedAt",
          "theme",
          "sharePassword",
          "edited",
        ]),
        id: values.id,
      },
    });
  }

  const steps = [
    "⚙️  1. Publish options  ",
    "✨  2. Design your cover",
    "📖  3. Create your book",
  ];

  function renderStep(formProps) {
    switch (formProps.values.publishStep) {
      case 1:
        return <PublishOptionsForm {...formProps} />;
      case 2:
        return <CoverEditorForm {...formProps} />;
      case 3:
        return <CreateBookForm {...formProps} />;
    }
  }

  if (currentVersion) {
    return (
      <Page>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            height: "calc(100% - 16px)",
          }}
        >
          <Card css="min-h-full border-4 border-white">
            <Formik
              onSubmit={(values, formBag) => {
                values.edited = true;
                if (values.publishStep === 3) {
                  // Create the book
                  return publishVersionHandler();
                }
                return saveVersionHandler(values, formBag).then(() => {
                  formBag.setFieldValue("publishStep", values.publishStep + 1);
                });
              }}
              initialValues={VersionSchema.cast(currentVersion)}
              validationSchema={VersionSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {(props) => {
                return (
                  <form
                    onSubmit={props.handleSubmit}
                    className="flex-1 flex flex-col"
                  >
                    <PublishStepper
                      saveProgress={props.handleSubmit}
                      isSubmitting={props.isSubmitting}
                      totalSteps={steps.length}
                      steps={steps}
                      currentStep={props.values.publishStep}
                      stepBack={() =>
                        props.setFieldValue(
                          "publishStep",
                          props.values.publishStep - 1
                        )
                      }
                    />
                    {renderStep(props)}
                  </form>
                );
              }}
            </Formik>
          </Card>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <PublishSkeleton />
      </Card>
    </Page>
  );
}
