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
const logoutBtn = $("logoutBtn");
const authMessage = $("authMessage");
const userInfo = $("userInfo");

function message(text, type = "info") {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.dataset.type = type;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    if (!email || !password) {
      message("ইমেইল ও পাসওয়ার্ড দিন।", "error");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      message("সফলভাবে Login হয়েছে।", "success");
    } catch (error) {
      console.error(error);
      message("Login করা যায়নি। তথ্যগুলো পরীক্ষা করুন।", "error");
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("registerEmail").value.trim();
    const password = $("registerPassword").value;
    const confirmPassword = $("registerConfirmPassword").value;

    if (!email || !password || !confirmPassword) {
      message("সব তথ্য পূরণ করুন।", "error");
      return;
    }

    if (password !== confirmPassword) {
      message("দুইটি পাসওয়ার্ড একই নয়।", "error");
      return;
    }

    if (password.length < 6) {
      message("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", "error");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      message("Account সফলভাবে তৈরি হয়েছে।", "success");
    } catch (error) {
      console.error(error);
      message("Account তৈরি করা যায়নি।", "error");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      message("Logout হয়েছে।", "success");
    } catch (error) {
      console.error(error);
      message("Logout করা যায়নি।", "error");
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (userInfo) {
      userInfo.textContent =
        `Logged in: ${user.email || "Guest User"}`;
    }

    if (logoutBtn) {
      logoutBtn.hidden = false;
    }
  } else {
    if (userInfo) {
      userInfo.textContent = "আপনি এখনো Login করেননি।";
    }

    if (logoutBtn) {
      logoutBtn.hidden = true;
    }
  }
});

window.resetPassword = async function () {
  const email = $("loginEmail")?.value.trim();

  if (!email) {
    message("প্রথমে আপনার ইমেইল লিখুন।", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    message(
      "Password reset email পাঠানো হয়েছে।",
      "success"
    );
  } catch (error) {
    console.error(error);
    message(
      "Password reset email পাঠানো যায়নি।",
      "error"
    );
  }
};