/**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description BackgroundFunction to trigger by publishing data<MatchId> to [Match_Detail_Import] PubSub Topic.
 * @description The function takes the MatchId and retrieved Match Details from the PlayCricket API
 * @description Data retrieved from the Play Cricket Api is transformed in to an Object:Match and written to the Firestore FixtureList collection
 */


/* Firebase Imports */
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';

/* RXJS Imports */
import { filter, forkJoin, lastValueFrom, map, mergeMap, switchMap } from 'rxjs';


/* Interface Imports */
import { PlayCricketMatchDetail } from '@navestockcricketclub-monorepo-v2/interface-playcricket';
import { Match } from '@navestockcricketclub-monorepo-v2/interfaces-match';

/* Service Imports */
import { PlayCricketMatchAPICall } from '@navestockcricketclub-monorepo-v2/services-playcricketapi';
import { servicesMatchFirestoredb } from '@navestockcricketclub-monorepo-v2/services-match-firestoredb';
import {MatchInterfaceServices} from '@navestockcricketclub-monorepo-v2/services-matchinterface';





export const getPlayCricketMatchDetailPubSub = onMessagePublished(
  {topic: "Match_Detail_Import",
  region: "europe-west2",
  timeoutSeconds: 60
  },
async (msgPayload) => {
    const MLI = new servicesMatchFirestoredb();
    const PCAPICall = new PlayCricketMatchAPICall();
    const matchInterfaceServices = new MatchInterfaceServices();

    /**
     * Ensure matchId is a string
     */
    let matchID = '';
    if (typeof msgPayload.data.message.json.matchid === 'string') {
      matchID = msgPayload.data.message.json.matchid;
    } else if (typeof msgPayload.data.message.json.matchid === 'number') {
      matchID = msgPayload.data.message.json.matchid.toString();
    }

    /**
     * Observable to
     * 1. get detailed match information from PlayCricket API
     * 2. then extract the match details from the Payload data
     * 3. format the data into a Match interface Object
     * 4. write the Match data to the Firestore collection FixtureList.<Match ID>
     */
    const getPCMatchDetail = PCAPICall.getPlayCricketApiMatch_Detail(
      matchID
    ).pipe(
      filter(ApiResp => 'data' in ApiResp === true),
      filter(ApiResp=> ApiResp.data.match_details !== undefined || ApiResp.data.match_details.length > 0 ),
      map((ApiResp) => <PlayCricketMatchDetail>ApiResp.data.match_details[0]),
      mergeMap(
        (PlayCricketMatchDetail$) => forkJoin(
          {
          description: matchInterfaceServices.updateMatchDescription_Observable(PlayCricketMatchDetail$),
          innings: matchInterfaceServices.innings_Observablev(PlayCricketMatchDetail$),
          team: matchInterfaceServices.teams_Observablev(PlayCricketMatchDetail$)
        }
        )
      ),
      map(Match$ => <unknown>Match$ ),
      map( Match$ => <Match>Match$),
      switchMap((mData) => MLI.updateMatchDetails(mData))
    );

    return await lastValueFrom(getPCMatchDetail).catch(
      e => logger.error(`getPlayCricketMatchDetailPubSub: ${e}`)
    );
  });
