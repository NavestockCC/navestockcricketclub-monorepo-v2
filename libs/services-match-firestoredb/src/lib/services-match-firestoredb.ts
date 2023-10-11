import { getFirestore, WriteResult } from 'firebase-admin/firestore';
import { from, map, Observable } from 'rxjs';

import {
  Match,
  MatchList,
} from '@navestockcricketclub-monorepo-v2/interfaces-match';



export class servicesMatchFirestoredb {
  afs = getFirestore();



  
  /**
   * Sets match list data in Firestore collection 'MatchList'
   * @date 19/02/2023 - 15:52:43
   *
   * @public 
   * @param {*} matchlist
   * @returns {Observable<WriteResult>}
   */
  public setMatchlist(matchlist: MatchList): Observable<WriteResult> {
    const afs = getFirestore();
    const collectionDB = 'MatchList';

    if (matchlist.season === undefined) {
      matchlist.season = new Date().getFullYear().toString();
    }
    const documentDB = matchlist.season;
    return from(afs.collection(collectionDB).doc(documentDB).set(matchlist, { merge: true }));
  }

  /**
   * Gets match list import data
   * @param seasonImport
   * @returns match list import data
   */
  public getMatchListImportData(seasonImport: string): Observable<MatchList> {
    const matchListImportDoc = this.afs
      .collection('MatchListImport')
      .doc(seasonImport);

    const matchListImportDB = from(matchListImportDoc.get());

    return matchListImportDB.pipe(
      map((resp) => {
        let returnML: MatchList = {};
        if (resp.exists) {
          returnML = resp.data() as MatchList;
        } else {
          returnML = {
            season: seasonImport,
            matches: [],
          };
        }
        return returnML;
      })
    );
  }

  /**
   * Sets match list import in Firestore collection 'MatchListImport'
   * @param matchList
   * @param seasonImport
   * @returns firebase WriteResult
   */
  public setMatchListImportData(
    matchList: MatchList,
    seasonImport: string
  ): Observable<WriteResult> {
    const matchListImportDoc = this.afs
      .collection('MatchListImport')
      .doc(seasonImport);
    return from(matchListImportDoc.set(matchList, { merge: true }));
  }

  /**
   * Updates match details
   * @param match
   * @returns match details
   */
  public updateMatchDetails(match: Match): Observable<WriteResult> {
    const matchDetailDoc = this.afs
      .collection('FixtureList')
      .doc(match.description.id.toString());
    return from(matchDetailDoc.set(match, { merge: true }));
  }
}
