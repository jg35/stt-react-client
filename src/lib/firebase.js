import firebase from "firebase";
import { authStateVar } from "~/lib/apollo";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: "agent-name-7a4c5",
  appId: "1:397143712192:web:2a37a16a07caabfb9f2825",
});

export const analytics = firebase.analytics();

let fbAuthUser;

export const resendEmailVerification = () => {
  if (fbAuthUser) {
    return fbAuthUser.sendEmailVerification();
  }
  return Promise.reject();
};

export const refreshToken = () => {
  if (fbAuthUser) {
    return fbAuthUser
      .getIdToken(true)
      .then((token) => {
        authStateVar({ ...authStateVar, token });
      })
      .catch((e) => {
        authStateVar({ status: "out" });
      });
  }

  authStateVar({ status: "out" });
  return Promise.reject();
};

export const onAuthStateChange = (syncUserMutation) => {
  const onAuthStateChangeListener = firebase
    .auth()
    .onAuthStateChanged(async (user) => {
      if (user) {
        fbAuthUser = user;
        const userObj = user.toJSON();
        authStateVar({ status: "syncing" });
        if (user.metadata) {
          // if(user.metadata.creationTime === user.metadata.lastSignInTime) {
          //   gtag("event", "sign_up", {
          //     // method: "Google"
          //   });
          // }
        }
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaims =
          idTokenResult.claims["https://hasura.io/jwt/claims"];
        if (
          !hasuraClaims ||
          !hasuraClaims["x-hasura-allowed-roles"].includes(
            process.env.REACT_APP_HASURA_ROLE_NAME
          )
        ) {
          syncUserMutation({
            variables: {
              data: {
                token,
                appId: process.env.REACT_APP_HASURA_APP_ID,
              },
            },
          })
            .then(async () => {
              // Force refresh the token to get the updated claims
              const token = await user.getIdToken(true);
              authStateVar({ status: "in", token, user: userObj });
            })
            .catch(() => {
              // Need to handle this better. For now just sign out so they can try and login again
              // signOut()
            });
        } else {
          authStateVar({ status: "in", token, user: userObj });
        }
      } else {
        authStateVar({ status: "out" });
      }
    });
  return onAuthStateChangeListener;
};
