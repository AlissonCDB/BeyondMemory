import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Serie, UserProgress } from '../../types/serie';

interface SerieItemProps {
  serie: Serie;
  onPress?: (serie: Serie) => void;
  onDelete?: (api_id: number) => void;
  onUpdateProgress?: (api_id: number, newProgress: UserProgress) => void; 
}

export function SerieItem({ serie, onPress, onDelete, onUpdateProgress }: SerieItemProps) {
  const progress = serie.current_progress || { season: 1, episode: 0 };

  const posterUrl = serie.image
    ? `https://image.tmdb.org/t/p/w300${serie.image}`
    : 'https://via.placeholder.com/200x300?text=Sem+Capa';

  const startYear = serie.air_date ? serie.air_date.split('-')[0] : 'N/A';
  const totalSeasons = serie.seasons ? serie.seasons.length : 0;

  const currentSeasonIndex = progress.season - 1;
  const maxEpisodesCurrentSeason = (serie.seasons && serie.seasons[currentSeasonIndex]) ? serie.seasons[currentSeasonIndex] : 1;
  
  const isNotStarted = progress.season === 1 && progress.episode === 0;
  const isSeasonCompleted = progress.episode === maxEpisodesCurrentSeason;
  const isLastSeason = progress.season === totalSeasons;

  const handleIncrement = () => {
    if (!onUpdateProgress) return;

    if (progress.episode < maxEpisodesCurrentSeason) {
      onUpdateProgress(serie.api_id, { season: progress.season, episode: progress.episode + 1 });
    } else if (isSeasonCompleted && !isLastSeason) {
      onUpdateProgress(serie.api_id, { season: progress.season + 1, episode: 1 });
    }
  };

  const handleDecrement = () => {
    if (!onUpdateProgress) return;
    
    if (progress.episode > 1) {
      onUpdateProgress(serie.api_id, { season: progress.season, episode: progress.episode - 1 });
    } else if (progress.season === 1 && progress.episode === 1) {
      onUpdateProgress(serie.api_id, { season: 1, episode: 0 });
    } else if (progress.season > 1) {
      const prevSeasonIndex = progress.season - 2;
      const maxEpisodesPrevSeason = serie.seasons[prevSeasonIndex] || 1;
      onUpdateProgress(serie.api_id, { season: progress.season - 1, episode: maxEpisodesPrevSeason });
    }
  };

  const calculateTotalProgress = () => {
    if (!serie.seasons || totalSeasons === 0 || isNotStarted) return 0;
    
    const totalEpisodes = serie.seasons.reduce((acc, eps) => acc + eps, 0);
    let watchedEpisodes = 0;
    
    for (let i = 0; i < currentSeasonIndex; i++) {
      watchedEpisodes += serie.seasons[i];
    }
    
    watchedEpisodes += progress.episode;

    return Math.min((watchedEpisodes / totalEpisodes) * 100, 100);
  };

  const totalProgressPercentage = calculateTotalProgress();

  let statusConfig = { text: "Assistindo", bg: "bg-amber-50", textClass: "text-amber-600", border: "border-amber-100" };
  if (totalProgressPercentage >= 100) {
    statusConfig = { text: "Finalizada", bg: "bg-emerald-50", textClass: "text-emerald-600", border: "border-emerald-100" };
  }

  const handleMarkAsFinished = () => {
    if (!onUpdateProgress || totalSeasons === 0) return;
    const lastSeason = totalSeasons;
    const lastSeasonEps = serie.seasons[lastSeason - 1];
    
    onUpdateProgress(serie.api_id, { season: lastSeason, episode: lastSeasonEps });
  };

  return (
    <View className="bg-white rounded-3xl mb-5 shadow-sm border border-slate-200 flex-row overflow-hidden min-h-[160px]">
      <Image source={{ uri: posterUrl }} className="w-28 h-auto bg-slate-200" resizeMode="cover" />

      <View className="flex-1 p-4 justify-between">
        <View>
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row flex-wrap flex-1 gap-1.5 pr-2">
              <View className="bg-slate-100 px-2 py-1 rounded-md">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Série • {startYear}</Text>
              </View>
              <View className="bg-slate-100 px-2 py-1 rounded-md">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{totalSeasons} {totalSeasons === 1 ? 'Temp.' : 'Temps.'}</Text>
              </View>
            </View>
            {onDelete && (
              <TouchableOpacity onPress={() => onDelete(serie.api_id)} className="p-1.5 bg-red-50 rounded-full">
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
          <Pressable onPress={() => onPress && onPress(serie)}>
            <Text className="text-lg font-extrabold text-slate-800 leading-tight mb-2" numberOfLines={2}>{serie.name}</Text>
          </Pressable>
        </View>

        <View className="mt-2">
          {isNotStarted ? (
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => onUpdateProgress && onUpdateProgress(serie.api_id, { season: 1, episode: 1 })}
                className="flex-1 flex-row items-center justify-center bg-blue-500 py-2.5 rounded-xl active:bg-blue-600 shadow-sm"
              >
                <Ionicons name="play" size={14} color="#ffffff" />
                <Text className="text-white text-[11px] font-bold ml-2 uppercase tracking-wider">Iniciar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleMarkAsFinished}
                className="flex-1 flex-row items-center justify-center bg-emerald-500 py-2.5 rounded-xl active:bg-emerald-600 shadow-sm"
              >
                <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                <Text className="text-white text-[11px] font-bold ml-2 uppercase tracking-wider">Finalizada</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-wrap flex-1 gap-1.5">
                  
                  {/* UX ALTERADA: Sempre mostra S(X) E(X), sem substituir por "Concluída" */}
                  <View className={`px-2.5 py-1 rounded-lg border ${isSeasonCompleted ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'}`}>
                    <Text className={`text-xs font-bold ${isSeasonCompleted ? 'text-indigo-600' : 'text-blue-600'}`}>
                      S{progress.season} • E{progress.episode}
                    </Text>
                  </View>

                  <View className={`px-2 py-1 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}>
                    <Text className={`text-[9px] font-bold uppercase tracking-widest ${statusConfig.textClass}`}>{statusConfig.text}</Text>
                  </View>
                </View>

                <View className="flex-row items-center ml-2">
                  <TouchableOpacity onPress={handleDecrement} className="w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center active:bg-slate-100">
                    <Ionicons name="remove" size={14} color="#64748b" />
                  </TouchableOpacity>
                  
                  {(!isSeasonCompleted || !isLastSeason) && (
                    <TouchableOpacity onPress={handleIncrement} className={`w-7 h-7 rounded-full items-center justify-center ml-2 shadow-sm ${isSeasonCompleted ? 'bg-indigo-500 active:bg-indigo-600' : 'bg-blue-500 active:bg-blue-600'}`}>
                      <Ionicons name={isSeasonCompleted ? "arrow-forward" : "add"} size={14} color="#ffffff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View className="flex-row items-center mt-1">
                <View className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <View className={`h-full rounded-full ${totalProgressPercentage >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${totalProgressPercentage}%` }} />
                </View>
                <Text className="text-[10px] font-bold text-slate-400 w-9 text-right ml-2">{Math.floor(totalProgressPercentage)}%</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}