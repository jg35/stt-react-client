import { useHistory } from "react-router";
import { signOut } from "~/lib/auth";
import { authStateVar } from "~/lib/apollo";

export default function useLogout() {
  const history = useHistory();

  return () => {
    authStateVar({ status: "out", user: null, dbUser: null, token: "" });
    history.push("/login");
    signOut();
  };
}
