import { Timestamp } from 'firebase-admin/firestore';
import { filter, first, forkJoin, last, map, mergeMap, Observable, of, retry, skipWhile, throwIfEmpty, toArray } from 'rxjs';

import {
  MatchDescription,
  InningsDescription,
  Innings,
  Bat,
  Bowl,
  FallOfWickets,
  isInstanceOfMatchDescription,
  Team,
  Player
} from '@navestockcricketclub-monorepo-v2/interfaces-match';

import { inning, PlayCricketMatchDetail, team } from '@navestockcricketclub-monorepo-v2/interface-playcricket';


export class MatchInterfaceServices {

/*
*******************************************************
***************** Utility Functions *******************
*******************************************************
*/

  /**
   * Sets navestock and opposition attributes
   * @param MatchDescription
   * @returns MatchDescription with navestock and opposition attributes
   */
  public setNavestockAndOppositionAttributes(
    matchDescription: MatchDescription
  ): MatchDescription {
    const home_team_isNavestock = this.isNavestockHomeTeam(
      matchDescription.home_club_id
    );

    //PlayCricket sets away_club_id to undefined when home and away club are the same club
    if (matchDescription.away_club_id === undefined) {
      matchDescription.away_club_id = matchDescription.home_club_id;
      matchDescription.away_club_name = matchDescription.home_club_name;
    }

    // set the oposition and navestock team info
    if (home_team_isNavestock === true) {
      matchDescription.home_team_isNavestock = true;
      matchDescription.navestock_club_id = matchDescription.home_club_id;
      matchDescription.navestock_club_name = matchDescription.home_club_name;
      matchDescription.navestock_team_id = matchDescription.home_team_id;
      matchDescription.navestock_team_name = matchDescription.home_team_name;

      matchDescription.opposition_club_id = matchDescription.away_club_id;
      matchDescription.opposition_club_name = matchDescription.away_club_name;
      matchDescription.opposition_team_id = matchDescription.away_team_id;
      matchDescription.opposition_team_name = matchDescription.away_team_name;
    } else {
      matchDescription.home_team_isNavestock = false;
      matchDescription.navestock_club_id = matchDescription.away_club_id;
      matchDescription.navestock_club_name = matchDescription.away_club_name;
      matchDescription.navestock_team_id = matchDescription.away_team_id;
      matchDescription.navestock_team_name = matchDescription.away_team_name;

      matchDescription.opposition_club_id = matchDescription.home_club_id;
      matchDescription.opposition_club_name = matchDescription.home_club_name;
      matchDescription.opposition_team_id = matchDescription.home_team_id;
      matchDescription.opposition_team_name = matchDescription.home_team_name;
    }

    return matchDescription;
  }

  /**
   * Evaluates the 'home_club_id' to see if it equal to 4513 Which is the Navestock Playcrick club id. 
   * @date 30/05/2023 - 11:58:56
   *
   * @public
   * @param {string} home_club_id
   * @returns {boolean}
   */
  public isNavestockHomeTeam(home_club_id: string): boolean {
    let returnVal: boolean;
    if (home_club_id === '4513') {
      returnVal = true;
    } else {
      returnVal = false;
    }
    return returnVal;
  }

  /**
   * Updates string date to firebase timestamp
   * @param dateString
   * @param [timeString]
   * @returns string date to firebase timestamp
   */
  public updateStringDateToFirebaseTimestamp(
    dateString: string,
    timeString?: string
  ): Timestamp {
    //Convert string t date
    const splitDate: string[] = dateString.split('/');

    //If timeString is not defined
    if (timeString === undefined || timeString === '') {
      timeString = '12:00';
    }

    // Create JS Date
    const dateObject = new Date(
      splitDate[2] +
        '-' +
        splitDate[1] +
        '-' +
        splitDate[0] +
        'T' +
        timeString +
        ':00+01:00'
    );

    //Convert JS Date to Firestore Timestamp
    return Timestamp.fromDate(dateObject);
  }

