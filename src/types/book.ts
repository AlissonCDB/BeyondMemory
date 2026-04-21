// --- Interfaces Principais ---

export interface BookType {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    title: string;
    type_id: BookType['id'];
    chapter: number;
    url: string;
    created_at: string; // formato ISO 8601 ou retornado pelo SQLite
}

// --- Tipos para Filtros ---

/**
 * O filtro pode ser 'all' para exibir tudo 
 * ou o ID numérico de uma categoria específica.
 */
export type BookFilter = 'all' | number;

// --- DTOs (Data Transfer Objects) para Operações ---

/**
 * Dados necessários para criar um novo livro.
 * Omitimos 'id' e 'created_at' pois o SQLite os gera automaticamente.
 */
export interface CreateBookInput {
    title: string;
    type_id: number;
    chapter: number;
    url: string;
}

/**
 * Dados para editar um livro existente.
 * O 'id' é obrigatório para localizar o registro,
 * os demais campos são parciais (opcionais) para permitir atualizações pontuais.
 */
export interface UpdateBookInput extends Partial<CreateBookInput> {
    id: number;
}