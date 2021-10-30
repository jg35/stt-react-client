import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Svg from "~/components/svg";
import { isEmpty } from "lodash";
import { Text, Button, Title } from "~/components/_styled";
import useClickOutside from "~/hooks/useClickOutside";
import AlertCircle from "~/components/alertCircle";
import NotificationItem from "~/components/notifications/notificationItem";

function NotificationSection({
  title,
  description,
  items,
  closeMenu,
  index,
  last,
}) {
  return (
    <div
      className={`flex w-full flex-col ${!last && "pb-2"} ${
        index !== 0 && "pt-2 border-t border-lightGray"
      }`}
    >
      <Text css="text-right text-sm font-medium block ml-2 whitespace-nowrap mb-1">
        {title && `${title} (${items.length})`}
      </Text>
      <Text css="text-right mt-0 mb-1 whitespace-nowrap">{description}</Text>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <NotificationItem
            key={i}
            dbNotification={item}
            closeMenu={closeMenu}
          />
        ))}
      </div>
    </div>
  );
}

export default function NotificationMenu({ notifications }) {
  const notificationMenu = useRef(null);
  const [open, setOpen] = useState(false);
  const [notificationSections, setNotificationSections] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);
  useClickOutside(notificationMenu, () => setOpen(false));

  useEffect(() => {
    const filteredNotifications = notifications.filter(
      (n) => !n.completedAt && !n.clearedAt
    );
    setNotificationCount(filteredNotifications.length);
    setNotificationSections(
      filteredNotifications.reduce((sections, notification) => {
        if (!sections[notification.type]) {
          sections[notification.type] = [notification];
        } else {
          sections[notification.type].push(notification);
        }
        return sections;
      }, {})
    );
  }, [notifications]);

  const HAS_NOTIFICAITONS = !isEmpty(notificationSections);

  return (
    <div className="relative" ref={notificationMenu}>
      <Button
        size="compact"
        css="relative bg-transparent border-transparent"
        onClick={() => setOpen(!open)}
      >
        <AlertCircle
          flash={false}
          active={HAS_NOTIFICAITONS}
          position="right-1 top-1"
        />

        <Svg
          name="bell"
          css="transition-all duration-200"
          size={20}
          color={HAS_NOTIFICAITONS ? "offBlack" : "gray"}
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
          {HAS_NOTIFICAITONS ? (
            <>
              <Title css="mb-0 py-2 relative flex">Notifications</Title>
              {Object.keys(notificationSections).map((sectionKey, i) => {
                return (
                  <NotificationSection
                    items={notificationSections[sectionKey]}
                    closeMenu={() => setOpen(false)}
                    index={i}
                    title={sectionKey === "ACTION" ? "Tasks" : ""}
                    last={i === Object.keys(notificationSections).length - 1}
                  />
                );
              })}
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
