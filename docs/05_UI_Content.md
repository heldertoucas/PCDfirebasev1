**Conteúdo da Interface da Aplicação (ui_content)**
===================================================

===============================================

Este documento contém todo o texto da interface para o MVP da aplicação "Passaporte Competências Digitais". Cada item tem uma `chave` única, que será usada no código para obter o texto, e um `valor`, que é o texto apresentado ao utilizador.

### **Geral & Barra de Navegação**

| **Chave** | **Valor (Texto)** |
| `app_title_short` | Passaporte CD |
| `app_title_full` | Passaporte Competências Digitais |
| `navbar_catalog` | Passaporte Competências Digitais |
| `navbar_my_learning` | A Minha Aprendizagem |
| `navbar_user_settings` | Definições |
| `navbar_user_logout` | Sair |
| `footer_copyright` | © {year} Passaporte Competências Digitais. Todos os direitos reservados. |
| `general_loading_message` | A carregar... |
| `text_loading_ellipsis` | A carregar texto... |

### **Autenticação (Auth Component)**

| **Chave** | **Valor (Texto)** |
| `auth_login_title` | Iniciar Sessão |
| `auth_signup_title` | Criar Conta |
| `auth_email_label` | Email |
| `auth_email_placeholder` | O seu email |
| `auth_password_label` | Palavra-passe |
| `auth_password_placeholder` | A sua palavra-passe |
| `auth_password_hint` | A palavra-passe deve ter pelo menos 6 caracteres. |
| `auth_login_button` | Iniciar Sessão |
| `auth_signup_button` | Criar Conta |
| `auth_loading_button` | A processar... |
| `auth_switch_to_signup_button` | Não tem conta? Criar Conta |
| `auth_switch_to_login_button` | Já tem uma conta? Iniciar Sessão |
| `auth_signup_success_message` | Registo efetuado! Verifique o seu email para o link de confirmação. |

### **Conta de Utilizador (Account Component)**

| **Chave** | **Valor (Texto)** |
| `account_page_title` | A Minha Conta |
| `account_welcome_message` | Bem-vindo(a) de volta! |
| `account_email_label` | Email: |
| `account_userid_label` | User ID: |
| `account_logout_button` | Terminar Sessão |
| `account_logout_loading_button` | A terminar sessão... |

### **Mensagens de Erro e Sucesso**

| **Chave** | **Valor (Texto)** |
| `error_generic_message` | Ocorreu um erro inesperado. Por favor, tente novamente. |
| `error_auth_default` | Ocorreu um erro durante a autenticação. |
| `error_signout_default` | Ocorreu um erro ao terminar a sessão. |
| `error_loading_ui_content` | Erro ao carregar o conteúdo da interface. A tentar novamente... |
| `success_message_default` | Operação concluída com sucesso! |

### **Página do Catálogo**

| **Chave** | **Valor (Texto)** |
| `catalog_title` | Passaporte Competências Digitais |
| `catalog_subtitle` | Explore as 10 competências digitais e comece a sua jornada de aprendizagem. Escolha uma competência para ver as experiências disponíveis. |
| `catalog_coming_soon_tag` | Em breve |
| `catalog_experience_button` | Saber Mais e Aderir → |

### **Página da Experiência de Aprendizagem (O "Átrio")**

**--- (Estado: Pendente) ---**

| **Chave** | **Valor (Texto)** |
| `course_pending_title` | Inscrição Pendente |
| `course_pending_description` | Para ativar este curso e aceder às missões, por favor insira abaixo o código de acesso fornecido pelo seu formador na primeira sessão. |
| `course_pending_input_placeholder` | Insira o código da turma |
| `course_pending_button` | Ativar Curso |
| `course_code_invalid_error` | O código inserido não é válido. Por favor, verifique e tente novamente. |

**--- (Estado: Ativo) ---**

| **Chave** | **Valor (Texto)** |
| `course_active_progress_label` | O seu progresso: |
| `course_active_missions_completed` | Missões Concluídas |
| `course_certificate_button` | Ver Certificado na Plataforma CML |

**--- (Secções de Informação) ---**

| **Chave** | **Valor (Texto)** |
| `course_section_about_title` | Sobre o curso |
| `course_section_objectives_title` | Para que serve? |
| `course_section_audience_title` | A quem se destina? |
| `course_section_info_title` | Informações Práticas |

**--- (Lista de Missões) ---**