  /**
   * Find the team data {team_id?: '', team_name?: '', club_name?: '', club_id?: '',} from an array of team[]
   * @date 17/04/2023 - 15:27:58
   *
   * @private
   * @param {string} teamId - team to find
   * @param {team[]} teams 
   * @param {boolean} findTeam - if TRUE find the teamId if FALSE find the first team not equal to the teamId
   * @returns {{
      team_id?: '',
      team_name?: '',
      club_name?: '',
      club_id?: '',
    }}
   */
    private find_team(
      teamId: string,
      teams: team[],
      findTeam: boolean
    ): team | undefined {
      if (findTeam === true) {
        const t = teams.find((i) => i.team_id === teamId);
        return t;
      } else {
        const t = teams.find((i) => i.team_id !== teamId);
        return t;
      }
    }
      

/*
*******************************************************
***************** Match functions *******************
*******************************************************
*/


  /**
   * Description placeholder
   * @date 29/05/2023 - 14:57:01
   *
   * @public
   * @param {PlayCricketMatchDetail} match
   * @returns {Observable<MatchDescription>}
   */
  public updateMatchDescription_Observable(
    match: PlayCricketMatchDetail
  ): Observable<MatchDescription> {
    return of(match).pipe(
      //Transform API Match Details to MatchDescription
      filter((match) => isInstanceOfMatchDescription(match) === true),
      map((match$: any) => {
        const newMatchDescription: { [key: string]: any } = {};
        for (const [key, value] of Object.entries<any>(match$)) {
          if (Array.isArray(value) !== true && value !== undefined && value !== '') {
            newMatchDescription[key] = this.attributeTypeCorrection('match_description', value, key);
          }
        }
        return newMatchDescription;
      }),
      map((match) => <MatchDescription>match),
      // Remove all HTM tags from match_notes
      map((mtchData) => {
        if (mtchData.match_notes != undefined) {
          mtchData.match_notes = mtchData.match_notes.replace(/&nbsp;|&amp;/g, ' ');
          mtchData.match_notes = mtchData.match_notes.replace(/<[^>]+>/g, '');
          mtchData.match_notes = mtchData.match_notes.trim();
        }
        return mtchData as MatchDescription;
      }),
      //Set Navestock and Opposition team attributes
      map((mtchData) => {
        return this.setNavestockAndOppositionAttributes(mtchData);
      }),
      //Set date fields to Firebase Timestamps
      map((mtchData) => {
        if (mtchData.last_updated != undefined) {
          mtchData.last_updated_timestamp =
            this.updateStringDateToFirebaseTimestamp(mtchData.last_updated);
        }
        if (mtchData.match_date != undefined) {
          mtchData.match_date_timestamp =
            this.updateStringDateToFirebaseTimestamp(
              mtchData.match_date,
              mtchData.match_time
            );
        }
        return mtchData;
      })
    );
  }

  /**
   * Transform PlayCricketMatchDetail object to Innings[]
   * @date 21/02/2023 - 09:04:31
   *
   * @public
   * @param {PlayCricketMatchDetail} match
   * @returns {Observable<Innings[]>}
   */
  public innings_Observablev(
    match: PlayCricketMatchDetail
  ): Observable<Innings[]> {
    const matchObservable: Observable<PlayCricketMatchDetail> = of(match);

    const teams: team[] = [
      {
        team_name: match.home_team_name,
        team_id: match.home_team_id,
        club_name: match.home_club_name,
        club_id: match.home_club_id,
      },
      {
        team_name: match.away_team_name,
        team_id: match.away_team_id,
        club_name: match.away_club_name,
        club_id: match.away_club_id,
      },
    ];

  const matchId: number =  match.id;

  return matchObservable.pipe(
      filter(
        (PlayCricketMatchDetail$) =>
          Array.isArray(PlayCricketMatchDetail$.innings) === true &&
          PlayCricketMatchDetail$.innings !== undefined &&
          PlayCricketMatchDetail$.innings.length > 0
      ),
      mergeMap((PlayCricketMatchDetail$) => PlayCricketMatchDetail$.innings!),
      mergeMap((inning$) => forkJoin({
          bat: this.inningsBat(teams, matchId, inning$),
          bowl: this.inningBowl(teams, matchId, inning$),
          fow: this.inningFallOfWickets(teams, matchId, inning$),
          description: this.innings_description(teams, matchId, inning$)
        })
    ),
     map( Innings$ => <Innings>Innings$),
     toArray()
     )
  }


