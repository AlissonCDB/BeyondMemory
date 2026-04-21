import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useBooks } from '../src/hooks/useBooks';
import { TypeRepository } from '../src/database/repositories/typeRepository';
import { BookType } from '../src/types/book';
import { BookItem } from '../src/components/BookItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';

// Tipo para as abas
type Category = 'literatura' | 'cinematografia';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Category>('literatura');
  const { books, filter, setFilter, removeBook, incrementChapter, decrementChapter, loading } = useBooks();
  const [types, setTypes] = useState<BookType[]>([]);

  useEffect(() => {
    TypeRepository.getAll().then(setTypes);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-color1" edges={['top']}>
      
      {/* Header Superior */}
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-color5">
          Além da Memória
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/form')}
          className="bg-color5 w-12 h-12 rounded-2xl items-center justify-center shadow-md shadow-color4"
        >
          <Ionicons name="add" size={28} color="#eee6ab" />
        </TouchableOpacity>
      </View>

      {/* Seletor de Categorias (Tabs) */}
      <View className="flex-row px-6 mt-6 mb-2 border-b border-color2/30">
        <TouchableOpacity 
          onPress={() => setActiveTab('cinematografia')}
          className={`pb-3 mr-8 ${activeTab === 'cinematografia' ? 'border-b-2 border-color5' : ''}`}
        >
          <Text className={`text-base font-bold ${activeTab === 'cinematografia' ? 'text-color5' : 'text-color3'}`}>
            Cinematografia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('literatura')}
          className={`pb-3 ${activeTab === 'literatura' ? 'border-b-2 border-color5' : ''}`}
        >
          <Text className={`text-base font-bold ${activeTab === 'literatura' ? 'text-color5' : 'text-color3'}`}>
            Literatura
          </Text>
        </TouchableOpacity>
      </View>

      {/* Área de Filtros Dinâmica */}
      <View className="py-2">
        <FilterBar
          types={types}
          selectedFilter={filter}
          onFilterChange={setFilter}
        />
      </View>

      {/* Conteúdo Condicional */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#696758" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'literatura' ? books : []} // Aqui depois filtraremos os filmes/séries
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookItem
              book={item}
              typeName={types.find(t => t.id === item.type_id)?.name}
              onDelete={removeBook}
              onIncrement={incrementChapter}
              onDecrement={decrementChapter}
              onEdit={(b) => router.push({ pathname: '/form', params: { id: b.id } })}
            />
          )}
          ListEmptyComponent={
            <EmptyState 
              title={activeTab === 'literatura' ? "Nenhum livro encontrado" : "Nenhum filme ou série"}
              filter={filter} 
            />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}

    </SafeAreaView>
  );
}