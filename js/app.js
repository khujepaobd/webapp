import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);

const loginForm = $("loginForm");
const registerForm = $("registerForm");

const loginMessage = $("loginMessage");
const registerMessage = $("registerMessage");

const loginCard = $("loginCard");
const registerCard = $("registerCard");

const authArea = $("authArea");
const userArea = $("userArea");

const userInfo = $("userInfo");
const logoutBtn = $("logoutBtn");


function showMessage(element, text, type = "info") {
  if (!element) return;

  element.textContent = text;
  element.classList.add("show");

  element.style.background =
    type === "success" ? "#eaf8ef" :
    type === "error" ? "#fff0f0" :
    "#f3f6f4";

  element.style.color =
    type === "success" ? "#087f42" :
    type === "error" ? "#b42318" :
    "#536158";
}


function clearMessages() {
  loginMessage?.classList.remove("show");
  registerMessage?.classList.remove("show");
}


function showLogin() {
  loginCard?.classList.remove("hidden");
  registerCard?.classList.add("hidden");
  clearMessages();
}


function showRegister() {
  loginCard?.classList.add("hidden");
  registerCard?.classList.remove("hidden");
  clearMessages();
}


window.showLogin = showLogin;
window.showRegister = showRegister;


/* =========================
   REGISTER
========================= */

registerForm?.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = $("registerEmail")?.value.trim();
  const password = $("registerPassword")?.value;
  const confirmPassword =
    $("registerConfirmPassword")?.value;

  if (!email || !password || !confirmPassword) {
    showMessage(
      registerMessage,
      "সব তথ্য পূরণ করুন।",
      "error"
    );
    return;
  }

  if (password !== confirmPassword) {
    showMessage(
      registerMessage,
      "দুইটি Password একই নয়।",
      "error"
    );
    return;
  }

  if (password.length < 6) {
    showMessage(
      registerMessage,
      "Password কমপক্ষে ৬ অক্ষরের হতে হবে।",
      "error"
    );
    return;
  }

  try {

    showMessage(
      registerMessage,
      "Account তৈরি হচ্ছে..."
    );

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    console.log(
      "New Firebase user:",
      result.user.uid
    );

    showMessage(
      registerMessage,
      "Account সফলভাবে তৈরি হয়েছে।",
      "success"
    );

  } catch (error) {

    console.error(error);

    let text = "Account তৈরি করা যায়নি।";

    if (error.code === "auth/email-already-in-use") {
      text = "এই Email দিয়ে আগে থেকেই Account আছে।";
    }

    if (error.code === "auth/invalid-email") {
      text = "Email ঠিক নয়।";
    }

    if (error.code === "auth/weak-password") {
      text = "Password আরও শক্তিশালী দিন।";
    }

    showMessage(
      registerMessage,
      text,
      "error"
    );
  }

});


/* =========================
   LOGIN
========================= */

loginForm?.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = $("loginEmail")?.value.trim();
  const password = $("loginPassword")?.value;

  if (!email || !password) {
    showMessage(
      loginMessage,
      "Email এবং Password দিন।",
      "error"
    );
    return;
  }

  try {

    showMessage(
      loginMessage,
      "Login হচ্ছে..."
    );

    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    console.log(
      "Logged in user:",
      result.user.uid
    );

    showMessage(
      loginMessage,
      "সফলভাবে Login হয়েছে।",
      "success"
    );

  } catch (error) {

    console.error(error);

    let text = "Login করা যায়নি।";

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      text = "Email অথবা Password সঠিক নয়।";
    }

    if (error.code === "auth/too-many-requests") {
      text =
        "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
    }

    showMessage(
      loginMessage,
      text,
      "error"
    );
  }

});


/* =========================
   PASSWORD RESET
========================= */

window.resetPassword = async function () {

  const email = $("loginEmail")?.value.trim();

  if (!email) {
    showMessage(
      loginMessage,
      "প্রথমে আপনার Email লিখুন।",
      "error"
    );
    return;
  }

  try {

    await sendPasswordResetEmail(
      auth,
      email
    );

    showMessage(
      loginMessage,
      "Password reset email পাঠানো হয়েছে।",
      "success"
    );

  } catch (error) {

    console.error(error);

    showMessage(
      loginMessage,
      "Password reset email পাঠানো যায়নি।",
      "error"
    );
  }

};


/* =========================
   LOGOUT
========================= */

logoutBtn?.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

    } catch (error) {

      console.error(error);

      alert("Logout করা যায়নি।");
    }

  }
);


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      authArea?.classList.add("hidden");
      userArea?.classList.remove("hidden");

      if (userInfo) {

        userInfo.textContent =
          `Email: ${user.email || "Anonymous User"}
UID: ${user.uid}`;

      }

    } else {

      authArea?.classList.remove("hidden");
      userArea?.classList.add("hidden");

      showLogin();
    }

  }
);