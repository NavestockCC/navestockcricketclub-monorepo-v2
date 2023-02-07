import {getFirestore, WriteResult} from 'firebase-admin/firestore';
import { Observable,from} from 'rxjs';

export class MatchListDB {


  public addMatchlist(matchlist: any): Observable<WriteResult> {
    const afs = getFirestore();
    const collectionDB = 'MatchList';


    if (matchlist.season === undefined) {
      matchlist.season = new Date().getFullYear();
    }

    const documentDB = matchlist.season;

    return from(afs.collection(collectionDB).doc(documentDB).set(matchlist))
  }
}
