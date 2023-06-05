import {PlayCricketMatchDetail_TestData, MatchDetail_TestResultData, MatchDescription_Data, Teams_Testdata} from "./matchdetails.mockdata.spec"
import {
  Observable,
  first,
  firstValueFrom
} from 'rxjs';
import { MatchInterfaceServices } from './services-matchinterface';

import { Timestamp } from 'firebase-admin/firestore';

describe('MatchInterfaceServices', () => {
  let observableTest: Observable<any>;

  const MIS = new MatchInterfaceServices();

/*
*******************************************************
***************** Utility Functions *******************
*******************************************************
*/
  describe('Utility Functions', () => {
 
/*
***************** setNavestockAndOppositionAttributes *****************
*/ 
    const setNavestockAndOppositionAttributes_cases = [
      {
        matchDescription_input: MatchDescription_Data,
        matchDescription_output: {
          ...MatchDescription_Data,
          navestock_club_name: 'Navestock CC',
          navestock_team_name: '1st XI',
          navestock_team_id: '204935',
          navestock_club_id: '4513',
          opposition_club_id: '10532',
          opposition_club_name: 'East Hanningfield and Great Burstead CC',
          opposition_team_id: '138395',
          opposition_team_name: '1st XI',
          home_team_isNavestock: true,
        },
      },
    ];

    test.each(setNavestockAndOppositionAttributes_cases)(
      'should add navestock and opposition attributes',
      ({ matchDescription_input, matchDescription_output }) => {
        expect(
          MIS.setNavestockAndOppositionAttributes(matchDescription_input)
        ).toStrictEqual(matchDescription_output);
      }
    );

/*
***************** updateStringDateToFirebaseTimestamp *****************
*/
    const updateStringDateToFirebaseTimestamp_data: {
      date_String: string;
      time_String: string | undefined;
      time_Stamp: Timestamp;
    }[] = [
      {
        date_String: PlayCricketMatchDetail_TestData[0].match_date!,
        time_String: PlayCricketMatchDetail_TestData[0].match_time!,
        time_Stamp:
          MatchDetail_TestResultData[0].description
            .match_date_timestamp!,
      },
      {
        date_String: PlayCricketMatchDetail_TestData[0].last_updated!,
        time_String: undefined,
        time_Stamp:
          MatchDetail_TestResultData[0].description
            .last_updated_timestamp!,
      },
    ];


    test.each(updateStringDateToFirebaseTimestamp_data)(
      'should return a valid Firebase Timestamp. Case %s',
      ({ date_String, time_String, time_Stamp }) => {
        expect(
          MIS.updateStringDateToFirebaseTimestamp(date_String, time_String)
        ).toStrictEqual(time_Stamp);
      }
    );

    const isNavestockHomeTeam_cases = [
      { clubId: '4513', isNavestockHomeTeam: true },
      { clubId: '0000', isNavestockHomeTeam: false },
    ];

/*
***************** isNavestockHomeTeam *****************
*/
    test.each(isNavestockHomeTeam_cases)(
      'should evaluates the home_club_id to see if it equal to 4513 Which is the Navestock Playcrick club id. Case %s',
      ({ clubId, isNavestockHomeTeam }) => {
        expect(MIS.isNavestockHomeTeam(clubId)).toBe(isNavestockHomeTeam);
      }
    );
  });


/*
*******************************************************
***************** Innings functions *******************
*******************************************************
*/   
  describe.each([
    {
      playcricketInnings_test: PlayCricketMatchDetail_TestData[0].innings![0],
      playcricketInnings_Result:
        MatchDetail_TestResultData[0].innings![0],
      teams_test: Teams_Testdata,
      matchId_Test: PlayCricketMatchDetail_TestData[0].id!,
    },
    {
      playcricketInnings_test: PlayCricketMatchDetail_TestData[0].innings![1],
      playcricketInnings_Result:
        MatchDetail_TestResultData[0].innings![1],
      teams_test: Teams_Testdata,
      matchId_Test: PlayCricketMatchDetail_TestData[0].id!,
    },
  ])(
    'Innings functions',
    ({
      playcricketInnings_test,
      playcricketInnings_Result,
      teams_test,
      matchId_Test,
    }) => {

/*
***************** Innings.description *****************
*/        
        test('should Update the Innings.description.', async () => {
        const inningsDescription_TestData_Observable = MIS.innings_description(
          teams_test,
          matchId_Test,
          playcricketInnings_test
        ).pipe(
          first()
        );
        const observabelTestCase_innings_description = await firstValueFrom(
          inningsDescription_TestData_Observable
        );
        expect(observabelTestCase_innings_description).toStrictEqual(
          playcricketInnings_Result.description
        );
      });

/*
***************** Innings.bat *****************
*/
      test('should Update the Innings.bat', async () => {
        const inningsBat_TestData_Observable = MIS.inningsBat(
          teams_test,
          matchId_Test,
          playcricketInnings_test
        ).pipe(
          first()
        );
        const observabelTestCase_inningsBat = await firstValueFrom(
          inningsBat_TestData_Observable
        );
        expect(observabelTestCase_inningsBat).toStrictEqual(
          playcricketInnings_Result.bat
        );
      });

/*
***************** Innings.bowl *****************
*/ 
      test('should Update the Innings.bowl', async () => {
        const inningsBowl_TestData_Observable = MIS.inningBowl(
          teams_test,
          matchId_Test,
          playcricketInnings_test
        ).pipe(
          first()
        );
        const observabelTestCase_inningsBowl = await firstValueFrom(
          inningsBowl_TestData_Observable
        );
        expect(observabelTestCase_inningsBowl).toStrictEqual(
          playcricketInnings_Result.bowl
        );
      });
/*
***************** Innings.fow *****************
*/ 
      test('should Update the Innings.fow', async () => {
        const inningsFOW_TestData_Observable = MIS.inningFallOfWickets(
          teams_test,
          matchId_Test,
          playcricketInnings_test
        ).pipe(
          first()
        );
        const observabelTestCase_inningFallOfWickets = await firstValueFrom(
          inningsFOW_TestData_Observable
        );
        expect(observabelTestCase_inningFallOfWickets).toStrictEqual(
          playcricketInnings_Result.fow
        );
      });
    }
  );

/*
*******************************************************
***************** Match functions *******************
*******************************************************
*/   
  describe.each([
    {
      playcricketMatch_test: PlayCricketMatchDetail_TestData[0],
      match_Result: MatchDetail_TestResultData[0],
    },
  ])('Match Functions', ({ playcricketMatch_test, match_Result }) => {
    
/*
***************** updateMatchDescription_Observable ******************
*/
    test('should Return MatchDescription object.', async () => {
      observableTest = MIS.updateMatchDescription_Observable(
        playcricketMatch_test
      ).pipe(first());
      const observabelTestCase_updateMatchDescription = await firstValueFrom(
        observableTest
      );
      expect(observabelTestCase_updateMatchDescription).toStrictEqual(
        match_Result.description
      );
    });

/*
***************** innings_Observablev *****************
*/   
    test('should return an Innings object', async () => {
      const inningDObserv = MIS.innings_Observablev(playcricketMatch_test);
      const inningDataObserv = await firstValueFrom(inningDObserv);
      expect(inningDataObserv).toStrictEqual(match_Result.innings);
    });


    /*
***************** teams_Observablev *****************
*/   
test('should return an Teams object', async () => {
    const teamsObserv = MIS.teams_Observablev(playcricketMatch_test);
    const inningDataObserv = await firstValueFrom(teamsObserv);
    expect(inningDataObserv).toStrictEqual(match_Result.teams);
  });


  });
});
