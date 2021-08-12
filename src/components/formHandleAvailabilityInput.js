import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { throttle } from "lodash";
import { ACTION_CHECK_HANDLE_AVAILABILITY } from "~/lib/gql";
import colors from "~/lib/colors";
import FormInput from "~/components/formInput";
import FormError from "~/components/formError";
import LoadingSpinner from "~/components/loadingSpinner";

export default function FormHandleAvailabilityInput({
  handleChange,
  handleBlur,
  value,
  error,
  setFieldError,
  savedHandle,
}) {
  const [touched, setTouched] = useState(false);
  const [checkHandleAvailability] = useMutation(
    ACTION_CHECK_HANDLE_AVAILABILITY
  );
  const [loading, setIsLoading] = useState(false);

  const validateHandleAvailability = useCallback(
    throttle((e) => {
      const handle = e.target.value;
      if (!handle.length) {
        setFieldError("publicHandle", "The handle is required");
        setIsLoading(false);
      } else if (!handle.match(/^[a-z0-9]+$/i)) {
        setFieldError(
          "publicHandle",
          "The handle can only consist of letters and numbers and cannot contain any spaces"
        );
        setIsLoading(false);
      } else if (savedHandle === handle) {
        setFieldError("publicHandle", undefined);
        setTouched(false);
        setIsLoading(false);
      } else {
        checkHandleAvailability({
          variables: { handle },
        }).then(({ data }) => {
          const isAvailable = data.action_stt_handle_availability.available;
          setIsLoading(false);
          setFieldError(
            "publicHandle",
            isAvailable ? undefined : `${handle} is not an available handle`
          );
        });
      }
    }, 1000),
    []
  );
  return (
    <div>
      <label className="mb-2 block font-medium text-lg">Handle</label>
      <FormInput
        autoFocus={false}
        error={error}
        value={value}
        name="publicHandle"
        placeholder="read.storiestotell.app/your-handle"
        handleBlur={handleBlur}
        handleChange={handleChange}
        onKeyUp={(e) => {
          setTouched(true);
          setFieldError("publicHandle", null);
          setIsLoading(true);
          validateHandleAvailability(e);
        }}
      />
      <div className="flex justify-between items-center py-2">
        <div>
          {error && <FormError error={error} lowercase={true} />}
          {!error && value && !loading && touched && (
            <p className="text-successGreen">
              Your book will be available at{" "}
              <strong>read.storiestotell.app/{value}</strong>
            </p>
          )}
          {!error && value && !loading && !touched && savedHandle && (
            <p className="text-gray">
              Your book is available at{" "}
              <strong>read.storiestotell.app/{value}</strong>
            </p>
          )}
          {!error && !value && (
            <p className="text-gray">
              Your book will be available at{" "}
              <strong>read.storiestotell.app/your-handle</strong>
            </p>
          )}
        </div>
        {loading && (
          <div className="animate-fade-in flex items-center text-gray">
            <LoadingSpinner
              loading={true}
              css="w-4 h-4 mr-2"
              colors={colors.gray}
            />{" "}
            Checking availability...
          </div>
        )}
      </div>
    </div>
  );
}
