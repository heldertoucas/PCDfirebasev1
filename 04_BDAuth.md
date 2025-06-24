**Guia Técnico: Configuração da Autenticação e Perfis**
=======================================================

===================================================

**1\. Objetivo**
----------------

Este documento serve como um guia técnico para o programador informático responsável pela implementação da Submedida 2.1: Configuração da Autenticação e Perfis. O seu principal objetivo é detalhar a arquitetura de autenticação na **Firebase** e os passos necessários para a sua execução, tanto no backend (Cloud Functions) como no frontend da aplicação.

**2\. Visão Geral da Arquitetura**
----------------------------------

A nossa abordagem para a gestão de utilizadores na Firebase assenta na separação de responsabilidades, uma prática recomendada para garantir segurança e flexibilidade:

-   **Firebase Authentication:** É um serviço de identidade seguro, gerido pela Google, que trata de todo o ciclo de vida do utilizador (criação, login, gestão de sessões, etc.). Contém informação sensível e nunca é acedido diretamente, apenas através do SDK da Firebase.

-   **Coleção `/users` no Firestore:** É a nossa coleção de perfis, que estende os dados do Firebase Authentication. É aqui que guardamos os dados públicos e relacionados com a aplicação, como o `displayName`, `avatarUrl` e o `totalPoints` do utilizador.

A sincronização entre estes dois serviços é feita de forma automática e segura através de uma **Cloud Function**, que é ativada (`trigger`) sempre que um novo utilizador é criado no Firebase Authentication.

### **Tarefa 1: Configuração do Backend (Cloud Function)**

**Objetivo:** Implementar o automatismo que cria um perfil na nossa coleção `/users` para cada novo utilizador que se regista no sistema de autenticação.

**Instruções para o Programador:**

O seguinte código TypeScript deve ser implementado no ficheiro `index.ts` (ou `index.js`) dentro do diretório `functions/` do seu projeto Firebase. Este código deve ser depois publicado (`deploy`) na cloud.

TypeScript

```
// Ficheiro: functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inicializar a app de admin para que a função possa aceder à base de dados.
admin.initializeApp();
const db = admin.firestore();

/**
 * Trigger que é executado sempre que um novo utilizador é criado no Firebase Authentication.
 * Cria um documento correspondente na coleção 'users' do Firestore.
 */
export const createNewUserProfile = functions.auth.user().onCreate(async (user) => {
  // O objeto 'user' contém dados como uid, email, etc.
  const { uid, email, displayName, photoURL } = user;

  // Referência para o novo documento na coleção 'users'.
  const userRef = db.collection("users").doc(uid);

  // Dados a serem guardados no novo perfil.
  const profileData = {
    email: email,
    displayName: displayName || "Novo Formando", // Valor por defeito
    avatarUrl: photoURL || "", // Valor por defeito
    totalPoints: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // Regista a data de criação
  };

  // Escreve os dados na base de dados.
  return userRef.set(profileData);
});

```

**Validação:** Após fazer o deploy da função, pode verificar se foi criada corretamente na secção "Funções" do seu projeto na consola da Firebase.

### **Tarefa 2: Implementação no Frontend (Código da Aplicação)**

**Objetivo:** Construir as funções no código da aplicação (ex: React) que interagem com o sistema Firebase Authentication.

**Instruções para o Programador:**

As seguintes funções, que usam o SDK da Firebase (`firebase/auth` e `firebase/firestore`), devem ser implementadas no frontend para gerir o ciclo de vida da autenticação do utilizador.

#### **A. Função `signUp` (Registo de Nova Conta)**

*Associada ao formulário de registo.*

JavaScript

```
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

/**
 * Regista um novo utilizador no Firebase Authentication.
 * A Cloud Function tratará de criar o perfil no Firestore.
 * @param {string} email - O email do utilizador.
 * @param {string} password - A password escolhida pelo utilizador.
 * @returns {Promise<{user: object, error: object}>} - Um objeto contendo o utilizador ou um erro.
 */
async function signUp(email, password) {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Sucesso. A Cloud Function 'createNewUserProfile' é ativada automaticamente.
    console.log('Registo bem-sucedido!', userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error) {
    // Devolve o erro para ser tratado pela interface (ex: mostrar uma mensagem).
    console.error('Erro no registo:', error.message);
    return { user: null, error };
  }
}

```

#### **B. Função `signIn` (Login)**

*Associada ao formulário de login.*

JavaScript

```
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

/**
 * Autentica um utilizador existente.
 * @param {string} email - O email do utilizador.
 * @param {string} password - A password do utilizador.
 * @returns {Promise<{user: object, error: object}>} - Um objeto contendo o utilizador ou um erro.
 */
async function signIn(email, password) {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login bem-sucedido!', userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Erro no login:', error.message);
    return { user: null, error };
  }
}

```

#### **C. Função `signOut` (Logout)**

*Associada a um botão de "Sair".*

JavaScript

```
import { getAuth, signOut } from "firebase/auth";

/**
 * Termina a sessão do utilizador atual.
 */
async function logOut() { // Nome alterado para evitar conflito com a palavra 'signOut'
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log('Sessão terminada com sucesso.');
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message);
  }
}

```

#### **D. Função `updateUserProfile` (Atualizar Perfil)**

*Associada a um formulário de "Editar Perfil". Esta função atualiza os dados no Firestore.*

JavaScript

```
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Atualiza o perfil de um utilizador na nossa coleção 'users' no Firestore.
 * @param {object} updates - Um objeto com os campos a atualizar. Ex: { displayName: 'Sofia', avatarUrl: '...' }
 * @returns {Promise<{success: boolean, error: object}>} - Um objeto indicando o sucesso ou o erro da operação.
 */
async function updateUserProfile(updates) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("Nenhum utilizador autenticado para atualizar o perfil.");
    return { success: false, error: { message: "Utilizador não autenticado." } };
  }

  const db = getFirestore();
  const userDocRef = doc(db, "users", user.uid);

  try {
    await updateDoc(userDocRef, updates);
    console.log('Perfil atualizado com sucesso no Firestore!');
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao atualizar o perfil:", error);
    return { success: false, error };
  }
}

```

Com estes passos, o sistema de autenticação e gestão de perfis estará completamente implementado, seguindo as melhores práticas de segurança e eficiência recomendadas para um projeto com Firebase.
