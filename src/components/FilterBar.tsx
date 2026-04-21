import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { BookType, BookFilter } from '../types/book';

interface FilterBarProps {
  types: BookType[];
  selectedFilter: BookFilter;
  onFilterChange: (filter: BookFilter) => void;
}

export function FilterBar({ types, selectedFilter, onFilterChange }: FilterBarProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="max-h-12 mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <TouchableOpacity
        onPress={() => onFilterChange('all')}
        className={`mr-2 px-4 py-2 rounded-full border ${
          selectedFilter === 'all' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'
        }`}
      >
        <Text className={selectedFilter === 'all' ? 'text-white font-bold' : 'text-gray-600'}>
          Todos
        </Text>
      </TouchableOpacity>

      {types.map((type) => (
        <TouchableOpacity
          key={type.id}
          onPress={() => onFilterChange(type.id)}
          className={`mr-2 px-4 py-2 rounded-full border ${
            selectedFilter === type.id ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'
          }`}
        >
          <Text className={selectedFilter === type.id ? 'text-white font-bold' : 'text-gray-600'}>
            {type.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}