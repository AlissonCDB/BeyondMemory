import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { MovieRepository } from '../src/database/repositories/movieRepository';
import { SerieRepository } from '../src/database/repositories/serieRepository';
import { tmdbService } from '../src/database/services/tmdbService';

import { EmptyState } from '../src/components/EmptyState';
import { AddMediaModal } from '../src/components/tmdb/AddMediaModal';
import { SerieItem } from '../src/components/tmdb/SerieItem';
import { MovieItem } from '../src/components/tmdb/MovieItem';

import { Movie } from '../src/types/movie';
import { Serie, UserProgress } from '../src/types/serie'; // Importamos UserProgress aqui

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [mediaItems, setMediaItems] = useState<(Movie | Serie)[]>([]);

  const loadStoredMedia = useCallback(async () => {
    setLoading(true);
    try {
      const [storedMovies, storedSeries] = await Promise.all([
        MovieRepository.getAll(),
        SerieRepository.getAll()
      ]);

      const combined = [...storedMovies, ...storedSeries];

      // Garantia de unicidade
      const uniqueMap = new Map();
      combined.forEach(item => {
        const key = `${item.media_type}-${item.api_id}`;
        uniqueMap.set(key, item);
      });

      const sortedItems = Array.from(uniqueMap.values()).sort((a, b) =>
        (b.id || 0) - (a.id || 0)
      );

      setMediaItems(sortedItems);
    } catch (error) {
      console.error("Erro no carregamento:", error);
      Alert.alert("Erro", "Nao foi possivel carregar sua biblioteca.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredMedia();
  }, [loadStoredMedia]);

  const handleSaveMedia = async (media: any) => {
    try {
      if (media.media_type === 'movie') {
        await MovieRepository.saveFromApi(media);
      } else {
        const fullSerie = await tmdbService.getSerieDetails(media.api_id);
        await SerieRepository.saveSerieFromApi(fullSerie);
      }
      setAddModalVisible(false);
      await loadStoredMedia();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar o item.");
    }
  };

  const handleDeleteMedia = async (item: Movie | Serie) => {
    try {
      console.log(`Tentando deletar ${item.media_type} com API_ID: ${item.api_id}`);

      if (item.media_type === 'movie') {
        await MovieRepository.deleteByApiId(item.api_id);
      } else {
        await SerieRepository.deleteByApiId(item.api_id);
      }

      // Remocao do estado local
      setMediaItems(prev => prev.filter(i => i.api_id !== item.api_id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // NOVA FUNÇÃO: Atualiza o progresso no banco e na tela
  const handleUpdateProgress = async (api_id: number, newProgress: UserProgress) => {
    try {
      // 1. Atualiza no SQLite usando o método que adicionamos no SerieRepository
      await SerieRepository.updateProgress(api_id, newProgress);

      // 2. Atualiza o estado local para a UI reagir na hora sem precisar recarregar tudo
      setMediaItems(prevItems => 
        prevItems.map(item => {
          // Verifica se é uma série e se é o ID correto antes de alterar
          if (item.media_type === 'tv' && item.api_id === api_id) {
            return { ...item, current_progress: newProgress };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Erro ao atualizar o progresso:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-color1" edges={['top']}>
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-color5">Além da Memória</Text>
          <Text className="text-sm text-color3 font-medium">Sua estante de filmes, series e animes</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAddModalVisible(true)}
          className="bg-color5 w-12 h-12 rounded-2xl items-center justify-center shadow-md"
        >
          <Ionicons name="add" size={28} color="#eee6ab" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#696758" />
        </View>
      ) : (
        <FlatList
          data={mediaItems}
          keyExtractor={(item) => `${item.media_type}-${item.api_id}`}
          renderItem={({ item }) => (
            item.media_type === 'movie' ? (
              <MovieItem
                movie={item as Movie}
                onDelete={() => handleDeleteMedia(item)}
              />
            ) : (
              <SerieItem
                serie={item as Serie}
                onDelete={() => handleDeleteMedia(item)}
                onUpdateProgress={handleUpdateProgress} // Passando a prop nova
              />
            )
          )}
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma obra salva"
              description="Adicione novos titulos para acompanhar seu progresso."
              icon="videocam-outline"
            />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddMediaModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveMedia}
      />
    </SafeAreaView>
  );
}