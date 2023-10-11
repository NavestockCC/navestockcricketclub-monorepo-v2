import {initializeApp, applicationDefault } from 'firebase-admin/app';


/**  
 * Import: PlayCricket Match List Import Functions
 * */

import * as HttpTriggerPlayCricetMatchDetailImport from './app/http/httpTriggerPubSubPlayCricketImport'
import * as GetPlayCricketMatchDetailPubSub from './app/pubsub/getPlayCricketMatchDetails';
import * as PlaycricketMatchListCompare from './app/pubsub/playcricketMatchListCompare';

initializeApp({
  credential: applicationDefault(),
  });


/** 
 * PlayCricket MatchList Import Functions : Import matchlist from PlayCricket API 
 * */

export const httptriggerplaycricetmatchdetailimport = HttpTriggerPlayCricetMatchDetailImport.httpPublishPlayCricetMatchToImport;
export const getplaycricketmatchdetailpubsub = GetPlayCricketMatchDetailPubSub.getPlayCricketMatchDetailPubSub;
export const playcricketmatchlistcompare = PlaycricketMatchListCompare.comparePlayCricketMatchListPubSub;
