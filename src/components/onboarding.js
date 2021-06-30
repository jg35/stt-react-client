import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { useQuery, useMutation } from "@apollo/client/react";
import { FETCH_USER, UPDATE_USER } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import FormError from "~/components/formError";
import CountrySelect from "~/components/countrySelect";
import DatePicker from "~/components/capture/datepicker";
import { OnboardingSchema } from "~/lib/yup";
import SubmitButton from "~/components/submitButton";

import Tutorial from "~/components/tutorial";

function hasOnboardingFields(user) {
  return user.location && user.dob;
}

export default function Onboarding() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data, loading } = useQuery(FETCH_USER, {
    variables: { userId: user.id },
  });

  useEffect(() => {
    if (data) {
      setShowOnboarding(data && data.stt_user_by_pk.onboarding === false);
    }
  }, [data]);

  const [updateUser] = useMutation(UPDATE_USER);

  function submitForm(values) {
    return updateUser({ variables: { userId: user.id, data: values } }).then(
      () => history.go(0)
    );
  }

  if (showOnboarding) {
    return <Tutorial />;
  }

  return null;

  // if (
  //   hasOnboardingFields(data.stt_user_by_pk) &&
  //   hasCompletedTutorial(data.stt_user_by_pk)
  // ) {
  //   return null;
  // } else if (!hasOnboardingFields(data.stt_user_by_pk)) {
  //   return (
  //     <div className="min-h-full w-screen absolute top-0 left-0 flex justify-center items-center z-40">
  //       <div className="min-h-full min-w-full bg-lightestGray absolute top-0 left-0 opacity-80 z-40"></div>
  //       <div className="w-3/6 h-3/6 bg-white shadow-xl rounded-xl p-10 z-50">
  //         <div className="h-full flex flex-col">
  //           <h1 className="text-4xl">Welcome to Stories To Tell</h1>
  //           <p className="text-lg mt-6 mb-10">
  //             It looks like it's your first time here! Let's setup your
  //             timeline. Fill in your date of birth and location to create your
  //             timeline.
  //           </p>

  //           <Formik
  //             initialValues={OnboardingSchema.cast()}
  //             onSubmit={submitForm}
  //             validationSchema={OnboardingSchema}
  //             validateOnChange={false}
  //             validateOnBlur={false}
  //           >
  //             {({
  //               values,
  //               errors,
  //               touched,
  //               handleChange,
  //               handleBlur,
  //               handleSubmit,
  //               isSubmitting,
  //               setFieldValue,
  //             }) => (
  //               <form
  //                 onSubmit={handleSubmit}
  //                 className="flex-1 flex flex-col h-full justify-between"
  //               >
  //                 <div>
  //                   <div className="form-control">
  //                     <label>Date of birth</label>
  //                     <DatePicker
  //                       minDate={new Date().setYear(
  //                         new Date().getFullYear() - 100
  //                       )}
  //                       maxDate={new Date().setYear(
  //                         new Date().getFullYear() - 18
  //                       )}
  //                       placeholder="Enter your date of birth"
  //                       error={errors.dob}
  //                       date={values.dob}
  //                       handleChange={(newDate) => {
  //                         setFieldValue(
  //                           "dob",
  //                           newDate.toISOString().replace(/T.*/, "")
  //                         );
  //                       }}
  //                     />
  //                     <FormError error={errors.dob} />
  //                   </div>
  //                   <div className="form-control">
  //                     <label>Your country</label>
  //                     <CountrySelect
  //                       name="location"
  //                       handleChange={handleChange}
  //                       handleBlur={handleBlur}
  //                       value={values.location}
  //                       error={errors.location}
  //                     />
  //                     <FormError error={errors.location} />
  //                   </div>
  //                 </div>

  //                 <SubmitButton isSubmitting={isSubmitting}>Save</SubmitButton>
  //               </form>
  //             )}
  //           </Formik>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // } else if (!hasCompletedTutorial(data.stt_user_by_pk)) {
  //   return <Tutorial />;
  // }
}
