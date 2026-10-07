import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";


/* =========================================================
   KHUJE PAO — FIREBASE AUTHENTICATION
   ========================================================= */


const $ = (id) => document.getElementById(id);


/* =========================================================
   ELEMENTS
   ========================================================= */

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


/* =========================================================
   MESSAGE HELPER
   ========================================================= */

function showMessage(element, text, type = "info") {

  if (!element) return;

  element.textContent = text;
  element.classList.add("show");

  if (type === "success") {

    element.style.background = "#eaf8ef";
    element.style.color = "#087f42";

  } else if (type === "error") {

    element.style.background = "#fff0f0";
    element.style.color = "#b42318";

  } else {

    element.style.background = "#f3f6f4";
    element.style.color = "#536158";

  }
}


/* =========================================================
   CLEAR MESSAGES
   ========================================================= */

function clearMessages() {

  if (loginMessage) {
    loginMessage.classList.remove("show");
  }

  if (registerMessage) {
    registerMessage.classList.remove("show");
  }
}


/* =========================================================
   LOGIN SCREEN
   ========================================================= */

function showLogin() {

  if (loginCard) {
    loginCard.classList.remove("hidden");
  }

  if (registerCard) {
    registerCard.classList.add("hidden");
  }

  clearMessages();
}


/* =========================================================
   REGISTER SCREEN
   ========================================================= */

function showRegister() {

  if (loginCard) {
    loginCard.classList.add("hidden");
  }

  if (registerCard) {
    registerCard.classList.remove("hidden");
  }

  clearMessages();
}


/* Make functions available to HTML */

window.showLogin = showLogin;
window.showRegister = showRegister;


/* =========================================================
   FIREBASE ERROR TRANSLATOR
   ========================================================= */

function getFirebaseErrorMessage(error) {

  const code = error?.code || "";

  switch (code) {

    case "auth/email-already-in-use":
      return "এই Email দিয়ে ইতিমধ্যে একটি Account রয়েছে।";

    case "auth/invalid-email":
      return "Email address সঠিক নয়।";

    case "auth/weak-password":
      return "Password খুব দুর্বল। আরও শক্তিশালী Password ব্যবহার করুন।";

    case "auth/password-does-not-meet-requirements":
      return "আপনার Password Firebase-এর Password Policy পূরণ করছে না।";

    case "auth/operation-not-allowed":
      return "Firebase Console-এ Email/Password Authentication চালু নেই।";

    case "auth/admin-restricted-operation":
      return "এই Firebase Project-এ user registration নিষিদ্ধ করা হয়েছে।";

    case "auth/too-many-requests":
      return "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";

    case "auth/network-request-failed":
      return "Internet connection সমস্যা হয়েছে।";

    case "auth/invalid-api-key":
      return "Firebase API configuration সঠিক নয়।";

    case "auth/app-not-authorized":
      return "এই website Firebase Authentication-এর জন্য অনুমোদিত নয়।";

    case "auth/unauthorized-domain":
      return "এই domain Firebase Authentication-এর Authorized Domains-এ নেই।";

    case "auth/internal-error":
      return "Firebase-এর একটি internal error হয়েছে।";

    default:
      return "Firebase একটি অজানা error দিয়েছে।";
  }
}


/* =========================================================
   REGISTER
   ========================================================= */

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const email =
        $("registerEmail")?.value.trim();

      const password =
        $("registerPassword")?.value;

      const confirmPassword =
        $("registerConfirmPassword")?.value;


      /* -------------------------
         VALIDATION
         ------------------------- */

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


      /* -------------------------
         START REGISTER
         ------------------------- */

      showMessage(
        registerMessage,
        "Account তৈরি হচ্ছে..."
      );


      try {

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        console.log(
          "Khuje Pao Firebase User Created:",
          user.uid
        );


        showMessage(
          registerMessage,
          "✅ Account সফলভাবে তৈরি হয়েছে।",
          "success"
        );


        /*
         Firebase নতুন user-কে
         automatically sign-in করে।
        */

      } catch (error) {

        console.error(
          "KHUJE PAO REGISTER ERROR",
          error
        );


        const friendlyMessage =
          getFirebaseErrorMessage(error);


        /*
         Debug information
         */

        const debugText =
          `${friendlyMessage}

Error Code: ${error?.code || "unknown"}

Error Message: ${error?.message || "No message"}`;


        showMessage(
          registerMessage,
          debugText,
          "error"
        );

      }

    }
  );

}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const email =
        $("loginEmail")?.value.trim();

      const password =
        $("loginPassword")?.value;


      /* -------------------------
         VALIDATION
         ------------------------- */

      if (!email || !password) {

        showMessage(
          loginMessage,
          "Email এবং Password দিন।",
          "error"
        );

        return;
      }


      showMessage(
        loginMessage,
        "Login হচ্ছে..."
      );


      try {

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        console.log(
          "Khuje Pao Login Success:",
          user.uid
        );


        showMessage(
          loginMessage,
          "✅ সফলভাবে Login হয়েছে।",
          "success"
        );


      } catch (error) {

        console.error(
          "KHUJE PAO LOGIN ERROR",
          error
        );


        const friendlyMessage =
          getFirebaseErrorMessage(error);


        const debugText =
          `${friendlyMessage}

Error Code: ${error?.code || "unknown"}

Error Message: ${error?.message || "No message"}`;


        showMessage(
          loginMessage,
          debugText,
          "error"
        );

      }

    }
  );

}


/* =========================================================
   PASSWORD RESET
   ========================================================= */

window.resetPassword = async function () {

  const email =
    $("loginEmail")?.value.trim();


  if (!email) {

    showMessage(
      loginMessage,
      "প্রথমে আপনার Email লিখুন।",
      "error"
    );

    return;
  }


  showMessage(
    loginMessage,
    "Password reset email পাঠানো হচ্ছে..."
  );


  try {

    await sendPasswordResetEmail(
      auth,
      email
    );


    showMessage(
      loginMessage,
      "✅ Password reset email পাঠানো হয়েছে।",
      "success"
    );


  } catch (error) {

    console.error(
      "KHUJE PAO PASSWORD RESET ERROR",
      error
    );


    const friendlyMessage =
      getFirebaseErrorMessage(error);


    const debugText =
      `${friendlyMessage}

Error Code: ${error?.code || "unknown"}

Error Message: ${error?.message || "No message"}`;


    showMessage(
      loginMessage,
      debugText,
      "error"
    );

  }

};


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async () => {

      try {

        await signOut(auth);

      } catch (error) {

        console.error(
          "KHUJE PAO LOGOUT ERROR",
          error
        );

        alert(
          "Logout করা যায়নি।"
        );

      }

    }
  );

}


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
  auth,
  (user) => {

    console.log(
      "Khuje Pao Auth State:",
      user
    );


    if (user) {

      /*
       User logged in
      */

      if (authArea) {
        authArea.classList.add("hidden");
      }

      if (userArea) {
        userArea.classList.remove("hidden");
      }


      if (userInfo) {

        const email =
          user.email ||
          "Anonymous User";

        userInfo.textContent =
          `Email: ${email}

UID: ${user.uid}`;

      }


    } else {

      /*
       User logged out
      */

      if (authArea) {
        authArea.classList.remove("hidden");
      }

      if (userArea) {
        userArea.classList.add("hidden");
      }

      showLogin();

    }

  }
);


/* =========================================================
   STARTUP CHECK
   ========================================================= */

console.log(
  "Khuje Pao Firebase Authentication initialized."
);

console.log(
  "Firebase Auth object:",
  auth
);