import firebase from "firebase";
import axios from "axios";
import { authStateVar } from "./apollo";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
});

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const firebaseId = user.uid;
    const token = await user.getIdToken();
    const idTokenResult = await user.getIdTokenResult();
    const hasuraClaims = idTokenResult.claims["https://hasura.io/jwt/claims"];
    if (
      !hasuraClaims ||
      !hasuraClaims["x-hasura-allowed-roles"].includes(
        process.env.REACT_APP_HASURA_ROLE_NAME
      )
    ) {
      axios
        .post(
          `${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/users/sync`,
          {
            token,
            user,
            appId: process.env.REACT_APP_HASURA_APP_ID,
          }
        )
        .then(async () => {
          // Force refresh the token to get the updated claims
          const token = await user.getIdToken(true);
          authStateVar({ status: "in", token });
        })
        .catch(() => {
          // Need to handle this better. For now just sign out so they can try and login again
          // signOut()
        });
    } else {
      authStateVar({ status: "in", token, firebaseId });
    }
  } else {
    authStateVar({ status: "out" });
  }
});

export default firebase;