  /**
   * Transform PlayCricketMatchDetail object to teams[]
   * @date 21/02/2023 - 09:04:31
   *
   * @public
   * @param {PlayCricketMatchDetail} playcricketMatchDetail
   * @returns {Observable<Team[]>}
   */
  public teams_Observablev(
    playcricketMatchDetail: PlayCricketMatchDetail
  ): Observable<Team[]> {
    const teams: team[] = [
      {
        team_name: playcricketMatchDetail.home_team_name,
        team_id: playcricketMatchDetail.home_team_id,
        club_name: playcricketMatchDetail.home_club_name,
        club_id: playcricketMatchDetail.home_club_id
      },
      {
        team_name: playcricketMatchDetail.away_team_name,
        team_id: playcricketMatchDetail.away_team_id,
        club_name: playcricketMatchDetail.away_club_name,
        club_id: playcricketMatchDetail.away_club_id
      },
    ];

  const matchId: number =  playcricketMatchDetail.id;


  return of(playcricketMatchDetail).pipe(
      filter(
        (PlayCricketMatchDetail$) =>
          Array.isArray(PlayCricketMatchDetail$.players) === true &&
          PlayCricketMatchDetail$.players !== undefined &&
          PlayCricketMatchDetail$.players.length > 0
      ),
      mergeMap((PlayCricketMatchDetail$) => PlayCricketMatchDetail$.players!),
      filter( team$ => 'home_team' in team$ === true || 'away_team' in team$ === true ),
      map(team$ => {
        const tm:any = {};
        if('home_team' in team$ ){
          tm.squad = [];
          tm.team_name = playcricketMatchDetail.home_team_name;
          tm.team_id = playcricketMatchDetail.home_team_id;
          tm.club_name = playcricketMatchDetail.home_club_name;
          tm.club_id = playcricketMatchDetail.home_club_id;
          tm.match_id = matchId;
          team$.home_team!.forEach((player$) => {

          //Correct attribute types of the player object
            const updatedPlayer: { [key: string]: any } = {};
            for (const [key, value] of Object.entries<any>(player$)) {
              if (Array.isArray(value) !== true && value !== undefined && value !== '') {
                updatedPlayer[key as keyof typeof updatedPlayer] = this.attributeTypeCorrection('player', value, key);
              }
            }
          //Create the new player object
            tm.squad.push({...updatedPlayer, ...teams[0], ...{match_id:matchId }});

          });
        } 
        if('away_team' in team$ ) { 
         tm.squad = [];
         tm.team_name = playcricketMatchDetail.away_team_name;
         tm.team_id = playcricketMatchDetail.away_team_id;
         tm.club_name = playcricketMatchDetail.away_club_name;
         tm.club_id = playcricketMatchDetail.away_club_id;
         tm.match_id = matchId;
         team$.away_team!.forEach((player$) => {
          //Correct attribute types of the player object
          const updatedPlayer: { [key: string]: any } = {};
          for (const [key, value] of Object.entries<any>(player$)) {
            if (Array.isArray(value) !== true && value !== undefined && value !== '') {
              updatedPlayer[key as keyof typeof updatedPlayer] = this.attributeTypeCorrection('player', value, key);
            }
          }
          tm.squad.push({...updatedPlayer, ...teams[1],...{match_id:matchId }});
        });
        }
        return tm;
      }),
     toArray()
     )
  }



/*
*******************************************************
***************** Innings functions *******************
*******************************************************
*/


