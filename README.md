# FS App E-commerce - Backend

Este é o back-end de uma aplicação de e-commerce robusta, construída com **Node.js** e **TypeScript**. O projeto utiliza princípios de **Clean Architecture** e **DDD (Domain-Driven Design)** para garantir escalabilidade, testabilidade e manutenção facilitada.

## 🚀 Tecnologias Utilizadas

* **Runtime:** Node.js
* **Linguagem:** TypeScript
* **Framework Web:** Express
* **Banco de Dados:** MongoDB (via Mongoose)
* **Containerização:** Docker & Docker Compose
* **Testes:** Jest (Unitários e Integração)
* **Padronização:** ESLint
* **Padrões de Projeto:**
    * Dependency Injection (Inversão de Controle)
    * Outbox Pattern (Garantia de entrega de eventos)
    * Repository Pattern
    * Domain Events & Use Cases

## 🏗️ Arquitetura e Organização

O projeto segue uma estrutura de camadas para separar as regras de negócio das preocupações de infraestrutura:

* `src/domain`: Entidades, objetos de valor, serviços de domínio e interfaces de repositórios (regras de negócio puras).
* `src/application`: Casos de uso (Use Cases) e handlers de eventos.
* `src/infra`: Implementações concretas de repositórios (MongoDB), integração com banco de dados e drivers externos.
* `src/controllers`: Adaptadores de entrada para as rotas da API.
* `src/middlewares`: Segurança, autenticação (Admin/User) e tratamento de erros.

## 🛠️ Como Executar

### Pré-requisitos
* Docker e Docker Compose instalados.

### Passo a Passo

1.  **Clonar o repositório:**
    ```bash
    git clone git@github.com:castrofilho-hildebrando/ecomm-app-node.git
    cd ecomm-app-node
    ```

2.  **Configurar variáveis de ambiente:**
    Crie um arquivo `.env` na raiz (baseado no `.env.example`, se disponível).

3.  **Subir o ambiente com Docker:**
    ```bash
    docker-compose up -d
    ```

4.  **Instalar dependências locais (opcional para desenvolvimento):**
    ```bash
    npm install
    ```

5.  **Executar em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🧪 Testes

O projeto conta com uma suíte de testes automatizados cobrindo unitários e integração:

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm test -- --watch