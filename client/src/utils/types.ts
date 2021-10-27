export interface NewGame {
  id: string;
  title: string;
  max_points: number;
  created_at: string;
  players: Player[];
}

export interface Games {
  games: Game[];
}

export interface Game {
  id: string;
  title: string;
  max_points: number;
  created_at: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
}

export interface DetailledGame {
  id: string;
  title: string;
  max_points: number;
  created_at: string;
  players: Playplayer[];
  playingPlayers: Playplayer[];
  outOfGamePlayers: Playplayer[];
}

export interface Playplayer {
  id: string;
  name: string;
  points: number;
  lastRoundId: number;
}