| **Chave** | **Valor (Texto)** |
| `mission_status_completed` | Concluída |
| `mission_status_in_progress` | A decorrer |
| `mission_status_locked` | Bloqueada |
| `mission_button_start` | Começar |
| `mission_button_continue` | Continuar |

### **Community Sidebar**

| **Chave** | **Valor (Texto)** |
| `sidebar_journey_title` | A Minha Jornada |
| `sidebar_giveback_title` | Dê o seu reconhecimento a: |
| `sidebar_feed_title` | Feed de Atividades |
| `sidebar_empty_feed` | Ainda não há atividade no seu feed. Comece uma missão para ganhar os seus primeiros pontos! |

**--- (Modal de Reconhecimento) ---**

| **Chave** | **Valor (Texto)** |
| `recognition_modal_title` | Reconhecer |
| `recognition_modal_badge_label` | Atribuir uma Medalha Digital ❤️ |
| `recognition_modal_points_label` | Enviar Pontos ⭐️ |
| `recognition_modal_note_label` | Adicionar uma nota (opcional) |
| `recognition_modal_button_send` | Enviar Reconhecimento |
| `recognition_modal_success` | O seu reconhecimento foi enviado com sucesso! |

### **Modelos de Notificações (Activity Feed)**

*(Estes são modelos; a aplicação irá substituir `{X}` pelos valores reais)*

| **Chave** | **Valor (Texto)** |
| `notification_mission_completed` | 🏆 Parabéns! Concluiu a "{mission_title}" e ganhou {points_amount} pontos! |
| `notification_badge_earned` | 🏅 Medalha Desbloqueada! Conquistou o badge "{badge_name}". |
| `notification_badge_received` | ❤️ {actor_name} atribuiu-lhe o badge "{badge_name}". |
| `notification_points_received` | ⭐️ {actor_name} enviou-lhe {points_amount} pontos. |
| `notification_welcome` | 👋 Bem-vindo(a) à plataforma! Estamos entusiasmados por tê-lo(a) connosco nesta jornada de aprendizagem. |

* * * * *

**Implementação Técnica (Firebase/GitHub Stack)**
-------------------------------------------------

Na nossa arquitetura com Firebase e GitHub, **não iremos utilizar uma tabela na base de dados** para armazenar este conteúdo estático. Em vez disso, para máxima performance e simplicidade no MVP, estes textos serão guardados num **ficheiro JSON local**, diretamente no código fonte da aplicação (React).

Este método oferece várias vantagens:

-   **Performance:** O texto está disponível instantaneamente, sem necessidade de chamadas à base de dados, eliminando latência no carregamento da interface.
-   **Simplicidade:** Reduz a complexidade do backend.
-   **Versionamento:** O conteúdo da interface é versionado juntamente com o código da aplicação no GitHub, garantindo consistência entre versões.

**Instrução para o Programador:**

Criar um ficheiro, por exemplo em `src/content/ui_text.json`, com o seguinte formato, contendo todas as chaves e valores definidos nas tabelas acima.

### **Exemplo do Ficheiro `ui_text.json`:**

JSON

```
{
  "app_title_short": "Passaporte CD",
  "app_title_full": "Passaporte Competências Digitais",
  "navbar_my_learning": "A Minha Aprendizagem",
  "navbar_user_settings": "Definições",
  "navbar_user_logout": "Sair",
  "footer_copyright": "© {year} Passaporte Competências Digitais. Todos os direitos reservados.",
  "general_loading_message": "A carregar...",
  "auth_login_title": "Iniciar Sessão",
  "auth_signup_title": "Criar Conta",
  "auth_email_label": "Email",
  "auth_email_placeholder": "O seu email",
  "auth_password_label": "Palavra-passe",
  "auth_password_placeholder": "A sua palavra-passe",
  "auth_login_button": "Iniciar Sessão",
  "auth_signup_button": "Criar Conta",
  "auth_switch_to_signup_button": "Não tem conta? Criar Conta",
  "auth_switch_to_login_button": "Já tem uma conta? Iniciar Sessão",
  "catalog_title": "Passaporte Competências Digitais",
  "catalog_subtitle": "Explore as 10 competências digitais e comece a sua jornada de aprendizagem. Escolha uma competência para ver as experiências disponíveis.",
  "notification_badge_earned": "🏅 Medalha Desbloqueada! Conquistou o badge \"{badge_name}\".",
  "notification_welcome": "👋 Bem-vindo(a) à plataforma! Estamos entusiasmados por tê-lo(a) connosco nesta jornada de aprendizagem."
}

```
