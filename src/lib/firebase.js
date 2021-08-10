import firebase from "firebase";
import { authStateVar } from "~/lib/apollo";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
});

let fbAuthUser;

export const resendEmailVerification = () => {
  if (fbAuthUser) {
    fbAuthUser.sendEmailVerification();
  }
};

export const onAuthStateChange = (syncUserMutation, authState) => {
  // console.log("set onAuthStateChangeListener");
  const onAuthStateChangeListener = firebase
    .auth()
    .onAuthStateChanged(async (user) => {
      if (user) {
        fbAuthUser = user;
        if (authState.emailForm) {
          await user.updateProfile({
            displayName: `${authState.emailForm.firstName} ${authState.emailForm.lastName}`,
          });
        }
        const { displayName, email, emailVerified, uid: id, photoURL } = user;
        const userDetails = {
          displayName,
          email,
          id,
          photoURL,
          emailVerified,
        };
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
              authStateVar({ status: "in", token, user: userDetails });
            })
            .catch(() => {
              // Need to handle this better. For now just sign out so they can try and login again
              // signOut()
            });
        } else {
          authStateVar({ status: "in", token, user: userDetails });
        }
      } else {
        authStateVar({ status: "out" });
      }
    });
  return onAuthStateChangeListener;
};
