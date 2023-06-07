
/* Firebase Imports */
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';

/* RXJS Imports */
import { filter, map, switchMap } from 'rxjs/operators';
import { forkJoin, lastValueFrom } from 'rxjs';

/* Service Imports */
import { PublishPubSubMessage } from '@navestockcricketclub-monorepo-v2/services-publishpubsubmessages';
import { servicesMatchFirestoredb } from '@navestockcricketclub-monorepo-v2/services-match-firestoredb';
import { PlayCricketMatchAPICall } from '@navestockcricketclub-monorepo-v2/services-playcricketapi';

/* Interface Imports */
import { PlaycricketAPIRespone_Matchlist } from '@navestockcricketclub-monorepo-v2/interface-playcricket';
import { MatchList } from '@navestockcricketclub-monorepo-v2/interfaces-match';


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
        ) {seasonToImport = new Date().getFullYear().toString();} 
        else if (typeof msgPayload.data.message.json.season === 'string') {
          seasonToImport = msgPayload.data.message.json.season;
        } else if (typeof msgPayload.data.message.json.season === 'number') {
          seasonToImport = msgPayload.data.message.json.season.toString();
        } else {
          seasonToImport = new Date().getFullYear().toString();
        }
    
        const PCAPICall = new PlayCricketMatchAPICall();
        const psMessage = new PublishPubSubMessage();
        const matchListDB = new servicesMatchFirestoredb();
    
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
          map((ApiResp) => <PlaycricketAPIRespone_Matchlist>ApiResp.data),
          filter(ApiRespData => ApiRespData.matches !== undefined || ApiRespData.matches.length > 0 ),
          map( ApiRespData => <MatchList>ApiRespData),
          switchMap((matchList) =>
            forkJoin({
              //Write matchlist to pubsub
              matchListPubsubPublish: psMessage.publishPubSuMessage(
                'PlayCricket_Match_List_Data',
                matchList
              ),
              // write matchlist to FirestoreDB
              matchListDBWrite: matchListDB.setMatchlist(matchList)
            })
          )
        );
        /**
         * Resolve function performing the asynchronous processing
         * (also known as "background functions") by returning a JavaScript promise.
         */
        return await lastValueFrom(getPCMactchLlistPS)
                      .catch(
                        e => logger.error(`getPlayCricketMatchListPubSub: ${e}`)
                      );
  }

)
