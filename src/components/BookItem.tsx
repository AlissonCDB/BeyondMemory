import React from 'react';
import { View, Text, TouchableOpacity, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types/book';

interface BookItemProps {
  book: Book;
  typeName?: string;
  onDelete: (id: number) => void;
  onIncrement: (book: Book) => void;
  onDecrement: (book: Book) => void; // <-- Nova prop
  onEdit: (book: Book) => void;
}

export function BookItem({ book, typeName, onDelete, onIncrement, onDecrement, onEdit }: BookItemProps) {
  const handleOpenUrl = () => {
    if (book.url) Linking.openURL(book.url);
  };

  return (
    <View className="bg-white rounded-3xl mb-4 overflow-hidden shadow-sm border border-slate-100">
      <View className="p-5 flex-row items-center">
        
        {/* Lado Esquerdo: Info (Toque para editar) */}
        <Pressable 
          className="flex-1" 
          onPress={() => onEdit(book)}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <View className="flex-row items-center mb-1">
            <Text className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
              {typeName || 'Geral'}
            </Text>
          </View>
          
          <Text className="text-xl font-bold text-slate-800 leading-tight" numberOfLines={2}>
            {book.title}
          </Text>
          
          <View className="flex-row items-center mt-3">
            <View className="bg-slate-100 px-3 py-1 rounded-lg">
              <Text className="text-xs font-bold text-slate-600">
                CAP. {book.chapter}
              </Text>
            </View>
            {book.url && (
              <TouchableOpacity onPress={handleOpenUrl} className="ml-3">
                <Ionicons name="link" size={18} color="#6366f1" />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>

        {/* Lado Direito: Controles de Capítulo (Stepper) */}
        <View className="flex-row items-center ml-4 bg-slate-50 rounded-2xl p-1 border border-slate-100">
          
          {/* Botão Menos */}
          <TouchableOpacity 
            onPress={() => onDecrement(book)}
            disabled={book.chapter <= 0} // Evita capítulos negativos
            className={`w-10 h-10 items-center justify-center rounded-xl ${book.chapter <= 0 ? 'opacity-20' : ''}`}
          >
            <Ionicons name="remove" size={20} color="#64748b" />
          </TouchableOpacity>

          <View className="w-[1px] h-6 bg-slate-200 mx-1" />

          {/* Botão Mais */}
          <TouchableOpacity 
            onPress={() => onIncrement(book)} 
            className="w-10 h-10 bg-indigo-600 items-center justify-center rounded-xl shadow-sm shadow-indigo-200"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Botão de Lixeira (Discreto no canto) */}
        <TouchableOpacity 
          onPress={() => onDelete(book.id)}
          className="absolute top-2 right-2 p-2"
        >
          <Ionicons name="trash-outline" size={16} color="#fda4af" />
        </TouchableOpacity>

      </View>
      
      {/* Detalhe visual de progresso */}
      <View className="h-1 w-full bg-slate-50">
        <View className="h-full bg-indigo-400 w-1/4 opacity-20" />
      </View>
    </View>
  );
}