  /**
   * Takes a PlayCricket innings object and transforms it to a InningsDescription
   * @date 29/05/2023 - 14:58:05
   *
   * @public
   * @param {team[]} teamData
   * @param {number} matchId
   * @param {inning} inningsData
   * @returns {Observable<InningsDescription>}
   */
  public innings_description(
    teamData: team[],
    matchId: number,
    inningsData: inning
  ): Observable<InningsDescription> {
    return of(inningsData).pipe(
      map((inningData$: any) => {
        const newinningsData: { [key: string]: any } = {};
        for (const [key, value] of Object.entries<any>(inningData$)) {
          if (Array.isArray(value) !== true && value !== undefined && value !== '') {
            newinningsData[key as keyof typeof newinningsData] = this.attributeTypeCorrection('innings_description', value, key);
          }
        }
        
        return newinningsData;
      }),
      map((inningDescription$: any) => {
        const teamBat = this.find_team(inningsData.team_batting_id!, teamData, true);
        const teamBowl = this.find_team(inningsData.team_batting_id!, teamData, false);
        // Check if teamBat or teamBowl is undefined and handle the case appropriately
        if (!teamBat || !teamBowl) {
          throw new Error('Team not found'); // Throw an error or handle the case as per your requirement
        }
        
        const teamProp: Partial<InningsDescription> = {
          team_batting_id: teamBat.team_id,
          team_batting_name: teamBat.team_name,
          club_batting_id: teamBat.club_id,
          club_batting_name: teamBat.club_name,
          club_bowling_id: teamBowl.club_id,
          club_bowling_name: teamBowl.club_name,
          team_bowling_id: teamBowl.team_id,
          team_bowling_name: teamBowl.team_name,
          match_id: matchId
        };
        return { ...inningDescription$, ...teamProp } as InningsDescription;
      }),
      first()
  )}

 


  
    /**
     * Takes a PlayCricket innings object and transforms it to a Innings Bat object
     * @date 29/05/2023 - 15:00:17
     *
     * @public
     * @param {team[]} teamData
     * @param {number} matchId
     * @param {inning} inningsData
     * @returns {Observable<Bat[]>}
     */
    public inningsBat(teamData: team[], matchId: number, inningsData: inning): Observable<Bat[]> {
      return of(inningsData).pipe(
        filter((inningsData1$: inning) =>
          Array.isArray(inningsData1$.bat) && inningsData1$.bat !== undefined && inningsData1$.bat.length > 0
        ),
        mergeMap((inningsData1$: inning) => inningsData1$.bat!),
        map((bat: any) => {
          const newbat: { [key: string]: any } = {};
          for (const [key, value] of Object.entries<any>(bat)) {
            if (typeof value !== 'object' && value !== undefined && value !== '') {
                newbat[key] = this.attributeTypeCorrection('bat', value, key);
            }
          }
          return newbat;
        }),
        map((bat: any) => {
          const teamBat = this.find_team(inningsData.team_batting_id!, teamData, true);
          const teamBowl = this.find_team(inningsData.team_batting_id!, teamData, false);
    
          // Check if teamBat or teamBowl is undefined and handle the case appropriately
          if (!teamBat || !teamBowl) {
            throw new Error('Team not found'); // Throw an error or handle the case as per your requirement
          }
    
          const teamProp: Partial<Bat> = {
            club_id: teamBat.club_id,
            club_name: teamBat.club_name,
            team_id: teamBat.team_id,
            team_name: teamBat.team_name,
            team_batting_id: teamBat.team_id,
            team_batting_name: teamBat.team_name,
            club_batting_id: teamBat.club_id,
            club_batting_name: teamBat.club_name,
            club_bowling_id: teamBowl.club_id,
            club_bowling_name: teamBowl.club_name,
            team_bowling_id: teamBowl.team_id,
            team_bowling_name: teamBowl.team_name,
            match_id: matchId
          };
          return { ...bat, ...teamProp } as Bat;
        }),
        toArray(),
        last()
      );
    }
    
  
  
  

