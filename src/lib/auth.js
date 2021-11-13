import firebase from "firebase/app";
import "firebase/auth";
const google = new firebase.auth.GoogleAuthProvider();
const facebook = new firebase.auth.FacebookAuthProvider();

export const signInWithGoogle = async () => {
  return firebase.auth().signInWithPopup(google);
};

export const signInWithFacebook = async () => {
  return firebase.auth().signInWithPopup(facebook);
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
    await firebase.auth().signOut();
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
