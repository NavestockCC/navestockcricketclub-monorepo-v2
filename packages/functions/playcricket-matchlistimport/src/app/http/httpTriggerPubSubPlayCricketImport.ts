/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Function to trigger Import of Play Crricket Match List Data.
 * @description The function publishes {season: ??} to Match_List_Import PubSup topic
 * @description matchListImport Function subscribes to Match_List_Import. Will use the season data to start import of PlayCricket Data.
 *
 */
import {onRequest} from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';

import { PublishPubSubMessage } from '@navestockcricketclub-monorepo-v2/services-publishpubsubmessages'



export const httpPublishPlayCricetSeasonToImport = onRequest(
  { timeoutSeconds: 120, region: ['europe-west2'] },
  async (req, res) => {

      // Retrieve data from season Param, then package to {JSON} message and push to buffer.
      if (req.query.season === undefined){
        const d = new Date();
        req.query.season = d.getFullYear().toString();
      }

      const seasonToImport = req.query.season;
      const data = JSON.stringify({ season: seasonToImport });
      const publishMes = new PublishPubSubMessage();
      publishMes.publishPubSubMessage('Match_List_Import', data)
      .subscribe({
        next: (v) => {
          logger.info( `PubSub Message ${v} published to topic Match_List_Import`);
          res.send(`Message ${v} published to Match_List_Import`);
        },
        error: (e) => {
          logger.debug(JSON.stringify(e));
          res.send(JSON.stringify(e));
        },
        complete: () => logger.debug('published to topic Match_List_Import complete'),
      });
  }
);