export {
  Scoreboard
}

interface Scoreboard{
  bottom?: {
    overs?: number;
    target?: number;
    wickets?: number;
  },
  top?:{
    batsman1?: number;
    batsman2?: number;
    teamscore?: number;
  }
} 