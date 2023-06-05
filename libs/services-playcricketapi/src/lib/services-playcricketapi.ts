import axios from 'axios';
import { from, map, Observable, tap } from 'rxjs';
import * as playcricketCert from "../../../../environments/PlayCricket";
import {AXIOSAPIRespone_MatchDetailPlayCricket, AXIOSAPIRespone_MatchlistPlaycricket } from '@navestockcricketclub-monorepo-v2/interface-playcricket'

const playcricketCredentials = {
    "apitoken" : playcricketCert.firebaseAuthData.api_token,
    "site_id" : playcricketCert.firebaseAuthData.site_id
}



export class PlayCricketMatchAPICall{
    public getPlayCricketApiMatch_List(seasonID: string): Observable<AXIOSAPIRespone_MatchlistPlaycricket> {
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
        map(APIResp => APIResp as AXIOSAPIRespone_MatchlistPlaycricket)
        );
      }



  public getPlayCricketApiMatch_Detail(matchID: string): Observable<AXIOSAPIRespone_MatchDetailPlayCricket> {
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
        })),
        map(APIResp => APIResp as AXIOSAPIRespone_MatchDetailPlayCricket)
      );
    }
}