# API Controle financeiro

## Objetivo: 

API criada com o objetivo de permitir ao usuário que gerencie suas finanças de maneira eficaz, fornecendo uma variedade de recursos para controlar suas transações e categorias financeiras. Abaixo, você encontrará uma visão geral das funcionalidades disponíveis e como utilizá-las.

## Funcionalidades

### Autenticação de Usuários

- **Cadastrar Usuário:** Registre-se na plataforma fornecendo informações básicas de nome, e-mail e senha.
- **Fazer Login:** Autentique-se na API para acessar suas informações financeiras, através do e-mail e senha cadastrados.

### Gerenciamento de Perfil

- **Detalhar Perfil do Usuário Logado:** Visualize as informações cadastradas do seu perfil.
- **Editar Perfil do Usuário Logado:** Atualize suas informações pessoais cadastradas.

### Categorias Financeiras

- **Cadastrar categoria:** Crie uma nova categoria financeira.
- **Listar categorias:** Obtenha uma lista de todas as categorias disponíveis.
- **Detalhar categoria:** Visualize detalhes específicos de uma categoria.
- **Editar categoria:** Atualize informações de uma categoria existente.
- **Remover categoria:** Exclua uma categoria financeira.

### Transações Financeiras

- **Cadastrar transação:** Registre uma nova transação financeira.
- **Listar transações:** Obtenha uma lista de todas as transações financeiras.
- **Detalhar transação:** Visualize detalhes específicos de uma transação.
- **Editar transação:** Atualize informações de uma transação existente.
- **Remover transação:** Exclua uma transação financeira.
- **Obter extrato de transações:** Receba um resumo do saldo de todas as suas transações e o seu saldo total.
- **Filtrar transações por categoria:** Visualize transações específicas com base em categorias.

## Segurança de Dados

A segurança foi uma prioridade para o desenvolvimento da API.
Cada usuário só pode acessar e manipular seus próprios dados e transações através da autenticação. Esta API implementa políticas de autenticação e autorização para garantir que os dados financeiros dos usuários permaneçam privados e seguros. 
Todas as senhas são criptografadas para serem salvas no banco de dados.

## Requisitos

Para começar a usar esta API, você precisa ter o seguinte instalado/configurado:

- Node.js
- PostgreSQL (ou outro banco de dados compatível)
- Dependências listadas no arquivo `package.json` instaladas
- Bibliotecas utilizadas para a construção da API:
    - **express** - para configuração da API
    - **pg** - para conexão com banco de dados PostegreSQL
    - **dotenv** - para criação das variáveis de ambiente
    - **bcrypt** - para criptografar as senhas cadastradas
    - **jsonwebtoken** - para autenticar e autorizar o login de usuários
    - **email-validator** - para validar o e-mail cadastrado

## Executando a API

1. Clone este repositório em sua máquina local.

2. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e defina as variáveis necessárias que estão listadas no arquivo `.env.example`.

3. Instale as dependências:
   ```shell
   npm install

4. Inicie o servidor:
   ```shell
   npm run dev

A API estará disponível em `http://localhost:<PORTA>`.

## **Banco de dados**

Você precisa criar um Banco de Dados PostgreSQL com os comandos presentes no arquivo `dump.sql`.
O Banco de Dados contém as seguintes tabelas e colunas:  

-   usuarios
    -   id
    -   nome
    -   email (campo único)
    -   senha
-   categorias
    -   id
    -   usuario_id
    -   descricao
-   transacoes
    -   id
    -   descricao
    -   valor
    -   data
    -   categoria_id
    -   usuario_id
    -   tipo


## Status Codes

Abaixo, listei os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
```

## **Endpoints**

Para utilizar a API de Controle Financeiro, siga estas etapas:<br>
**Atenção!:** A API se comunica recebendo e retornando objetos no formato JSON através corpo (body) da requisição e de resposta.

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa é a rota utilizada para cadastrar um novo usuario no sistema.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes) em um formato JSON:

    -   nome
    -   email
    -   senha

-   **Resposta**  
    Em caso de **sucesso**, será enviado no corpo (body) da resposta o conteúdo do usuário cadastrado, incluindo seu respectivo `id` e excluindo a senha criptografada.
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   email
    -   senha

-   **Resposta**  
    Em caso de **sucesso**, será enviado no corpo (body) da resposta um objeto com a propriedade **token** que deverá possuir como valor o token de autenticação gerado e uma propriedade **usuario** que deverá possuir as informações do usuário autenticado, exceto a senha do usuário.
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
// HTTP Status 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigem o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.

---

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 401
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) poderá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email
    -   senha

-   **Resposta**  
    Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Cadastrar categoria para o usuário logado**

#### `POST` `/categoria`

Essa é a rota que será utilizada para cadastrar uma categoria associada ao usuário logado.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição deverá possuir um objeto com a seguinte propriedade (respeitando este nome):

    -   descricao

-   **Resposta**
    Em caso de **sucesso**, será enviado no corpo (body) da resposta, as informações da categoria cadastrada, incluindo seu respectivo `id`.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// POST /categoria
{
    "descricao": "Mercado"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
    "id": 2,
    "descricao": "Mercado"
    "usuario_id": 1,
}
```

