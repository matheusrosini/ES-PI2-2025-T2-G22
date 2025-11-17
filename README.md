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
Leonardo Dionel Lima Silva - RA: 25010092
Luis Felipe Moura - RA: 25010218
Matheus Henrique Portugal Narducci - RA: 25008976
Matheus Rosini Borges de Salles - RA: 25015832
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

## 📁 Estrutura Completa do Projeto

ES-PI2-2025-T2-G22/
├── pages/
│ ├── alunos.html
│ ├── cursos.html
│ ├── disciplinas.html
│ ├── index.html
│ ├── login.html
│ ├── notas.html
│ ├── turma.html
│ ├── usuarios.html
│ ├── reset-password.html
│ ├── scripts/
│ │ ├── alunos.js
│ │ ├── cursos.js
│ │ ├── disciplinas.js
│ │ ├── login.js
│ │ ├── notas.js
│ │ ├── turma.js
│ │ ├── usuarios.js
│ │ └── reset-password.js
│ └── styles/
│ ├── alunos.css
│ ├── cursos.css
│ ├── disciplinas.css
│ ├── login.css
│ ├── notas.css
│ ├── turma.css
│ ├── usuarios.css
│ └── reset-password.css
│
├── src/
│ ├── server.js
│ ├── config/
│ │ ├── db.js
│ │ └── email.js
│ ├── controllers/
│ │ ├── alunoController.js
│ │ ├── cursoController.js
│ │ ├── disciplinaController.js
│ │ ├── notaController.js
│ │ ├── turmaController.js
│ │ └── usuarioController.js
│ ├── middlewares/
│ │ ├── authmiddleware.js
│ │ └── uploadCSV.js
│ ├── routes/
│ │ ├── alunoRoutes.js
│ │ ├── cursoRoutes.js
│ │ ├── disciplinaRoutes.js
│ │ ├── notaRoutes.js
│ │ ├── turmaRoutes.js
│ │ └── usuarioRoutes.js
│ └── utils/
│ └── mailer.js
│
├── Wallet_MEUDB/ # Oracle Wallet
├── package.json
└── README.md

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
git clone [URL_DO_REPOSITORIO]
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