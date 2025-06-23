**Plano de Implementação: Aplicação "Passaporte Competências Digitais"**
========================================================================

=========================================================================

Este documento detalha o plano de implementação para o Produto Mínimo Viável (MVP) da aplicação "Passaporte Competências Digitais", atualizado para a stack tecnológica final baseada em Firebase e GitHub.

### **Medida 1: Configuração e Pré-Produção**

*Fase de preparação do ambiente e organização do projeto.*

-   **1.1. Configuração do Ambiente Técnico:**

    -   **Descrição:** Criar e configurar as ferramentas tecnológicas: o repositório no **GitHub**, o projeto na **Firebase** (ativando os serviços **Firestore**, **Authentication** e **Cloud Functions**) e o workflow de **GitHub Actions** para CI/CD (deployment contínuo para **GitHub Pages**).
-   **1.2. Definição do Modelo de Dados na Firestore:**

    -   **Descrição:** Desenhar e documentar a estrutura das coleções e documentos na base de dados NoSQL (Firestore). Isto inclui definir os campos para as coleções `users`, `courses`, `classes`, `missions`, `blocks`, etc., e como os documentos se relacionam entre si (ex: através de IDs de referência).
-   **1.3. Criação do Backlog do Projeto:**

    -   **Descrição:** Usar uma ferramenta de gestão de projetos (ex: GitHub Projects, Trello) para criar um quadro visual com "cartões" para cada tarefa detalhada neste plano, permitindo organizar e acompanhar o trabalho. (Sem alteração)

### **Medida 2: Desenvolvimento do Backend e Lógica de Negócio na Firebase**

*Fase de construção do "motor" e das regras da aplicação na Firebase.*

-   **2.1. Configuração da Autenticação e Perfis:**

    -   **Descrição:** Implementar o sistema **Firebase Authentication** que permite aos utilizadores criarem uma conta e fazerem login. Desenvolver uma **Cloud Function** que é acionada (`trigger`) a cada novo registo para gerar automaticamente um perfil na coleção `users`.
-   **2.2. Desenvolvimento das Cloud Functions e Queries do Cliente:**

    -   **Descrição:** Desenvolver as duas formas de "conversar" com a base de dados:
        1.  **Queries do Cliente (Firestore SDK):** Implementar no frontend as chamadas para obter dados (ex: a lista de cursos, os detalhes de uma missão).
        2.  **Cloud Functions (Callable):** Criar os endpoints seguros para lógica de negócio crítica (ex: validar códigos de turma, registar o progresso de um bloco, atribuir pontos).
-   **2.3. Implementação da Segurança:**

    -   **Descrição:** Configurar as **Firestore Security Rules**, garantindo que, por regra, um utilizador só pode aceder e modificar os seus próprios dados e que as operações permitidas são estritamente as necessárias para o funcionamento da aplicação.

### **Medida 3: Desenvolvimento do Frontend (Interface do Utilizador)**

*Fase de construção da parte visível da aplicação, o "website interativo".*

-   **3.1. Construção da Estrutura Principal da Aplicação:**

    -   **Descrição:** Desenvolver o layout base com a `Navbar`, a área de conteúdo principal e a `Community Sidebar`, e programar a aplicação para obter os textos da interface a partir da coleção `ui_content` na Firestore.
-   **3.2. Desenvolvimento dos Componentes de Navegação e Descoberta:**

    -   **Descrição:** Criar a página do "Catálogo" que executa uma query à Firestore para buscar e apresentar os cursos e implementar a interação de clique para mostrar os detalhes de uma experiência de aprendizagem.
-   **3.3. Desenvolvimento da Página de Aprendizagem Unificada:**

    -   **Descrição:** Construir o "átrio" do curso e o componente que, em vez de carregar uma nova página, embute o conteúdo da missão (composto por múltiplos blocos obtidos da Firestore) diretamente na área principal.
-   **3.4. Desenvolvimento da Community Sidebar:**

    -   **Descrição:** Construir o componente da sidebar com as suas 3 secções (`My Journey`, `Give Back To:`, `Activity Feed`) e implementar a lógica de cálculo de níveis e a apresentação de notificações, aproveitando as capacidades de tempo real da Firestore.

### **Medida 4: Criação e Integração de Conteúdo**

*Fase de produção de todos os ativos de aprendizagem, visuais e de dados, e de os inserir na plataforma.*

-   **4.1. Desenvolvimento dos Blocos de Conteúdo:**

    -   **Descrição:** Construir o conteúdo HTML de cada bloco individual (`aprender`, `descobrir`, `desafio`, `partilha`) para todas as 5 missões do curso `PASS10`, seguindo as diretrizes do "Guia Técnico e Pedagógico". (Sem alteração)
-   **4.2. "Sementeira" da Base de Dados (Seeding):**

    -   **Descrição:** (Alteração Crítica) O processo agora é mais granular e adaptado à Firestore. Envolve popular as **coleções** da base de dados com os dados iniciais através de scripts:
        1.  Criar os documentos na coleção `digital_skills`.
        2.  Criar o documento `course` PASS10 e associá-lo às competências relevantes.
        3.  Criar os 5 documentos `missions`. Em cada um, **incluir um array com os IDs dos blocos correspondentes**, definindo a ordem correta.
        4.  Criar cada um dos documentos na coleção `blocks`, preenchendo o `category`, `tags`, `points_reward` e o `block_html_content`.
        5.  Criar os documentos `badges` e associá-los aos blocos que os atribuem.
-   **4.3. Criação de Ativos Visuais:**

    -   **Descrição:** Tarefa de design gráfico que consiste em criar os ficheiros de imagem necessários: os 5 ícones para os badges e a imagem de capa para o curso `PASS10`. (Sem alteração)

### **Medida 5: Testes, Avaliação e Lançamento**

*Fase final de garantia de qualidade e preparação para o lançamento da primeira turma.*

-   **5.1. Testes Internos (Alpha):**

    -   **Descrição:** A equipa de desenvolvimento testa exaustivamente todas as funcionalidades para encontrar erros e garantir que tudo funciona conforme o planeado. (Sem alteração)
-   **5.2. Testes com Utilizadores (Beta):**

    -   **Descrição:** Realizar uma sessão piloto com um grupo real de formandos e um formador para recolher feedback sobre a usabilidade, clareza e fator de motivação da plataforma. (Sem alteração)
-   **5.3. Correção de Erros (Bug Fixing):**

    -   **Descrição:** Resolver os problemas técnicos e de usabilidade identificados nas fases de teste. (Sem alteração)
-   **5.4. Lançamento (Deployment):**

    -   **Descrição:** Publicar a versão final e estável da aplicação através do workflow de **GitHub Actions**, que a publica oficialmente no **GitHub Pages**, tornando-a disponível para a primeira turma de formandos.