```javascript
// HTTP Status 400
{
    "mensagem": "A descrição da categoria deve ser informada."
}
```

### **Listar categorias do usuário logado**

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas categorias cadastradas.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (categorias) encontrados.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
;[
    {
        id: 1,
        descricao: "Roupas",
        usuario_id: 1,
    },
    {
        id: 2,
        descricao: "Mercado",
        usuario_id: 1,
    },
]
```

```javascript
// HTTP Status 200
;[]
```

### **Detalhar uma categoria do usuário logado**

#### `GET` `/categoria/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas categorias cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da categoria no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa a categoria encontrada, com todas as suas propriedades, conforme exemplo abaixo.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /categoria/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "id": 2,
    "descricao": "Mercado"
    "usuario_id": 1,
}
```

```javascript
// HTTP Status 404
{
    "mensagem": "Categoria não encontrada."
}
```

### **Atualizar categoria do usuário logado**

#### `PUT` `/categoria/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas categorias cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da categoria no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com a seguinte propriedade (respeitando este nome):

    -   descricao

-   **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// PUT /categoria/2
{
    "descricao": "Presentes"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "A descrição da categoria deve ser informada."
}
```

### **Excluir categoria do usuário logado**

#### `DELETE` `/categoria/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas categorias cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da categoria no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// DELETE /categoria/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 404
{
    "mensagem": "Categoria não encontrada."
}
```

### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Essa é a rota utilizada para cadastrar uma transação associada ao usuário logado.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   descricao
    -   valor
    -   data
    -   categoria_id
    -   tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

-   **Resposta**
    Em caso de **sucesso**, o corpo (body) da resposta retorna as informações da transação cadastrada, incluindo seu respectivo `id`.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2023/05/24",
    "categoria_id": 6
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 201
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2023-05-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Listar transações do usuário logado**

#### `GET` `/transacao`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas. 
Nesta funcionalidade de listagem de transações, podemos incluir um parâmetro do tipo query **filtro** para que seja possível consultar apenas transações das categorias informadas.   

-   **Requisição**  
    Parâmetro opcional do tipo query **filtro**.
    Não deverá possuir conteúdo no corpo (body) da requisição.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta retorna um array dos objetos (transações) encontrados.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /transacao
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
;[
    {
        id: 1,
        tipo: "saida",
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T15:35:00.000Z",
        usuario_id: 5,
        categoria_id: 4,
        categoria_nome: "Roupas",
    },
    {
        id: 3,
        tipo: "entrada",
        descricao: "Salário",
        valor: 300000,
        data: "2022-03-24T15:30:00.000Z",
        usuario_id: 5,
        categoria_id: 6,
        categoria_nome: "Salários",
    },
    {
        id: 4,
        tipo: "saida",
        descricao: "Mercado",
        valor: 300000,
        data: "2022-03-24T15:30:00.000Z",
        usuario_id: 5,
        categoria_id: 7,
        categoria_nome: "Alimentação",
    }
]
```

```javascript
// HTTP Status 200
;[]
```
#### **Exemplo de requisição**

```javascript
// GET /produtos?filtro[]=roupas&filtro[]=salários
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
;[
    {
        id: 1,
        tipo: "saida",
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T15:35:00.000Z",
        usuario_id: 5,
        categoria_id: 4,
        categoria_nome: "Roupas",
    },
    {
        id: 3,
        tipo: "entrada",
        descricao: "Salário",
        valor: 300000,
        data: "2022-03-24T15:30:00.000Z",
        usuario_id: 5,
        categoria_id: 6,
        categoria_nome: "Salários",
    },
]
```

```javascript
// HTTP Status 200
;[]
```


### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta retorna um objeto que representa a transação encontrada, com todas as suas propriedades, conforme exemplo abaixo.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// GET /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   descricao
    -   valor
    -   data
    -   categoria_id
    -   tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

-   **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "Informe ao menos um dado para ser atualizado."
}
```

### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, não será enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// DELETE /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Essa é a rota que será chamada quando o usuario logado quiser obter o saldo de todas as suas transações cadastradas por tipo, e o seu saldo total.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

-   **Resposta**  
    Em caso de **sucesso**, será enviado no corpo (body) da resposta um objeto contendo a soma de todas as transações do tipo `entrada`, a soma de todas as transações do tipo `saida` e a diferença entre as transações de `entrada` e `saida`.
    Em caso de **falha na validação**, a resposta deverá possuir um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /transacao/extrato
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
	"entrada": 300000,
	"saida": 15800,
    "total": 284200
}
```

---


###### tags: `back-end` `nodeJS` `PostgreSQL` `API REST`
