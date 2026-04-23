export type Episodes = number;
export type Season = Episodes[];
export type UserProgress = {
  season: number;
  episode: number;
};

export interface Serie {
  id?: number;
  api_id: number;
  name: string;
  air_date: string;
  image: string;
  media_type: string;
  seasons: Season;
  current_progress: UserProgress;
}