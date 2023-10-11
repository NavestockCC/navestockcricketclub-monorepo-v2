export { 
  AXIOSAPIRespone_MatchlistPlaycricket,
  PlaycricketAPIRespone_Matchlist,
  AXIOSAPIRespone_MatchDetailPlayCricket,
  PlayCrikcetMatchDescription,
  PlayCricketMatchDetail,
  inning,
  team
 };

/**
 * @description Interface describing the data returned by the getPlayCricketApiMatch_List
 * @field {string} status - axios http return status code
 * @field {string} statusText - axios http return status description
 * @field { season: string; matches: MatchDescription[] } data - data returned by the http call
 */
interface AXIOSAPIRespone_MatchlistPlaycricket{
  status: number;
  statusText: string;
  data: PlaycricketAPIRespone_Matchlist;
}

interface PlaycricketAPIRespone_Matchlist{
   season: string; 
   matches: PlayCrikcetMatchDescription[] 
  }

interface PlayCrikcetMatchDescription {
  id: number;
  status: string;
  published: string;
  last_updated: string;
  league_name?: string;
  league_id?: string;
  competition_name?: string;
  competition_id?: string;
  competition_type?: string;
  match_type?: string;
  game_type?: string;
  season?: string;
  match_date: string;
  match_time: string;
  ground_name?: string;
  ground_id?: string;
  ground_latitude?: string;
  ground_longitude?: string;
  home_club_name?: string;
  home_team_name?: string;
  home_team_id?: string;
  home_club_id: string;
  away_club_name?: string;
  away_team_name?: string;
  away_team_id?: string;
  away_club_id: string;
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
  toss_won_by_team_id?: string;
  toss?: string;
  batted_first?: string;
  no_of_overs?: string;
  result_updated?: boolean;
  result_description?: string;
  result_applied_to?: string;
  match_notes?: string;
}

/**
 * @description Interface describing the data returned by the getPlayCricketApiMatch_Detail
 * @field {string} status - axios http return status code
 * @field {string} statusText - axios http return status description
 * @field {match_details: any[]} data - data returned by the http call
 */
 interface AXIOSAPIRespone_MatchDetailPlayCricket{
  status: number;
  statusText: string;
  data?: {
    match_details?: PlayCricketMatchDetail[];
    }
  }

interface PlayCricketMatchDetail{
  id: number;
  status?: string;
  published?: string;
  last_updated?: string;
  league_name?: string;
  league_id?: string;
  competition_name?: string;
  competition_id?: string;
  competition_type?: string;
  match_type?: string;
  game_type?: string;
  countdown_cricket?: string;
  match_id?: string;
  match_date?: string;
  match_time?: string;
  ground_name?: string;
  ground_id?: string;
  home_team_name?: string;
  home_team_id?: string;
  home_club_name?: string;
  home_club_id?: string;
  away_team_name?: string;
  away_team_id?: string;
  away_club_name?: string
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
  toss_won_by_team_id?: string;
  toss?: string;
  batted_first?: string;
  no_of_overs?: string;
  balls_per_innings?: string;
  no_of_innings?: string;
  no_of_days?: string;
  no_of_players?: string;
  no_of_reserves?: string;
  result?: string;
  result_description?: string;
  result_applied_to?: string;
  match_notes?: string;
  points?: gamepoints[];
  match_result_types?: any;
  players?: [
      {
          home_team?: player[];
      },
      {
          away_team?: player[];
      }];
  innings?: inning[];
  teams?: team[];
}

 interface inning{
  team_batting_name?: string;
  team_batting_id?: string;
  innings_number?: number;
  extra_byes?: string;
  extra_leg_byes?: string;
  extra_wides?: string;
  extra_no_balls?: string;
  extra_penalty_runs?: string;
  penalties_runs_awarded_in_other_innings?: string;
  total_extras?: string;
  runs?: string;
  wickets?: string;
  overs?: string;
  balls?: string;
  declared?: false,
  forfeited_innings?: false,
  revised_target_runs?: string;
  revised_target_overs?: string;
  revised_target_balls?: string;
  bat?: batsman[];
  fow?: fallofwickets[];
  bowl?: bowler[];
}

interface player{
    position?: number;
    player_name?: string;
    player_id?: number;
    captain?: boolean;
    wicket_keeper?: boolean;
}


  interface gamepoints{
      team_id?: number;
      game_points?: string;
      penalty_points?: string;
      bonus_points_together?: string;
      bonus_points_batting?: string;
      bonus_points_bowling?: string;
      bonus_points_2nd_innings_together?: string;
  }

  interface bowler{
      bowler_name?: string;
      bowler_id?: string;
      overs?: string;
      maidens?: string;
      runs?: string;
      wides?: string;
      wickets?: string;
      no_balls?: string;
  }

  interface batsman{
    position?: string;
    batsman_name?: string;
    batsman_id?: string;
    how_out?: string;
    fielder_name?: string;
    fielder_id?: string;
    bowler_name?: string;
    bowler_id?: string;
    runs?: string;
    fours?: string;
    sixes?: string;
    balls?: string;
} 

  interface fallofwickets{
    runs?: string;
    wickets?: number;
    batsman_out_name?: string;
    batsman_out_id?: string;
    batsman_in_name?: string;
    batsman_in_id?: string;
    batsman_in_runs?: string;
}

interface team{
      team_name?: string;
      team_id?: string;
      club_name?: string;
      club_id?: string;
}