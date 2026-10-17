
const Auth = {
  async signUp(email, password, displayName) {
    return window.sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        },
        emailRedirectTo:
          window.location.href.split("?")[0]
      }
    });
  },

  async signIn(email, password) {
    return window.sb.auth.signInWithPassword({
      email,
      password
    });
  },

  async signOut() {
    return window.sb.auth.signOut();
  }
};

window.Auth = Auth;
