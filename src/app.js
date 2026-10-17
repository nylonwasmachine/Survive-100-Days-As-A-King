
const form = document.getElementById("authForm");
const modeButton = document.getElementById("modeButton");
const submitButton = document.getElementById("submitButton");
const displayName = document.getElementById("displayName");
const statusText = document.getElementById("status");

const authView = document.getElementById("authView");
const accountView = document.getElementById("accountView");

let mode = "signup";
let busy = false;

function showStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.className = isError ? "error" : "success";
}

function showAccount(user) {
  if (!user) {
    authView.hidden = false;
    accountView.hidden = true;
    return;
  }

  authView.hidden = true;
  accountView.hidden = false;

  document.getElementById("playerName").textContent =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "King";

  document.getElementById("playerEmail").textContent =
    user.email || "";
}

function setMode(nextMode) {
  mode = nextMode;
  const isSignup = mode === "signup";

  displayName.hidden = !isSignup;
  displayName.required = isSignup;
  displayName.previousElementSibling.hidden = !isSignup;

  submitButton.textContent = isSignup
    ? "Account aanmaken"
    : "Inloggen";

  document.getElementById("password").autocomplete =
    isSignup ? "new-password" : "current-password";

  modeButton.textContent = isSignup
    ? "Heb je al een account? Inloggen"
    : "Nieuw? Maak een account aan";

  showStatus("");
}

modeButton.addEventListener("click", () => {
  setMode(mode === "signup" ? "login" : "signup");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;

  busy = true;
  submitButton.disabled = true;
  showStatus("Even geduld...");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = displayName.value.trim();

  try {
    const result = mode === "signup"
      ? await Auth.signUp(email, password, name)
      : await Auth.signIn(email, password);

    if (result.error) throw result.error;

    if (mode === "signup" && !result.data.session) {
      showStatus(
        "Account aangemaakt! Controleer je e-mail om je account te bevestigen."
      );
    } else if (result.data.user) {
      showAccount(result.data.user);
      showStatus("Welkom in je koninkrijk!");
    }
  } catch (error) {
    showStatus(
      error.message || "Er ging iets mis. Probeer het opnieuw.",
      true
    );
  } finally {
    busy = false;
    submitButton.disabled = false;
  }
});

document.getElementById("logoutButton").addEventListener(
  "click",
  async () => {
    const { error } = await Auth.signOut();

    if (error) {
      showStatus(error.message, true);
      return;
    }

    showAccount(null);
    showStatus("Je bent uitgelogd.");
  }
);

// Herstel een bestaande sessie en blijf op de hoogte.
window.sb.auth.onAuthStateChange((_event, session) => {
  showAccount(session?.user ?? null);
});

window.sb.auth.getSession().then(({ data, error }) => {
  if (error) {
    showStatus("Je sessie kon niet worden geladen.", true);
    return;
  }
  showAccount(data.session?.user ?? null);
});
