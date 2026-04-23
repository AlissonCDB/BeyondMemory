import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importando o service e a interface correta
import { tmdbService } from '../../database/services/tmdbService'; 
import { Movie } from '../../types/movie';

interface AddMediaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (movie: Movie) => void; // Alinhado com a interface Movie
}

export function AddMediaModal({ visible, onClose, onSave }: AddMediaModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]); // Usando Movie[]
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length > 2) {
      setLoading(true);
      try {
        const data = await tmdbService.searchMulti(text);
        setResults(data);
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const selectMedia = async (item: Movie) => {
    setLoading(true);
    try {
      let finalMedia: Movie = { ...item };

      // Buscando detalhes extras (opcional, dependendo do que você salvará no banco)
      if (item.media_type === 'movie') {
        const details = await tmdbService.getMovieDetails(item.api_id);
        finalMedia = { ...finalMedia, ...details };
      } else if (item.media_type === 'tv') {
        const details = await tmdbService.getSerieDetails(item.api_id);
        finalMedia = { ...finalMedia, ...details };
      }

      onSave(finalMedia);
      handleClose(); 
    } catch (error) {
      console.error("Erro ao buscar detalhes da mídia:", error);
      alert("Não foi possível carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  const getYear = (dateString?: string) => dateString ? dateString.split('-')[0] : 'N/A';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-slate-900/40"
      >
        <View className="bg-white h-[85%] rounded-t-3xl pt-6 px-6 pb-10 shadow-lg">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-slate-800">Buscar no TMDB</Text>
            <TouchableOpacity onPress={handleClose} className="p-2 bg-slate-100 rounded-full">
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Barra de Pesquisa */}
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Ex: Interestelar, One Piece..."
              value={query}
              onChangeText={handleSearch}
              autoFocus={true}
              className="flex-1 ml-3 text-slate-800 font-medium"
              placeholderTextColor="#94a3b8"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            )}
          </View>

          {/* Lista de Resultados */}
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="text-slate-500 mt-2 font-medium">Buscando...</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              // CORREÇÃO: Usando api_id que sempre existe na busca
              keyExtractor={(item) => item.api_id.toString()}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                query.length > 2 ? (
                  <Text className="text-center text-slate-500 mt-10">Nenhum resultado.</Text>
                ) : (
                  <Text className="text-center text-slate-400 mt-10 text-sm">Pesquise por filmes ou séries</Text>
                )
              }
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectMedia(item)}
                  className="flex-row items-center mb-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <Image 
                    source={{ uri: tmdbService.getImageUrl(item.image) }} 
                    className="w-14 h-20 rounded-lg bg-slate-200"
                    resizeMode="cover"
                  />
                  
                  <View className="ml-4 flex-1 justify-center">
                    <View className="self-start mb-1">
                      {/* CORREÇÃO: media_type no lugar de type */}
                      <Text className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.media_type === 'movie' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'
                      }`}>
                        {item.media_type === 'movie' ? 'Filme' : 'Série'}
                      </Text>
                    </View>
                    
                    <Text className="text-base font-bold text-slate-800 mb-1" numberOfLines={1}>
                      {item.title}
                    </Text>
                    
                    <Text className="text-xs text-slate-500 font-medium">
                      {/* CORREÇÃO: release_date no lugar de releaseDate */}
                      Lançamento: {getYear(item.release_date)}
                    </Text>
                  </View>

                  <Ionicons name="add-circle" size={28} color="#4f46e5" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}