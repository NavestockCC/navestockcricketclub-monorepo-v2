/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Function to trigger Import of Play Crricket Data.
 * @description The function publishes {season: ??} to Match_List_Import PubSup topic
 * @description matchListImport Function subscribes to Match_List_Import. Will use the season data to start import of PlayCricket Data.
 *
 */

import * as functions from 'firebase-functions';
import { PublishPubSubMessage } from '@navestockcricketclub-monorepo-v2/services-publishpubsubmessages'


export const httpPublishPlayCricetMatchToImport = functions
.region('europe-west2')
.runWith({ memory: '128MB', timeoutSeconds: 120 })
.https
.onRequest(
  async (req, res) => {

      // Retrieve data from season Param, then package to {JSON} message and push to buffer.
      if (req.query.mid === undefined){
        const d = new Date();
        req.query.season = d.getFullYear().toString();
      }

      const matchToImport = req.query.mid;
      const data = JSON.stringify({matchid: matchToImport});
      const publishMes = new PublishPubSubMessage();
      publishMes.publishPubSubMessage('Match_Detail_Import', data)
      .subscribe({
        next: (v) => {
          functions.logger.debug( `PubSub Message ${v} published to topic Match_Detail_Import`);
          res.send(`Message ${v} published to Match_Detail_Import`);
        },
        error: (e) => {
          console.error(JSON.stringify(e));
          res.send(JSON.stringify(e));
        },
        complete: () => console.info('published to topic Match_Detail_Import'),
      });
  }
);