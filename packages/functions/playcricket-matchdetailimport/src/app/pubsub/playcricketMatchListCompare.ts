 /**
 * Navestock Firebase Function
 * @author Lefras Coetzee
 * @description BackgroundFunction to trigger by publishing data<MatchList> to [PlayCricket_Match_List_Data] PubSub Topic.
 * @description The function takes the PubSub MatchList data and compares it to 
 * @description the last imported MatchList data stored in the Firestore collection MatchListImport.
 * @description The Match ID of all new or changed matches found in the comparison will be published to Match_Detail_Import PubSub Topic
 * @description After all new or changed matches Match ID's where published the MatchList data is written to the Firestore collection MatchListImport
 */


/* Firebase Imports */
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';

/* Service Imports */
import { MatchList } from '@navestockcricketclub-monorepo-v2/interfaces-match';
import { ComparisonService } from '../services/comparison.service';
import { servicesMatchFirestoredb } from '@navestockcricketclub-monorepo-v2/services-match-firestoredb';
import { PublishPubSubMessage } from '@navestockcricketclub-monorepo-v2/services-publishpubsubmessages';

/* RXJS Imports */
import {  mergeMap, map, concat, lastValueFrom } from 'rxjs';

/**
 * PubSub trigger to compare MatchList from PlayCricket with MatchList last imported
 * Publishes a list of PubSub messages for matches which need updating
 */
export const comparePlayCricketMatchListPubSub = onMessagePublished(
  {topic: "PlayCricket_Match_List_Data", 
  region: "europe-west2",
  timeoutSeconds: 60
  }, 
async (msgPayload) => {
      const payloadData = msgPayload.data.message.json as MatchList;
      const seasonToImport: string = payloadData.season;
      const compServ = new ComparisonService();
      const mlDB = new servicesMatchFirestoredb();
      const pubSubWrite = new PublishPubSubMessage();


 /**
  * Observable which runs the comparison between the 
  * PlayCricket API payload data and 
  * the MatchListImport data stored in teh DB
  * 
  * For all  new or changed matches the Observible will 
  * publish an JSON object {"matchid": <matchToImport>}
  * to Match_Detail_Import PubSub
  */     
      const matchesToUpdate = mlDB
        .getMatchListImportData(seasonToImport)
        .pipe(
          mergeMap((mlData) =>
            compServ.matchListComparisonOrchestrator(payloadData, mlData)
          ),
          map(matchToImport => JSON.stringify({"matchid": matchToImport})),
          mergeMap((matchToImport) =>
            pubSubWrite.publishPubSuMessage(
              'Match_Detail_Import',
              matchToImport
            )
          )
        );



 /**
  * Observabel to write the PlayCricket API payload data to
  * the Firestore collection MatchListImport
  */       
      const  matchListImportDB = mlDB
      .setMatchListImportData(payloadData, seasonToImport);


/**
 * Execute the comparison and Firetore update Observables 
 */
    const compareMatchList = concat(
      matchesToUpdate,
      matchListImportDB
  );


/**
 * Resolve function performing the asynchronous processing 
 * (also known as "background functions") by returning a JavaScript promise.
 */
    return await lastValueFrom(compareMatchList).catch(
      e => logger.debug(`comparePlayCricketMatchListPubSub: ${e}`)
    );


  });
