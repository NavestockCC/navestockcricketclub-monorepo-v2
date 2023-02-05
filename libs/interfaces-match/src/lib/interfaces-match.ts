import {Timestamp} from 'firebase-admin/firestore';

export { 
  MatchlistPlaycricketAPIRespone,
  MatchDetailPlaycricketAPIRespone,
  MatchList, 
  Match, 
  MatchDescription,
  Innings, 
  InningsDescription,
  Bat,
  Bowl,
  FallOfWickets,
  Team,
  Player };

/**
 * @description Interface describing the data returned by the getPlayCricketApiMatch_List
 * @field {string} status - axios http return status code
 * @field {string} statusText - axios http return status description
 * @field { season: string, matches: MatchDescription[] } data - data returned by the http call
 */
interface MatchlistPlaycricketAPIRespone{
  status: number;
  statusText: string;
  data: { season: string, matches: MatchDescription[] };
}

/**
 * @description Interface describing the data returned by the getPlayCricketApiMatch_Detail
 * @field {string} status - axios http return status code
 * @field {string} statusText - axios http return status description
 * @field {match_details: any[]} data - data returned by the http call
 */
 interface MatchDetailPlaycricketAPIRespone{
  status: number;
  statusText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: {match_details: any[]};
}


/**
 * Match list
 * @field {number} season - number representing the season year
 * @field {Match[]} matches - array of {Match} the be played in a year
 */
interface MatchList {
  season: string;
  matches: MatchDescription[];
}
/**
 * @interface Match
 * @field {MatchDescription} description - describes the detailed match information
 * @field {Innings[ ]?} innings - information on each innings played
 * @field {Team[ ]?} players - each team with their squad members
 */
interface Match {
  description: MatchDescription;
  innings?: Innings[];
  players?: Team[];
}

/**
 * @interface MatchDescription
 */
interface MatchDescription {
  id: number;
  status: string;
  published: string;
  last_updated: string;
  last_updated_timestamp?: Timestamp;
  league_name?: string;
  league_id?: string;
  competition_name?: string;
  competition_id?: string;
  competition_type?: string;
  match_type?: string;
  game_type?: string;
  season?: string;
  match_date: string;
  match_date_timestamp?: Timestamp;
  match_time: string;
  ground_name?: string;
  ground_id?: string;
  ground_latitude?: string;
  ground_longitude?: string;
  home_club_name?: string;
  home_team_name?: string;
  home_team_id?: string;
  home_club_id?: string;
  away_club_name?: string;
  away_team_name?: string;
  away_team_id?: string;
  away_club_id?: string;
  umpire_1_name?: string;
  umpire_1_id?: string;
  umpire_2_name?: string;
  umpire_2_id?: string;
  umpire_3_name?: string;
  umpire_3_id?: string;
  referee_name?: string;
  referee_id?: string;
  scorer_1_name?: string;
  scorer_1_id?: string;
  scorer_2_name?: string;
  scorer_2_id?: string;
  home_team_isNavestock?: boolean;
  navestock_club_name?: string;
  navestock_team_name?: string;
  navestock_team_id?: string;
  navestock_club_id?: string;
  opposition_club_name?: string;
  opposition_team_name?: string;
  opposition_team_id?: string;
  opposition_club_id?: string;
  toss_won_by_team_id?: string;
  toss?: string;
  batted_first?: string;
  no_of_overs?: string;
  result_updated?: boolean;
  result_description?: string;
  result_applied_to?: string;
  match_notes?: string;
}

interface Innings{
  description: InningsDescription;
  bat?: Bat[];
  bowl?: Bowl[];
  fow?: FallOfWickets[];
}

interface InningsDescription{
  team_batting_name: string;
  team_batting_id: string;
  club_batting_name?: string;
  club_batting_id?: string;
  team_bowling_name?: string;
  team_bowling_id?: string;
  club_bowling_name?: string;
  club_bowling_id?: string;
  innings_number?: number;
  extra_byes?: number;
  extra_leg_byes?: number;
  extra_wides?: number;
  extra_no_balls?: number;
  extra_penalty_runs?: number;
  penalties_runs_awarded_in_other_innings?:number;
  total_extras?: number;
  runs?: number;
  wickets?: number;
  overs?: number;
  balls?:number;
  declared?: boolean;
  revised_target_runs?: number;
  revised_target_overs?: number;
  revised_target_balls?: number;
  match_id?: number;
}

interface Bat{
  team_bowling_name?: string;
  team_bowling_id?: string;
  club_bowling_name?: string;
  club_bowling_id?: string;
  position: number;
  batsman_name: string;
  batsman_id: string;
  team_name?: string;
  team_id?: string;
  club_name?: string;
  club_id?: string;
  how_out?: string;
  fielder_name?: string;
  fielder_id?: string;                                             
  bowler_name?: string;
  bowler_id?: string;
  runs?: number;
  fours?: number;
  sixes?: number;
  balls?: number;
  match_id?: number;
}

interface Bowl{
  bowler_name: string;
  bowler_id: string;
  team_name?: string;
  team_id?: string;
  club_name?: string;
  club_id?: string;
  overs?: number;
  maidens?: number;
  runs?: number;
  wides?: number;
  wickets?: number;
  no_balls?: number;
  match_id?: number;
  team_batting_name?: string;
  team_batting_id?: string;
  club_batting_name?: string;
  club_batting_id?: string;
}

interface FallOfWickets {
  runs: number;
  wickets: number;
  batsman_out_name: string;
  batsman_out_id: string;
  batsman_in_name?: string;
  batsman_in_id?: string;
  batsman_in_runs?: number;
  match_id?: number;
  team_batting_name?: string;
  team_batting_id?: string;
  club_batting_name?: string;
  club_batting_id?: string;
  team_bowling_name?: string;
  team_bowling_id?: string;
  club_bowling_name?: string;
  club_bowling_id?: string;
}

interface Team{
  team_id: string;
  team_name: string;
  squad?: Player[];
}

interface Player {
  position?: number;
  player_name: string;
  player_id: string;
  captain?: boolean;
  wicket_keeper?: boolean;
}