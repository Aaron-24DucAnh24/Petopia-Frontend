import { serverGet } from './server-http';

export const getGoogleAuthClientIdServer = () =>
  serverGet<string>('/Authentication/GoogleAuthClientId');
