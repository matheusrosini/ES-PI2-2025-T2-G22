# Sistema NotaDez — Grupo ES-PI2-2025-T2-G22

## 🏷️ Badges do Projeto

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-black?logo=express)
![OracleDB](https://img.shields.io/badge/Oracle_DB-19c-F80000?logo=oracle)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-blueviolet?logo=jsonwebtokens)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-green?logo=gmail)
![Status](https://img.shields.io/badge/Status-Em_desenvolvimento-yellow)

---

## 📘 Descrição do Projeto

O **Sistema NotaDez** é uma plataforma web desenvolvida para facilitar o gerenciamento acadêmico por parte de docentes.  
Ele permite organizar turmas, cadastrar alunos, importar listas via CSV, lançar notas e exportar resultados, tudo de forma simples e eficiente.

O sistema também conta com autenticação via JWT, recuperação de senha por e-mail e integração com banco de dados Oracle através de Oracle Wallet.

---

## 👥 Equipe — ES-PI2-2025-T2-G22
Leonardo Dionel Lima Silva - RA: 25010092;
Luis Felipe Moura - RA: 25010218;
Matheus Henrique Portugal Narducci - RA: 25008976;
Matheus Rosini Borges de Salles - RA: 25015832;
---

## 🛠 Tecnologias Utilizadas

### **Backend**
- Node.js  
- Express.js  
- JavaScript  
- OracleDB + Oracle Wallet  
- Nodemailer  
- JWT Authentication  
- Multer (upload CSV)  
- BCrypt (hash de senhas)  

### **Frontend**
- HTML5  
- CSS3  
- JavaScript Vanilla  

### **Ferramentas Complementares**
- Day.js  
- Oracle Instant Client  

---

## 📁 Estrutura do Projeto

ES-PI2-2025-T2-G22/
├── pages/ # Interface frontend do sistema
│ ├── alunos.html # Tela de gerenciamento de alunos
│ ├── cursos.html # Tela de gerenciamento de cursos
│ ├── disciplinas.html # Tela de disciplinas
│ ├── index.html # Dashboard inicial
│ ├── login.html # Tela de login
│ ├── notas.html # Lançamento e consulta de notas
│ ├── turma.html # Gerenciamento de turmas
│ ├── usuarios.html # Gestão de contas de usuários
│ ├── reset-password.html # Tela de redefinição de senha
│ │
│ ├── scripts/ # Lógica frontend (JS)
│ │ ├── alunos.js # Funções e requisições de alunos
│ │ ├── cursos.js # Funções e requisições de cursos
│ │ ├── disciplinas.js # Funções de disciplinas
│ │ ├── login.js # Autenticação no frontend
│ │ ├── notas.js # Lançamento e edição de notas
│ │ ├── turma.js # Controle de turmas
│ │ ├── usuarios.js # Cadastro e edição de usuários
│ │ └── reset-password.js # Requisição de redefinição por e-mail
│ │
│ └── styles/ # Estilização das telas (CSS)
│ ├── alunos.css
│ ├── cursos.css
│ ├── disciplinas.css
│ ├── login.css
│ ├── notas.css
│ ├── turma.css
│ ├── usuarios.css
│ └── reset-password.css
│
├── src/ # Código do backend
│ ├── server.js # Inicialização do servidor Express
│ │
│ ├── config/ # Configurações principais
│ │ ├── db.js # Conexão com Oracle usando Oracle Wallet
│ │ └── email.js # Serviço SMTP para recuperação de senha
│ │
│ ├── controllers/ # Regras de negócio e lógica das rotas
│ │ ├── alunoController.js # CRUD de alunos
│ │ ├── cursoController.js # CRUD de cursos
│ │ ├── disciplinaController.js # CRUD de disciplinas
│ │ ├── notaController.js # Lançamento e edição de notas
│ │ ├── turmaController.js # Controle de turmas
│ │ └── usuarioController.js # Autenticação e usuários
│ │
│ ├── middlewares/ # Middlewares usados no backend
│ │ ├── authmiddleware.js # Verificação de token JWT
│ │ └── uploadCSV.js # Upload e leitura de planilhas CSV
│ │
│ ├── routes/ # Rotas organizadas por módulo
│ │ ├── alunoRoutes.js
│ │ ├── cursoRoutes.js
│ │ ├── disciplinaRoutes.js
│ │ ├── notaRoutes.js
│ │ ├── turmaRoutes.js
│ │ └── usuarioRoutes.js
│ │
│ └── utils/
│ └── mailer.js # Função genérica para envio de e-mails
│
├── Wallet_MEUDB/ # Oracle Wallet para conexão segura ao banco
│
├── package.json # Dependências e scripts do projeto
└── README.md # Documentação principal 

---

## ⚙ Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js (LTS recomendado)**  
- **Oracle Database ou Oracle Cloud + Wallet**  
- **Oracle Instant Client**  
- **npm ou yarn**  

---

## 🚀 Instalação e Execução

### 1. Clone o repositório
git clone [(https://github.com/matheusrosini/ES-PI2-2025-T2-G22.git)]
cd ES-PI2-2025-T2-G22

## 2.📦 Instale as Dependências
npm install

## 3.🗃 Configuração do Banco de Dados Oracle

1. Coloque sua Oracle Wallet dentro da pasta:
/Wallet_MEUDB/

2. Configure a conexão no arquivo:
src/config/db.js

3. Ajuste:
usuário
senha
connectString (EX: "meudb_high")

## 4.📧 Configurar Envio de E-mail (Recuperação de Senha)
No arquivo:
src/config/email.js

Configure:

host SMTP (Gmail, Outlook, etc)
porta
usuário de e-mail
senha/app password

## 5.▶️ Iniciar o Servidor
npm start

## 6.🌐 Acessar o Sistema
Abra o arquivo:
pages/login.html

## 7.📌 Funcionalidades do Sistema

👤 Usuários
Cadastro
Login com JWT
Alteração de senha
Recuperação de senha por e-mail

🏫 Turmas
Cadastro
Edição
Listagem
Associação de disciplinas
Visualização de alunos

🧑‍🎓 Alunos
Cadastro manual
Importação via CSV
Edição / exclusão

📝 Notas
Lançamento de notas
Atualização
Remoção
Cálculo automático
Exportação CSV

🔐 Segurança
Proteção de rotas com JWT
Senhas criptografadas (bcrypt)
Validação de token

🗂 Banco de Dados Oracle
O sistema utiliza OracleDB. Para funcionar:
A Wallet deve estar completa e válida;
O arquivo db.js deve estar configurado corretamente;
Tabelas devem existir no schema configurado;
Se quiser, posso criar a documentação SQL também.

## 8. 👨‍💻 Modo de Desenvolvimento
Rodar o servidor com reload automático:
npm run dev

## 9. ⚠ Observações Importantes
Arquivos CSV devem conter Matrícula e Nome nas duas primeiras colunas
Notas devem estar entre 0 e 10
Email só funciona com SMTP configurado
Oracle Wallet é obrigatória para a conexão
Tokens JWT expiram conforme configurado

📄 Licença
Projeto acadêmico desenvolvido para a disciplina Engenharia de Software — PI2.