# Exercígor - Gerenciador de Treinos Pessoal

## Visão Geral

Exercígor é um projeto pessoal de aplicação web desenvolvido como uma ferramenta de aprendizado e experimentação com novas tecnologias. Concebido como um gerenciador de treinos e exercícios, este projeto serviu para desenvolvedor e aprimorar habilidades em React, Firebase e outras tecnologias modernas de desenvolvimento web.

Embora desenvolvido para uso pessoal, demonstra a capacidade de criar uma interface intuitiva e funcional que permite aos usuários gerenciar seus planos de treino de forma eficiente.

## Características

- Autenticação de usuário para experiências personalizadas
- Criação e gerenciamento de rotinas de treino
- Adição, edição e remoção de exercícios em cada treino
- Interface responsiva para uso em dispositivos móveis e desktop
- Armazenamento seguro de dados na nuvem

## Tecnologias Utilizadas

- **React**: Para construir a interface do usuário interativa
- **Firebase**: 
  - Firestore para armazenamento de dados
  - Authentication para gerenciamento de usuários
- **React Hook Form**: Para gerenciamento eficiente de formulários
- **Bootstrap**: Para estilização responsiva

## Instalação e Configuração

1. Clone o repositório

```
git clone https://github.com/seu-usuario/exercigor.git
```

2. Instale as dependências

```
cd exercigor
npm install
```

3. Configure o Firebase
- Crie um projeto no Firebase Console
- Adicione um aplicativo web ao seu projeto Firebase
- Copie as credenciais de configuração
- Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:

```
  VITE_API_KEY=sua_api_key
  VITE_AUTH_DOMAIN=seu_auth_domain
  VITE_PROJECT_ID=seu_project_id
  VITE_STORAGE_BUCKET=seu_storage_bucket
  VITE_MESSAGING_SENDER_ID=seu_messaging_sender_id
  VITE_APP_ID=seu_app_id
```

4. Inicie o servidor de desenvolvimento

```
npm run dev
```

## Uso

Após a instalação e configuração, você pode:

1. Conta para testes > teste@teste.com > senhaTeste
2. Adicionar novos treinos
3. Adicionar exercícios aos treinos
4. Editar ou excluir treinos e exercícios existentes
5. Navegar entre diferentes treinos usando a paginação

## Contribuição

Este é um projeto pessoal, mas sugestões e feedback são sempre bem-vindos. Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## Contato

Igor Pereira - icordeiro787@gmail.com

Link do Projeto: https://github.com/igorcsp/exercigor
