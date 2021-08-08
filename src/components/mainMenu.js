import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@src/components/authWrap";
import { signOut } from "@src/lib/auth";

import Svg from "@src/components/svg";
import Menu from "@src/components/menu";

export default function MainMenu() {
  const {
    authState: { user },
  } = useContext(AuthContext);

  return (
    <Menu
      minimal={false}
      toggle={<Svg name="menu" />}
      items={[
        {
          component: (
            <NavLink className="fill text-right" to="/settings#account">
              <div className="flex items-center justify-end p-2">
                <div className="px-2 truncate">
                  <span className="block">{user.displayName}</span>
                  <span className="text-gray">{user.email}</span>
                </div>

                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full text-xl bg-lightGray flex items-center justify-center font-bold shadow">
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
          component: (
            <button className="fill text-right p-2" onClick={() => signOut()}>
              Log out
            </button>
          ),
        },
      ]}
    />
  );
}
