import { useContext, useState, useRef } from "react";
import { UIContext } from "~/app";
import { useHistory } from "react-router-dom";
import Svg from "~/components/svg";
import { Text, Button } from "~/components/_styled";
import { useEffect } from "react/cjs/react.development";
import useClickOutside from "~/hooks/useClickOutside";
import { motion } from "framer-motion";
import AlertCircle from "~/components/alertCircle";

function NotificationItem({ notification, clearNotifcation }) {
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
      }}
    >
      {notification.text}
      {notification.clearable && (
        <div
          className="ml-1 p-1"
          onClick={(e) => {
            e.stopPropagation();
            clearNotifcation(notification.id);
          }}
        >
          <Svg color="currentColor" name="cancel" size={16} />
        </div>
      )}
    </Button>
  );
}

function NotificationSection({
  title,
  description,
  items,
  index,
  clearNotifcation,
}) {
  return (
    <div
      className={`flex w-full flex-col pt-2 px-2 ${
        index !== 0 && "border-t border-lightGray"
      }`}
    >
      <Text css="font-medium text-right ">
        {title} ({items.length})
      </Text>
      <Text css="text-right mt-0 mb-1 whitespace-nowrap">{description}</Text>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <NotificationItem
            key={i}
            notification={item}
            clearNotifcation={clearNotifcation}
          />
        ))}
      </div>
    </div>
  );
}

export default function Notifications() {
  const notificationMenu = useRef(null);
  const [open, setOpen] = useState(false);
  const [notificationSections, setNotificationSections] = useState({});
  useClickOutside(notificationMenu, () => setOpen(false));
  const {
    uiState: { notifications },
    updateUiState,
  } = useContext(UIContext);

  function clearNotifcation(notificationId) {
    updateUiState(
      { notifications: notifications.filter((n) => n.id !== notificationId) },
      false
    );
  }

  useEffect(() => {
    setNotificationSections(
      notifications.reduce((sections, notification) => {
        if (!sections[notification.type]) {
          sections[notification.type] = [notification];
        } else {
          sections[notification.type].push(notification);
        }
        return sections;
      }, {})
    );
  }, [notifications]);

  return (
    <div className="relative" ref={notificationMenu}>
      <Button size="compact" css="relative" onClick={() => setOpen(!open)}>
        <AlertCircle
          flash={false}
          active={notifications.length}
          position="right-1 top-1"
        />

        <Svg
          name="bell"
          css="transition-all duration-200"
          size={20}
          color={notifications.length ? "offBlack" : "gray"}
        />
      </Button>
      {open && (
        <motion.div
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          variants={{
            visible: {
              opacity: 1,
              boxShadow: "0 0 6px 2px rgba(0, 0, 0, 0.1)",
            },
            hidden: {
              opacity: 0,
            },
          }}
          className={`absolute right-0 top-9 flex flex-col items-end overflow-hidden rounded z-30 bg-white p-2`}
        >
          {notifications.length ? (
            <>
              {notificationSections["ACTION"] && (
                <NotificationSection
                  clearNotifcation={clearNotifcation}
                  index={0}
                  description={`You have ${
                    notificationSections["ACTION"].length
                  } task${
                    notificationSections["ACTION"].length > 1 ? "s" : ""
                  } to complete`}
                  title="Tasks"
                  items={notificationSections["ACTION"]}
                />
              )}
            </>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              className="h-16 w-64 text-md text-gray flex items-center justify-center text-center p-1"
            >
              No new notifications
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
