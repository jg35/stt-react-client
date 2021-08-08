import firebase from "firebase";
import { authStateVar } from "@src/lib/apollo";
const google = new firebase.auth.GoogleAuthProvider();
const facebook = new firebase.auth.FacebookAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await firebase.auth().signInWithPopup(google);
  } catch (error) {
    console.log(error);
  }
};

export const signInWithFacebook = async () => {
  try {
    await firebase.auth().signInWithPopup(facebook);
  } catch (error) {
    console.log(error);
  }
};

export const createAccountWithEmail = async ({ email, password }) => {
  const { user } = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  // TODO - block access to app until isEmailVerified (https://firebase.google.com/docs/reference/android/com/google/firebase/auth/UserInfo)
  await user.sendEmailVerification();
};

export const loginWithEmail = async ({ email, password }) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const sendResetPasswordEmail = async ({ email }) => {
  return firebase.auth().sendPasswordResetEmail(email);
};

export const signOut = async () => {
  try {
    authStateVar({ status: "loading" });
    await firebase.auth().signOut();
    authStateVar({ status: "out" });
  } catch (error) {
    console.log(error);
  }
};
