import axios from "axios";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { WEB_URL } from "../lib/CONSTANTS";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    loggedIn: false,
  });

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  async function postLogin(user) {
    const body = {
      uid: user.uid,
      name: user.displayName,
      img: user.photoURL,
    };

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const res = await axios.post(WEB_URL + "/api/users", body, headers);
    console.log("After sign in: ", user);
    console.log(res);
  }

  async function login() {
    signInWithPopup(auth, provider).then(({ user }) => {
      postLogin(user);
    });
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser({
          uid: userInfo.uid,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          loggedIn: true,
        });
      } else {
        setUser({
          loggedIn: false,
        });
      }
    });
  }, []);

  const value = {
    login,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
