import React from 'react';
import { View, Text } from 'react-native';
// Importando o tipo conforme o caminho que você indicou
import { BookFilter } from '../types/book'; 

interface EmptyStateProps {
  filter: BookFilter;
  title?: string; // Adicionando o title como opcional
}

const MESSAGES = {
  empty: {
    emoji: '📚',
    title: 'Sua estante está vazia!',
    subtitle: 'Toque no botão + para adicionar seu primeiro livro, mangá ou HQ.',
  },
  filtered: {
    emoji: '🔍',
    title: 'Nenhum item encontrado',
    subtitle: 'Você ainda não cadastrou nada nesta categoria específica.',
  },
};

export function EmptyState({ filter, title }: EmptyStateProps) {
  // Se o filtro for 'all', mostra mensagem de banco vazio. 
  // Caso contrário, mostra que não há nada naquela categoria.
  const content = filter === 'all' ? MESSAGES.empty : MESSAGES.filtered;

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-6xl mb-4">{content.emoji}</Text>
      <Text className="text-xl font-bold text-gray-700 text-center mb-2">
        {title || content.title}
      </Text>
      <Text className="text-sm text-gray-400 text-center leading-5">
        {content.subtitle}
      </Text>
    </View>
  );
}