# BeyondMemory 📽️📚

**BeyondMemory** é uma plataforma mobile desenvolvida com **React Native** e **Expo**, projetada para centralizar o histórico de mídias consumidas pelo usuário. Seja um filme, uma série ou um anime, o objetivo é garantir que você não perca seu histórico, independentemente de mudanças nas plataformas de streaming ou do passar do tempo.

---

## 🚀 Funcionalidades Principais

- **Histórico Multi-mídia**: Armazenamento de progresso de leitura (livros/mangás) e visualização (séries/filmes/animes).
- **Persistência Local**: Uso de banco de dados SQLite para garantir que seus dados estejam sempre disponíveis offline.
- **Integração com TMDB**: Busca de informações atualizadas sobre filmes e séries através da API do The Movie Database (TMDB).
- **Gestão de Progresso**: Controle detalhado de temporadas de séries e status de leitura.

---

## 🛠️ Stack Tecnológica

O projeto utiliza as tecnologias mais modernas do ecossistema mobile:

- **Framework**: [Expo](https://expo.dev/) (SDK 54) com [Expo Router](https://expo.github.io/router/) para navegação baseada em arquivos.
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) para maior segurança e produtividade.
- **Estilização**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para React Native) para layouts responsivos e rápidos.
- **Banco de Dados**: [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) para armazenamento relacional local.
- **Animações**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) e [Gestures Handler](https://docs.swmansion.com/react-native-gesture-handler/).

---

## 📂 Estrutura do Projeto

A arquitetura segue padrões de separação de responsabilidades (Repository/Service Pattern):

```text
BeyondMemory/
├── .github/workflows/    # Automação de CI/CD (Build de APK via GitHub Actions)
├── app/                  # Rotas e telas principais (Expo Router)
│   ├── _layout.tsx       # Configuração global de layout
│   └── index.tsx         # Tela inicial da aplicação
├── assets/               # Imagens, ícones e splash screens
├── src/
│   ├── components/       # Componentes de UI reutilizáveis (Modais, Itens de Lista)
│   ├── database/         
│   │   ├── repositories/ # Camada de acesso ao banco de dados (Movies/Series)
│   │   ├── services/     # Integração com APIs externas (TMDB Service)
│   │   └── db.ts         # Configuração e migrações do SQLite
│   └── types/            # Definições de interfaces e tipos TypeScript
├── tailwind.config.js    # Configurações do NativeWind/Tailwind
└── package.json          # Gerenciamento de dependências e scripts
