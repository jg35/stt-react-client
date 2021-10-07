import { useMutation } from "@apollo/client";
import { UPDATE_NOTIFICATION } from "~/lib/gql";

export default function useNotification(dbNotification) {
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
        console.log("load the tutorial");
        // update ui state to load the tutorial
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
    markCompleted: (id) => {
      return updateNotification({
        variables: {
          id,
          data: {
            completedAt: new Date(),
          },
        },
      });
    },
    markCleared: (id) => {
      return updateNotification({
        variables: {
          id,
          data: {
            clearedAt: new Date(),
          },
        },
      });
    },
  };
}
