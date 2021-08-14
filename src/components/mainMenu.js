import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "~/components/authWrap";
import useLogout from "~/hooks/useLogout";

import Svg from "~/components/svg";
import { Text } from "~/components/_styled";
import Menu from "~/components/menu";

export default function MainMenu() {
  const logout = useLogout();
  const {
    authState: { user },
  } = useContext(AuthContext);

  const items = [
    {
      component: (
        <NavLink className="fill text-right" to="/settings#account">
          <div className="flex items-center justify-end p-2">
            <div className="px-2 truncate">
              <Text tag="span" size="compact" css="block">
                {user.displayName}
              </Text>
              <Text tag="span" size="compact" className="text-gray">
                {user.email}
              </Text>
            </div>

            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-12 h-12 rounded-full shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full uppercase text-xl bg-lightGray flex items-center justify-center font-bold shadow">
                {user.displayName &&
                  user.displayName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
              </div>
            )}
          </div>
        </NavLink>
      ),
    },
    {
      component: (
        <NavLink
          className="fill text-right flex items-center justify-end p-2"
          to="/settings"
        >
          Settings <Svg name="settings" css="ml-2" />
        </NavLink>
      ),
    },
    {
      onClick: logout,
      buttonCss: "justify-end p-2",
      component: "Logout",
    },
  ];
  if (process.env.NODE_ENV === "development") {
    items.push({
      component: (
        <NavLink
          className="fill text-right flex items-center justify-end p-2"
          to="/library"
        >
          Component library
        </NavLink>
      ),
    });
  }

  return <Menu minimal={false} toggle={<Svg name="menu" />} items={items} />;
}
