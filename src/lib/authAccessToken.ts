export const authAccessToken = {
  get: (): undefined => undefined,

  set: (): void => {
    // Production approach:
    // Frontend does not store JWT in localStorage, sessionStorage or JS memory.
    // Backend stores auth tokens in HttpOnly cookies.
  },
};
