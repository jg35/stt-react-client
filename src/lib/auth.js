import firebase from "firebase";
import { authStateVar } from "~/lib/apollo";
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

export const createAccountWithEmail = async (email, password) => {
  try {
    const { user } = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    // TODO - block access to app until isEmailVerified (https://firebase.google.com/docs/reference/android/com/google/firebase/auth/UserInfo)
    await user.sendEmailVerification();
  } catch (error) {
    console.log(error);
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.log(error);
  }
};

export const sendResetPasswordEmail = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (error) {
    console.log(error);
  }
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
