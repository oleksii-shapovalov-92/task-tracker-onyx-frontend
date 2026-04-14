let accessToken: string | undefined;

export const authAccessToken = {
  get: (): string | undefined => accessToken,
  set: (value: string | undefined): void => {
    accessToken = value;
  },
};
