import {initializeApp, applicationDefault } from 'firebase-admin/app';


/**  
 * Import: PlayCricket Match List Import Functions
 * */

import * as HttpTriggerPlayCricetImport from './app/http/httpTriggerPubSubPlayCricketImport';
import * as GetPlayCricketMatchListPubSub from './app/pubsub/getPlayCricketMatchList';


initializeApp({
  credential: applicationDefault(),
  });


/** 
 * PlayCricket MatchList Import Functions : Import matchlist from PlayCricket API 
 * */

export const httptriggerplaycricetimport = HttpTriggerPlayCricetImport.httpPublishPlayCricetSeasonToImport;
export const getplaycricketmatchlistpubsub = GetPlayCricketMatchListPubSub.getPlayCricketMatchListPubSub;