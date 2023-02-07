

import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';

import { PlayCricketMatchListAPICall } from '@navestockcricketclub-monorepo-v2/services-playcricketapi';
import { MatchListDB } from '../services/MatchList_DB_service';
import { PublishPubSubMessage } from '@navestockcricketclub-monorepo-v2/services-publishpubsubmessages';
import { filter, map, switchMap } from 'rxjs/operators';
import { MatchList } from '@navestockcricketclub-monorepo-v2/interfaces-match';
import { forkJoin, lastValueFrom } from 'rxjs';



/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description Function to pull Match List from the PlayCricket API.
 * @description The function is triggered from the 'Match_List_Import' PubSup topic
 * @description The function performs the following actions:
 *  1. get Matchlist from PlayCricket API
 *  2. extract the MatchList data from the API payload
 *  3. map the payload data to interface type MatchList
 *  4. publishes the MatchList data to PlayCricket_Match_List_Data PubSub
 *  5. writes the MatchList data to Firestore collection MatchList.<season>
 * @description Max: 150 matches in a season !!!
 */



export const getPlayCricketMatchListPubSub = onMessagePublished(
  {topic: "Match_List_Import",
  region: "europe-west2",
  timeoutSeconds: 60
  },
  async (msgPayload) => {
        /**
     * Retrieve Season from PubSub: Match_List_Import payload data
     * Validate that the PayLoad data contains a valid Season
     * If not extract the current Year as the season
     */
        logger.info('Starting getPlayCricketMatchListPubSub');
        let seasonToImport: string;

        if (
          'season' in msgPayload.data.message.json === false ||
          msgPayload.data.message.json.season === undefined
        ) {
          seasonToImport = new Date().getFullYear().toString();
        } else if (typeof msgPayload.data.message.json.season === 'string') {
          seasonToImport = msgPayload.data.message.json.season;
        } else if (typeof msgPayload.data.message.json.season === 'number') {
          seasonToImport = msgPayload.data.message.json.season.toString();
        } else {
          seasonToImport = new Date().getFullYear().toString();
        }
    
        const PCAPICall = new PlayCricketMatchListAPICall();
        const psMessage = new PublishPubSubMessage();
        const matchListDB = new MatchListDB();
    
        /**
         * Observable to:
         * 1. get Matchlist from PlayCricket API
         * 2. extract the MatchList data from the API payload
         * 3. map the paylopad data to interface object MatchList
         * 4.write the MatchList data to PlayCricket_Match_List_Data PubSub
         * 5.write the MatchList data to Firestore collection MatchList.<season>
         */
        const getPCMactchLlistPS = PCAPICall.getPlayCricketApiMatch_List(
          seasonToImport
        ).pipe(
          filter(ApiResp => 'data' in ApiResp === true),
          map((ApiResp) => ApiResp.data),
          filter(ApiResp => ApiResp.matches !== undefined || ApiResp.matches.length > 0 ),
          filter(ApiResp => ApiResp.matches.length < 151),
          map(
            (APIResp) =>
              ({
                season: seasonToImport,
                matches: APIResp.matches,
              } as MatchList)
          ),
          switchMap((mtchList) =>
            forkJoin({
              matchListPubsubPublish: psMessage.publishPubSubMessage(
                'PlayCricket_Match_List_Data',
                mtchList
              ),
              matchListDBWrite: matchListDB.addMatchlist(mtchList)
            })
          )
        );
        /**
         * Resolve function performing the asynchronous processing
         * (also known as "background functions") by returning a JavaScript promise.
         */
        return await lastValueFrom(getPCMactchLlistPS)
                      .catch(
                        e => logger.debug(`getPlayCricketMatchListPubSub: ${e}`)
                      );
  }

)
