import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({ 
  title = "Sua estante esta vazia", 
  description = "Comece adicionando filmes e series clicando no botao superior.",
  icon = "film-outline"
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-10">
      {/* Container do Icone com Fundo Sutil */}
      <View className="w-24 h-24 bg-slate-100 rounded-full items-center justify-center mb-6">
        <Ionicons name={icon} size={48} color="#475569" />
      </View>

      {/* Texto Principal */}
      <Text className="text-xl font-bold text-slate-800 text-center mb-2">
        {title}
      </Text>

      {/* Subtexto Descritivo */}
      <Text className="text-sm text-slate-500 text-center leading-5">
        {description}
      </Text>
      
      {/* Elemento Decorativo Inferior */}
      <View className="w-12 h-1 bg-slate-200 rounded-full mt-8" />
    </View>
  );
}