import * as functions from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';

export const apihello = functions.https.onRequest(
  { timeoutSeconds: 90, region: ['europe-west2'] },
  (request, response) => {
    response.send('Hello from Navestock Cricket Club API');
  }
);

initializeApp({
  //credential: admin.credential.applicationDefault(),
});
