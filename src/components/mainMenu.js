import { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "~/components/authWrap";
import { UIContext } from "~/app";
import useLogout from "~/hooks/useLogout";

import Svg from "~/components/svg";
import { Text } from "~/components/_styled";
import Menu from "~/components/menu";

export default function MainMenu() {
  const history = useHistory();
  const logout = useLogout();
  const {
    authState: { user, dbUser },
  } = useContext(AuthContext);
  const { updateUiState } = useContext(UIContext);

  const items = [
    {
      component: (
        <NavLink className="fill text-right" to="/settings">
          <div className="flex items-center justify-end p-2">
            <div className="px-2 truncate w-40">
              {user.displayName && (
                <Text tag="span" size="compact" css="block">
                  {user.displayName}
                </Text>
              )}
              <Text tag="span" size="compact" css="text-gray text-sm">
                {user.email}
              </Text>
            </div>

            <div className="w-12">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full overflow-hidden shadow"
                />
              ) : (
                <div className="w-12 h-12 rounded-full uppercase text-xl bg-lightGray flex items-center justify-center font-bold shadow">
                  {user.displayName ? (
                    user.displayName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                  ) : (
                    <Svg name="account" size={50} />
                  )}
                </div>
              )}
            </div>
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
      component: (
        <span
          className="fill text-right flex items-center justify-end p-2"
          onClick={() => {
            history.push("/");
            updateUiState(
              {
                tutorial: {
                  active: true,
                  step: 1,
                },
              },
              false
            );
          }}
        >
          Play the tutorial <Svg name="tutorial" css="ml-2" />
        </span>
      ),
    },
    {
      component: (
        <span
          className="fill text-right flex items-center justify-end p-2"
          onClick={() => {
            if (window.Tawk_API) {
              window.Tawk_API.setAttributes({
                id: dbUser.id,
              });
              window.Tawk_API.maximize();
            }
          }}
        >
          Help <Svg name="question" css="ml-2" />
        </span>
      ),
    },
    {
      component: (
        <span
          className="fill text-right flex items-center justify-end p-2"
          onClick={logout}
        >
          Logout
        </span>
      ),
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