    /**
     * Takes a PlayCricket innings object and transforms it to a Innings Bowl object
     * @date 29/05/2023 - 15:00:53
     *
     * @public
     * @param {team[]} teamData
     * @param {number} matchId
     * @param {inning} inningsData
     * @returns {Observable<Bowl[]>}
     */
    public inningBowl(teamData: team[], matchId: number, inningsData: inning): Observable<Bowl[]> {
      return of(inningsData).pipe(
        filter((inningsData$: inning) =>
          Array.isArray(inningsData$.bowl) && inningsData$.bowl !== undefined && inningsData$.bowl.length > 0
        ),
        mergeMap((inningsData$: inning) => inningsData$.bowl!),
        map((bowl:any) => {
          const newbowl: { [key: string]: any } = {};
          for (const [key, value] of Object.entries<any>(bowl)) {
            if (typeof value !== 'object' && value !== undefined && value !== "") {
              newbowl[key] = this.attributeTypeCorrection('bowl', value, key);
            }
          }
          return newbowl;
        }),
        map((bowl: any) => {
          const teamBat = this.find_team(inningsData.team_batting_id!, teamData, true);
          const teamBowl = this.find_team(inningsData.team_batting_id!, teamData, false);
          // Check if teamBat or teamBowl is undefined and handle the case appropriately
          if (!teamBat || !teamBowl) {
            throw new Error('Team not found'); // Throw an error or handle the case as per your requirement
          }
          const teamProp: Partial<Bowl> = {
            club_id: teamBat.club_id,
            club_name: teamBat.club_name,
            team_id: teamBat.team_id,
            team_name: teamBat.team_name,
            team_batting_id: teamBat.team_id,
            team_batting_name: teamBat.team_name,
            club_batting_id: teamBat.club_id,
            club_batting_name: teamBat.club_name,
            club_bowling_id: teamBowl.club_id,
            club_bowling_name: teamBowl.club_name,
            team_bowling_id: teamBowl.team_id,
            team_bowling_name: teamBowl.team_name,
            match_id: matchId
          };
          return { ...bowl, ...teamProp } as Bowl;
        }),
        toArray()
      );
    }
    

    /**
     * Takes a PlayCricket innings object and transforms it to a Innings FallOfWickets object
     * @date 29/05/2023 - 15:01:21
     *
     * @public
     * @param {team[]} teamData
     * @param {number} matchId
     * @param {inning} inningsData
     * @returns {Observable<FallOfWickets[]>}
     */
    public inningFallOfWickets(teamData: team[], matchId: number, inningsData: inning): Observable<FallOfWickets[]> {
      if (!inningsData) {
        console.log('Massive error Innings data empty')
      }
      
      return of(inningsData).pipe(
        filter((inningsData$: inning) =>
          Array.isArray(inningsData$.fow) && inningsData$.fow !== undefined && inningsData$.fow.length > 0
        ),
        mergeMap((inningsData$: inning) => inningsData$.fow!),
        map((fow: any) => {
          const newfow: { [key: string]: any } = {};
          for (const [key, value] of Object.entries<any>(fow)) {
            if (typeof value !== 'object' && value !== undefined && value !== '') {
              newfow[key] = this.attributeTypeCorrection('fow', value, key);
            }
          }
          return newfow;
        }),
        map((fow: any) => {
          const teamBat = this.find_team(inningsData.team_batting_id!, teamData, true);
          const teamBowl = this.find_team(inningsData.team_batting_id!, teamData, false);
          // Check if teamBat or teamBowl is undefined and handle the case appropriately
          if (!teamBat || !teamBowl) {
            throw new Error('Team not found'); // Throw an error or handle the case as per your requirement
          }
          const teamProp: Partial<FallOfWickets> = {
            team_batting_id: teamBat.team_id,
            team_batting_name: teamBat.team_name,
            club_batting_id: teamBat.club_id,
            club_batting_name: teamBat.club_name,
            club_bowling_id: teamBowl.club_id,
            club_bowling_name: teamBowl.club_name,
            team_bowling_id: teamBowl.team_id,
            team_bowling_name: teamBowl.team_name,
            match_id: matchId
          };
          return { ...fow, ...teamProp } as FallOfWickets;
        }),
        toArray(),
        skipWhile((res) => res === null),
        throwIfEmpty(),
        retry({ count: 5, delay: 500 })
      );
    }
    

