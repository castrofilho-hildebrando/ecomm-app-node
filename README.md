# E-commerce API

Uma API RESTful robusta e escalável para e-commerce, desenvolvida com **Node.js**, **Express**, **TypeScript** e **MongoDB**. 

Este projeto demonstra práticas modernas de desenvolvimento backend, incluindo arquitetura em camadas (MVC), autenticação segura com JWT, testes automatizados e validação rigorosa de dados.

## Tecnologias Utilizadas

* **Linguagem:** TypeScript
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Autenticação:** JWT (JSON Web Tokens) & Bcrypt
* **Testes:** Jest & Supertest (Integração e Unitários)
* **Code Quality:** ESLint & Prettier

## Arquitetura e Design Patterns

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado para APIs, garantindo a separação de responsabilidades (SoC):

* **Controllers:** Responsáveis pela regra de negócios e lógica da aplicação.
* **Routes:** Definem apenas os endpoints e middleware de roteamento.
* **Models:** Schemas do Mongoose com tipagem forte via Interfaces TypeScript.
* **Middlewares:** Interceptadores para Autenticação (JWT) e Controle de Acesso (RBAC - Role Based Access Control).

## Funcionalidades

### Autenticação & Segurança
* Registro e Login de usuários.
* Hashing de senha com Bcrypt.
* Proteção de rotas via Token JWT (Bearer).
* Middleware de autorização para rotas administrativas (`isAdmin`).

### E-commerce Core
* **Produtos:** CRUD completo (apenas Admins criam/editam).
* **Carrinho de Compras:** Adicionar, remover e limpar itens (persistente no banco).
* **Pedidos:** Checkout automatizado (converte Carrinho em Pedido) e histórico.
* **Gestão de Estoque:** Validação básica de produtos.

### Dashboard Administrativo
* Estatísticas em tempo real:
    * Total de vendas e receita.
    * Produtos mais vendidos (Agregação MongoDB).
    * Métricas de conversão (Carrinhos vs Pedidos).

## Como Rodar o Projeto

### Pré-requisitos
* Node.js (v14 ou superior)
* MongoDB (Local ou Atlas URI)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/ecommerce-api-ts.git](https://github.com/seu-usuario/ecommerce-api-ts.git)
    cd ecommerce-api-ts
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz (baseado no exemplo abaixo):
    ```env
    PORT=4000
    MONGO_URI=sua_string_de_conexao_mongodb
    JWT_SECRET=seu_segredo_super_seguro
    ```

4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## Testes Automatizados

A aplicação conta com uma suíte de testes de integração cobrindo as principais rotas.

```bash
# Rodar todos os testes
npm test