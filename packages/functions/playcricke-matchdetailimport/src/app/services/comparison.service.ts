// Imports
import { Observable, from, map, filter } from 'rxjs';
import { MatchList } from '@navestockcricketclub/match-interfaces';
export class ComparisonService {
  /**
   * Matchs list comparison orchestrator
   * @param pubSubMatchListData
   * @param currentMatchListData
   * @returns observable<number> stream of match id's for matches to update
   * @returns completes without emitting a value:
   * 1. if season attributes in array are equal
   * 2. if all items in the array are found and all items found are equal
   */
  public matchListComparisonOrchestrator(
    pubSubMatchListData: MatchList,
    currentMatchListData: MatchList
  ): Observable<number> {
    
    let compObserver:Observable<number>;
    
    
    
    /*
     ** Validate if seasons in the comparison are equal
     ** If seasons are not equal do comparison of arrays's
     ** If seasons are equal don't do comparison of arrays
     */
  if (pubSubMatchListData == currentMatchListData) {
    /*
    ** Matchlist are equal, create observable and complete observable
    */
    compObserver = new Observable((subscriber) => {
          subscriber.complete();
        });
  } else {
    compObserver = from(pubSubMatchListData.matches) // create observable from array
    .pipe(
        map((m) => {
        let respVal = undefined;    
        const findMatchId =  currentMatchListData.matches.find(
            (currentMatch) => currentMatch.id === m.id
          )
        if(findMatchId === undefined){
            respVal = m;
        } else if(findMatchId.last_updated !== m.last_updated){
            respVal = m;
        } else {
            respVal = undefined;
        }
        return respVal;
        }
        ),
        filter((mtchDescription) => mtchDescription !== undefined),
        map((mtchDescription) => mtchDescription.id),
      );
    }
  
return compObserver;

}
} 