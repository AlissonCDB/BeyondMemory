import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { BookRepository } from '../database/bookRepository';
import { Book } from '../types/book';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BookRepository.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const filteredBooks = books.filter((book) => {
    if (selectedTypeId === 'all') return true;
    return book.type_id === selectedTypeId;
  });

  const removeBook = useCallback(
    async (id: number) => {
      try {
        await BookRepository.delete(id);
        await loadBooks();
      } catch (error) {
        console.error('Erro ao remover livro:', error);
      }
    },
    [loadBooks],
  );

  const incrementChapter = useCallback(
    async (book: Book) => {
      try {
        const newChapter = (book.chapter || 0) + 1;

        // Enviamos um objeto limpo, apenas com o que o UPDATE espera
        await BookRepository.update(book.id, {
          title: book.title,
          type_id: book.type_id,
          chapter: newChapter,
          url: book.url
        });

        await loadBooks();
      } catch (error) {
        console.error('Erro ao incrementar:', error);
      }
    },
    [loadBooks]
  );

  const decrementChapter = useCallback(
    async (book: Book) => {
      try {
        if (book.chapter <= 0) return;

        const newChapter = book.chapter - 1;

        await BookRepository.update(book.id, {
          title: book.title,
          type_id: book.type_id,
          chapter: newChapter,
          url: book.url
        });

        await loadBooks();
      } catch (error) {
        console.error('Erro ao decrementar:', error);
      }
    },
    [loadBooks]
  );

  return {
    books: filteredBooks,
    totalCount: books.length,
    filter: selectedTypeId,
    loading,
    setFilter: setSelectedTypeId,
    removeBook,
    incrementChapter,
    decrementChapter, // Não esqueça de exportar aqui!
    refreshBooks: loadBooks
  };
}