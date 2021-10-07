import { useContext } from "react";
import { UIContext } from "~/app";
import { useMutation } from "@apollo/client";
import { UPDATE_NOTIFICATION } from "~/lib/gql";

export default function useNotification(dbNotification) {
  const { updateUiState } = useContext(UIContext);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const notifications = [
    {
      type: "ACTION",
      ref: "CONFIRM_USER_EMAIL",
      clearable: false,
      href: "/settings/#account",
      text: "Confirm your email to activate your account",
    },
    {
      type: "INFO",
      ref: "TRY_TUTORIAL",
      clearable: true,
      text: "Learn the ropes with our tutorial",
      onClick: () => {
        updateUiState(
          {
            tutorial: {
              active: true,
              step: 1,
            },
          },
          false
        );
      },
    },
  ];
  return {
    notification: dbNotification
      ? {
          ...notifications.find((n) => n.ref === dbNotification.ref),
          ...dbNotification,
        }
      : null,
    markCompleted: () => {
      return updateNotification({
        variables: {
          id: dbNotification?.id,
          data: {
            completedAt: new Date(),
          },
        },
      });
    },
    markCleared: (id) => {
      return updateNotification({
        variables: {
          id: dbNotification?.id,
          data: {
            clearedAt: new Date(),
          },
        },
      });
    },
  };
}
