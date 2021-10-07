import { useHistory } from "react-router-dom";
import Svg from "~/components/svg";
import { Button } from "~/components/_styled";
import useNotification from "~/components/notifications/useNotification";

export default function NotificationItem({ dbNotification, closeMenu }) {
  const { notification, markCleared } = useNotification(dbNotification);
  const history = useHistory();
  return (
    <Button
      type="minimal"
      size="compact"
      css="justify-end my-1 whitespace-nowrap"
      onClick={() => {
        if (notification.href) {
          history.push(notification.href);
        } else if (notification.onClick) {
          notification.onClick();
        }
        closeMenu();
      }}
    >
      {notification.text}
      {notification.clearable && (
        <div
          className="ml-1 p-1"
          onClick={(e) => {
            e.stopPropagation();
            markCleared(dbNotification.id);
            closeMenu();
          }}
        >
          <Svg color="currentColor" name="cancel" size={16} />
        </div>
      )}
    </Button>
  );
}
