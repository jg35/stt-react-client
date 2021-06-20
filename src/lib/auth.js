import firebase from "firebase";
import { authStateVar } from "./apollo";
const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await firebase.auth().signInWithPopup(provider);
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
