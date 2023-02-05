import axios from 'axios';
import { from, map, Observable } from 'rxjs';
import * as playcricketCert from "../../../../environments/PlayCricket";
import {MatchDetailPlaycricketAPIRespone, MatchlistPlaycricketAPIRespone } from '@navestockcricketclub-monorepo-v2/interfaces-match'

const playcricketCredentials = {
    "apitoken" : playcricketCert.firebaseAuthData.api_token,
    "site_id" : playcricketCert.firebaseAuthData.site_id
}



export class PlayCricketMatchListAPICall{
    public getPlayCricketApiMatch_List(seasonID: string): Observable<MatchlistPlaycricketAPIRespone> {
        return from(
          axios({
            method: 'get',
            baseURL: 'https://play-cricket.com/api/v2',
            url: 'matches.json',
            responseType: 'json',
            params: {
              site_id: playcricketCredentials.site_id,
              season: seasonID,
              api_token: playcricketCredentials.apitoken,
            }
          })
        ).pipe(
          map((APIResp) => ({
              status: APIResp.status,
              statusText: APIResp.statusText,
              data: { season: seasonID, matches: APIResp.data.matches }}
          )),
        map(APIResp => APIResp as MatchlistPlaycricketAPIRespone)  
        );
      }



  public getPlayCricketApiMatch_Detail(matchID: string): Observable<MatchDetailPlaycricketAPIRespone> {
      return from(
        axios({
          method: 'get',
          baseURL: 'https://play-cricket.com/api/v2',
          url: 'match_detail.json',
          responseType: 'json',
          params: {
            match_id: matchID,
            api_token: playcricketCredentials.apitoken,
          }
        })
      ).pipe(
        map((APIResp) => ({
          status: APIResp.status,
          statusText: APIResp.statusText,
          data: APIResp.data 
        }))
      );
    }
}