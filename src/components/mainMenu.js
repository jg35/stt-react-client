import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "~/components/authWrap";
import { signOut } from "~/lib/auth";

import Svg from "~/components/svg";
import Menu from "~/components/menu";

export default function MainMenu() {
  const { user } = useContext(AuthContext);

  return (
    <Menu
      minimal={false}
      toggle={<Svg name="menu" />}
      items={[
        {
          component: (
            <NavLink className="fill text-right" to="/settings#account">
              <div className="flex items-center justify-end p-2">
                <div className="mr-2">
                  <span className="block">{user.displayName}</span>
                  <span className="text-gray">{user.email}</span>
                </div>
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-10 h-10 rounded"
                />
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
