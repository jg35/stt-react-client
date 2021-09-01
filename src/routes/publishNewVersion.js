import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { pick, cloneDeep, omit } from "lodash";

import { useCustomQuery } from "~/hooks/useCustomApollo";
import { AuthContext } from "~/components/authWrap";
import { VersionSchema, CoverElementSchema, CoverSchema } from "~/lib/yup";
import {
  FETCH_CREATE_BOOK_VIEW,
  UPDATE_VERSION,
  UPDATE_USER,
  ACTION_PUBLISH_VERSION,
} from "~/lib/gql";
import Page from "~/components/page";
import { Card } from "~/components/_styled";
import PublishNewSkeleton from "~/components/publish/publishNewSkeleton";
import PublishStepper from "~/components/publish/publishStepper";
import CoverEditorForm from "~/components/publish/coverEditorForm";
import PublishOptionsForm from "~/components/publish/publishOptionsForm";
import CreateBookForm from "~/components/publish/createBookForm";
import useToastMessage from "~/hooks/useToastMessage";
import usePageTitle from "~/hooks/usePageTitle";

export default function PublishNewVersion() {
  usePageTitle("Create book");
  const { setError, setSuccess } = useToastMessage();
  const history = useHistory();
  const {
    authState: { user, dbUser, token },
  } = useContext(AuthContext);

  const [publishStep, setPublishStep] = useState(1);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [publishVersion] = useMutation(ACTION_PUBLISH_VERSION);
  const [updateUser] = useMutation(UPDATE_USER);
  const { data } = useCustomQuery(FETCH_CREATE_BOOK_VIEW, { userId: true });

  useEffect(() => {
    if (data && data.stt_version) {
      const version = VersionSchema(publishStep, token).cast({
        ...cloneDeep(data.stt_version[0]),
        publicHandle: (dbUser && dbUser.publicHandle) || "",
      });

      if (!version.publishedAt) {
        version.publishedAt = new Date().toISOString().replace(/T.*/, "");
      }
      if (!version.author) {
        version.author = user.displayName;
      }
      setCurrentVersion(version);
    }
  }, [data, dbUser]);

  function publishVersionHandler(values) {
    return new Promise(async (resolve, reject) => {
      try {
        const createUserHandle = !dbUser.publicHandle && values.publicHandle;
        if (createUserHandle) {
          await updateUser({
            variables: {
              data: { publicHandle: createUserHandle },
              userId: user.id,
            },
          });
        }
        await saveVersionHandler(omit(values, ["publicHandle"]), true);
        await publishVersion({
          variables: { userId: user.id },
          update(cache, { data }) {
            cache.modify({
              id: cache.identify(dbUser),
              fields: {
                versions: () =>
                  dbUser.versions.concat({ id: data.nextVersionId }),
              },
            });
          },
        });
        // Redirect to publish view
        history.push("/publish");
        setSuccess(
          "You've succesfully published your book! It can now be found here on your publish list."
        );
        resolve();
      } catch (e) {
        setError(
          e,
          "Something went wrong when publishing your book. Please try again"
        );
        reject(e);
      }
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
          "privacyStatus",
        ]),
        id: values.id,
      },
    }).catch((e) => {
      setError(e, { ref: "UPDATE", params: ["book"] });
    });
  }

  const steps = ["1. Metadata", "2. Create cover", "3. Sharing"];

  function renderStep(formProps) {
    switch (publishStep) {
      case 1:
        return <PublishOptionsForm {...formProps} />;
      case 2:
        return <CoverEditorForm {...formProps} />;
      case 3:
        return (
          <CreateBookForm
            {...formProps}
            savedHandle={dbUser && dbUser.publicHandle}
          />
        );
    }
  }

  if (currentVersion) {
    return (
      <Page>
        <Card css="border-4 border-white p-0 flex flex-col h-full rounded-lg overflow-scroll">
          <Formik
            onSubmit={(values, formBag) => {
              let saveValues = { ...values };
              if (publishStep === 1 && !saveValues.theme.cover.init) {
                saveValues.theme.cover = CoverSchema.cast({
                  init: true,
                  elements: [
                    CoverElementSchema.cast({
                      content: values.title,
                      originalContent: values.title,
                      size: 10,
                      relativePosition: { y: 10, x: 10 },
                    }),
                    CoverElementSchema.cast({
                      content: values.author,
                      originalContent: values.author,
                      relativePosition: { y: 80, x: 10 },
                    }),
                  ],
                });
              } else if (publishStep === 3) {
                // Create the book
                return publishVersionHandler(values);
              }
              return saveVersionHandler(saveValues).then(() => {
                formBag.setValues(saveValues);
                setPublishStep(publishStep + 1);
              });
            }}
            initialValues={currentVersion}
            validationSchema={VersionSchema(publishStep, token)}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {(props) => {
              return (
                <form
                  id="publish-new-version-form"
                  className="flex-1 flex flex-col"
                  onSubmit={props.handleSubmit}
                >
                  <PublishStepper
                    isSubmitting={props.isSubmitting}
                    totalSteps={steps.length}
                    steps={steps}
                    currentStep={publishStep}
                    stepBack={() => setPublishStep(publishStep - 1)}
                  />

                  {renderStep(props)}
                </form>
              );
            }}
          </Formik>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <PublishNewSkeleton />
    </Page>
  );
}
