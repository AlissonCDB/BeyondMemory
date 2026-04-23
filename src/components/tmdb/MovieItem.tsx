import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../../types/movie';
import { tmdbService } from '../../database/services/tmdbService';

interface MovieItemProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
  onDelete?: (id: number) => void;
}

export function MovieItem({ movie, onPress, onDelete }: MovieItemProps) {
  const posterUrl = tmdbService.getImageUrl(movie.image);

  // Formatar o ano de lançamento
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <View className="bg-white rounded-3xl mb-5 shadow-sm border border-slate-200 flex-row overflow-hidden min-h-[140px]">
      
      {/* Pôster do Filme */}
      <Image 
        source={{ uri: posterUrl }} 
        className="w-28 h-auto bg-slate-200"
        resizeMode="cover"
      />

      {/* Área de Informações */}
      <View className="flex-1 p-4 justify-between">
        
        <View>
          {/* Topo: Tag e Lixeira (Mesmo padrão da Serie) */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row flex-wrap flex-1 gap-1.5 pr-2">
              <View className="bg-slate-100 px-2 py-1 rounded-md">
                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Filme • {releaseYear}
                </Text>
              </View>
            </View>

            {onDelete && (
              <TouchableOpacity onPress={() => onDelete(movie.api_id)} className="p-1.5 bg-red-50 rounded-full">
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Título Clicável */}
          <Pressable 
            onPress={() => onPress && onPress(movie)}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-lg font-extrabold text-slate-800 leading-tight mb-2" numberOfLines={3}>
              {movie.title}
            </Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}