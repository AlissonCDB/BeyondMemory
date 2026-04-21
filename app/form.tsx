import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BookRepository } from '../src/database/bookRepository';
import { TypeRepository } from '../src/database/typeRepository';
import { BookType } from '../src/types/book';

export default function BookForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [title, setTitle] = useState('');
  const [typeId, setTypeId] = useState<number | null>(null);
  const [chapter, setChapter] = useState('0');
  const [url, setUrl] = useState('');
  const [types, setTypes] = useState<BookType[]>([]);

  useEffect(() => {
    TypeRepository.getAll().then(setTypes);
    if (id) {
        // Se houver ID, carregar dados para edição
        BookRepository.getById(Number(id)).then(book => {
            if (book) {
                setTitle(book.title);
                setTypeId(book.type_id);
                setChapter(book.chapter.toString());
                setUrl(book.url);
            }
        });
    }
  }, [id]);

  const handleSave = async () => {
    if (!title || !typeId) {
      Alert.alert('Erro', 'Por favor, preencha o título e selecione uma categoria.');
      return;
    }

    const bookData = {
      title,
      type_id: typeId,
      chapter: parseInt(chapter) || 0,
      url,
    };

    if (id) {
      await BookRepository.update(Number(id), bookData);
    } else {
      await BookRepository.create(bookData);
    }

    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">{id ? 'Editar Livro' : 'Novo Livro'}</Text>

      <Text className="text-gray-600 mb-2">Título</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: One Piece, O Senhor dos Anéis..."
        className="bg-gray-100 p-4 rounded-xl mb-4"
      />

      <Text className="text-gray-600 mb-2">Categoria</Text>
      <View className="flex-row flex-wrap mb-4">
        {types.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => setTypeId(type.id)}
            className={`mr-2 mb-2 px-4 py-2 rounded-lg ${
              typeId === type.id ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <Text className={typeId === type.id ? 'text-white' : 'text-gray-600'}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-gray-600 mb-2">Capítulo Atual</Text>
      <TextInput
        value={chapter}
        onChangeText={setChapter}
        keyboardType="numeric"
        className="bg-gray-100 p-4 rounded-xl mb-4"
      />

      <Text className="text-gray-600 mb-2">URL (Opcional)</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://..."
        autoCapitalize="none"
        className="bg-gray-100 p-4 rounded-xl mb-8"
      />

      <TouchableOpacity 
        onPress={handleSave}
        className="bg-indigo-600 p-4 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-lg">Salvar na Estante</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}