  /**
   * Takes Match Interface type objects and auto corrects the attributes to the correct type according to the Match interface object
   * @date 29/05/2023 - 15:02:11
   *
   * @private
   * @param {string} interfaceObject
   * @param {(string | number | boolean)} attributeValue
   * @param {string} attributeKey
   * @returns {(string | number | boolean)}
   */
  private attributeTypeCorrection(
    interfaceObject: string,
    attributeValue: string | number | boolean,
    attributeKey: string
  ): string | number | boolean {
    const interfaceObjectSamples: {
      bat: Bat;
      bowl: Bowl;
      fow: FallOfWickets;
      innings_description: InningsDescription;
      match_description: MatchDescription;
      player: Player;

    } = {
      bat: {
        position: 0,
        batsman_name: '',
        batsman_id: '',
        how_out: '',
        fielder_name: '',
        fielder_id: '',
        bowler_name: '',
        bowler_id: '',
        runs: 0,
        fours: 0,
        sixes: 0,
        balls: 0
      },
      bowl: {
        bowler_name: '',
        bowler_id: '',
        overs: 0,
        maidens: 0,
        runs: 0,
        wides: 0,
        wickets: 0,
        no_balls: 0
      },
      fow: {
        runs: 0,
        wickets: 0,
        batsman_out_name: '',
        batsman_out_id: '',
        batsman_in_name: '',
        batsman_in_id: '',
        batsman_in_runs: 0
      },
      player:{
        position: 0,
        player_name: '',
        player_id: '',
        captain: true,
        wicket_keeper: true,
        club_id:'',
        club_name: '',
        team_id: '',
        team_name: '',
        match_id: 0
      },
      innings_description: {
        team_batting_name: '',
        team_batting_id: '',
        team_bowling_name: '',
        team_bowling_id: '',
        innings_number: 0,
        extra_byes: 0,
        extra_leg_byes: 0,
        extra_wides: 0,
        extra_no_balls: 0,
        extra_penalty_runs: 0,
        forfeited_innings: false,
        penalties_runs_awarded_in_other_innings: 0,
        total_extras: 0,
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        declared: true,
        revised_target_runs: 0,
        revised_target_overs: 0,
        revised_target_balls: 0,
      },
      match_description:{
        id: 0,
        status: '',
        published: '',
        last_updated: '',
        league_name: '',
        league_id: '',
        competition_name: '',
        competition_id: '',
        competition_type: '',
        match_type: '',
        game_type: '',
        countdown_cricket: '',
        match_id: '', 
        season: '',
        match_date: '',
        match_time: '',
        ground_name: '',
        ground_id: '',
        ground_latitude: '',
        ground_longitude: '',
        home_club_name: '',
        home_team_name: '',
        home_team_id: '',
        home_club_id: '',
        away_club_name: '',
        away_team_name: '',
        away_team_id: '',
        away_club_id: '',
        umpire_1_name: '',
        umpire_1_id: '',
        umpire_2_name: '',
        umpire_2_id: '',
        umpire_3_name: '',
        umpire_3_id: '',
        referee_name: '',
        referee_id: '',
        scorer_1_name: '',
        scorer_1_id: '',
        scorer_2_name: '',
        scorer_2_id: '',
        home_team_isNavestock: true,
        navestock_club_name: '',
        navestock_team_name: '',
        navestock_team_id: '',
        navestock_club_id: '',
        opposition_club_name: '',
        opposition_team_name: '',
        opposition_team_id: '',
        opposition_club_id: '',
        toss_won_by_team_id: '',
        toss: '',
        batted_first: '',
        no_of_overs: '',
        balls_per_innings: '',
        no_of_innings: '',
        no_of_days: '',
        no_of_players: '',
        no_of_reserves:'',
        result: '',
        result_updated: true,
        result_description: '',
        result_applied_to: '',
        match_notes: '',
      }
    };

    const interfaceToTest = interfaceObjectSamples[interfaceObject as keyof typeof interfaceObjectSamples];
    if (typeof interfaceToTest[attributeKey as keyof typeof interfaceToTest] === typeof attributeValue) {
      return attributeValue;
    } else if (
      typeof attributeValue === 'string' &&
      typeof interfaceToTest[attributeKey as keyof typeof interfaceToTest] === 'number'
    ) {
      return  +attributeValue;
    } else if (
      typeof attributeValue === 'number' &&
      typeof interfaceToTest[attributeKey as keyof typeof interfaceToTest] === 'string'
    ) {
     return attributeValue.toString();
    } else if (
      typeof attributeValue === 'string' &&
      typeof interfaceToTest[attributeKey as keyof typeof interfaceToTest] === 'boolean'
    ) {
      return attributeValue.toLocaleLowerCase() === 'true';
    } else {
      return attributeValue;
    }
  }
}

