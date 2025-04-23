export function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function login(username, password) {
  return username === "user@example.com" && password === "password123";
}
