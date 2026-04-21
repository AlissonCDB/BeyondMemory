// src/types/tmdb.ts

/**
 * Estrutura de uma temporada dentro de uma série
 */
export interface TMDBSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number; // Aqui está o que você precisava
  air_date: string;
}

/**
 * Detalhes completos de um Filme
 */
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number; // Duração em minutos
  overview: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

/**
 * Detalhes completos de uma Série
 */
export interface TMDBSerie {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[]; // Array de durações (ex: [45, 50, 60])
  seasons: TMDBSeason[]; // Array com o detalhamento de cada temporada
  overview: string;
  vote_average: number;
  status: string; // Ex: "Ended", "Returning Series"
}

/**
 * Tipo unificado para facilitar o uso na sua "Estante"
 * Isso ajuda a tratar os dados no seu componente de Card
 */
export type MediaItem = {
  tmdbId: number;
  title: string;
  image: string | null;
  releaseDate: string;
  overview: string;
  type: 'movie' | 'tv';
  
  // Opcionais dependendo do tipo
  duration?: number; // Para filmes
  totalSeasons?: number; // Para séries
  totalEpisodes?: number; // Para séries
  seasonsDetails?: TMDBSeason[]; // Para controle fino de episódios por temporada
};