**Guia Técnico: Desenvolvimento da API e Funções de Negócio na Firebase**
=========================================================================

========================================================================

**1\. Objetivo**
----------------

Este documento serve como um guia técnico para o programador informático responsável pela implementação da lógica de negócio da aplicação. O seu objetivo é detalhar a arquitetura das **queries ao Firestore** e das **Cloud Functions** necessárias para que a aplicação interaja com a nossa base de dados, que assenta num modelo de conteúdo modular e numa arquitetura não-relacional (NoSQL).

**2\. Visão Geral da Arquitetura**
----------------------------------

A interação com a Firebase divide-se em duas categorias principais:

1.  **Queries Diretas ao Firestore (Client-Side):** Para operações de leitura de dados não sensíveis (ex: obter a lista de cursos, ler o conteúdo de um bloco). O frontend, usando o SDK da Firebase, comunica diretamente com a base de dados, aproveitando a sua performance e capacidades de tempo real. A segurança é garantida pelas **Firestore Security Rules**.

2.  **Cloud Functions (Server-Side):** Para operações sensíveis, transacionais ou com lógica de negócio complexa (ex: inscrever um utilizador numa turma, atribuir pontos). Estas são funções JavaScript/TypeScript que correm num ambiente seguro da Google e são acionadas a partir do frontend. São o equivalente direto às antigas funções `RPC` do Supabase.

* * * * *

### **Tarefa 1: API para Conteúdo do Curso (Queries no Cliente)**

*Estas funções obtêm a informação para apresentar o catálogo e o conteúdo modular das missões. Serão implementadas no código do frontend (React).*

#### **A. Obter a Lista de Cursos para o Catálogo**

JavaScript

```
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config"; // A sua configuração da Firebase

/**
 * Obtém a lista de todos os cursos ativos para o catálogo.
 */
async function getCoursesForCatalog() {
  const coursesCol = collection(db, 'courses');
  const q = query(coursesCol, where("isActive", "==", true));

  try {
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return courses;
  } catch (error) {
    console.error("Erro ao obter cursos:", error);
    return [];
  }
}

```

#### **B. Obter os Blocos de uma Missão**

A lógica agora é em dois passos: obter o documento da missão para saber a ordem dos blocos, e depois obter os documentos desses blocos.

JavaScript

```
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";

/**
 * Obtém a lista ordenada de blocos para uma missão específica.
 * @param {string} missionId - O ID do documento da missão.
 * @returns {Promise<Array>} Uma lista de objetos de bloco, ordenada.
 */
async function getBlocksForMission(missionId) {
  try {
    // 1. Obter o documento da missão para aceder ao array de IDs dos blocos
    const missionRef = doc(db, "missions", missionId);
    const missionSnap = await getDoc(missionRef);

    if (!missionSnap.exists()) {
      throw new Error("Missão não encontrada!");
    }

    const blockIds = missionSnap.data().blockIds;
    if (!blockIds || blockIds.length === 0) {
        return []; // Missão sem blocos
    }

    // 2. Obter todos os documentos dos blocos correspondentes de uma só vez
    const blocksCol = collection(db, 'blocks');
    const q = query(blocksCol, where("__name__", "in", blockIds));
    const querySnapshot = await getDocs(q);
    const blocksMap = new Map(querySnapshot.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }]));

    // 3. Ordenar os resultados de acordo com o array original
    const orderedBlocks = blockIds.map(id => blocksMap.get(id)).filter(Boolean); // filter(Boolean) remove nulos se algum bloco não for encontrado

    return orderedBlocks;

  } catch (error) {
    console.error("Erro ao obter blocos da missão:", error);
    return [];
  }
}

```

* * * * *

### **Tarefa 2: API para Gestão de Turmas (Cloud Function)**

*Esta função é crucial para a inscrição por código. Por ser uma operação sensível, é implementada como uma **Callable Cloud Function**.*

#### **A. Inscrever um Utilizador numa Turma (Cloud Function)**

**Instrução para o Programador:** Implementar esta função no diretório de `functions` do seu projeto Firebase e fazer o deploy.

TypeScript

```
// Ficheiro: functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const enrollInClass = functions.https.onCall(async (data, context) => {
  // 1. Validar a autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "O utilizador não está autenticado.");
  }
  const userId = context.auth.uid;
  const classCode = data.classCode;

  if (!classCode) {
    throw new functions.https.HttpsError("invalid-argument", "O código da turma é obrigatório.");
  }

  // 2. Encontrar a turma pelo código
  const classesRef = db.collection("classes");
  const classQuery = await classesRef.where("classCode", "==", classCode).limit(1).get();

  if (classQuery.empty) {
    throw new functions.https.HttpsError("not-found", "Código da turma inválido.");
  }

  const targetClass = classQuery.docs[0];
  const targetClassId = targetClass.id;
  const targetCourseId = targetClass.data().courseId;

  // 3. Verificar se já existe uma inscrição ativa para o mesmo curso (OPCIONAL, mas recomendado)
  // Esta lógica pode ser complexa e omitida para o MVP inicial se necessário.

  // 4. Inscrever o utilizador
  const enrollmentRef = db.collection("users").doc(userId).collection("enrollments").doc(targetClassId);

  await enrollmentRef.set({
    status: "ativo",
    enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
    courseId: targetCourseId, // Desnormalizado para facilitar queries
  });

  return { success: true, classId: targetClassId, courseId: targetCourseId };
});

```

* * * * *

### **Tarefa 3: API para Progresso e Gamificação (Cloud Function)**

*Esta é a função principal de gamificação. Por modificar dados do utilizador (pontos, progresso), é uma **Callable Cloud Function** transacional para garantir a consistência dos dados.*

#### **A. Marcar um Bloco como Concluído (Cloud Function)**

**Instrução para o Programador:** Implementar esta função no diretório de `functions`.

TypeScript

```
// Ficheiro: functions/src/index.ts (continuação)
export const completeBlock = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "O utilizador não está autenticado.");
  }
  const userId = context.auth.uid;
  const blockId = data.blockId;

  if (!blockId) {
    throw new functions.https.HttpsError("invalid-argument", "O ID do bloco é obrigatório.");
  }

  const userRef = db.collection("users").doc(userId);
  const blockRef = db.collection("blocks").doc(blockId);
  const progressRef = userRef.collection("progress").doc(blockId);

  // Executar como uma transação para garantir atomicidade
  await db.runTransaction(async (transaction) => {
    const blockDoc = await transaction.get(blockRef);
    if (!blockDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Bloco não encontrado.");
    }

    // 1. Registar a conclusão do bloco
    transaction.set(progressRef, { completedAt: admin.firestore.FieldValue.serverTimestamp() });

    // 2. Atribuir pontos ao utilizador
    const pointsToAdd = blockDoc.data()?.pointsReward || 0;
    if (pointsToAdd > 0) {
      transaction.update(userRef, { totalPoints: admin.firestore.FieldValue.increment(pointsToAdd) });
    }

    // 3. Verificar e atribuir badge, se existir
    const badgeQuery = await db.collection("badges").where("blockId", "==", blockId).limit(1).get();
    if (!badgeQuery.empty) {
        const badgeId = badgeQuery.docs[0].id;
        const userBadgeRef = userRef.collection("badges").doc(badgeId);
        transaction.set(userBadgeRef, { earnedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
  });

  return { success: true };
});

```

* * * * *

### **Tarefa 4: API para Interação Social (Queries no Cliente)**

*Estas funções serão implementadas no frontend para o "Ponto de Partilha".*

#### **A. Obter Mensagens do Mural**

JavaScript

```
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";

/**
 * Obtém as mensagens de um mural específico de uma turma.
 * @param {string} classId - O ID da turma.
 */
async function getMuralMessages(classId) {
  const messagesRef = collection(db, `classes/${classId}/messages`);
  const q = query(messagesRef, orderBy("createdAt", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return messages;
  } catch (error) {
    console.error("Erro ao obter mensagens do mural:", error);
    return [];
  }
}

```

#### **B. Publicar uma Mensagem no Mural**

JavaScript

```
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase-config";

/**
 * Publica uma nova mensagem no mural de uma turma.
 * @param {string} content - O texto da mensagem.
 * @param {string} classId - O ID da turma.
 * @param {string} blockId - O ID do bloco de partilha.
 */
async function postMessage(content, classId, blockId) {
  const user = auth.currentUser;
  if (!user) return { error: "Utilizador não autenticado." };

  try {
    const messagesRef = collection(db, `classes/${classId}/messages`);
    await addDoc(messagesRef, {
      content,
      blockId,
      authorId: user.uid,
      authorName: user.displayName, // Desnormalizado para fácil acesso
      authorAvatar: user.photoURL, // Desnormalizado para fácil acesso
      likedByUsers: [], // Array inicial de gostos
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao publicar mensagem:", error);
    return { error: error.message };
  }
}

```

* * * * *

### **Tarefa 5: Visão Geral das Firestore Security Rules**

A segurança, que antes era gerida por RLS, é agora controlada pelo ficheiro `firestore.rules` no projeto Firebase. Este ficheiro define quem pode ler, escrever e apagar dados em cada coleção.

**Instrução para o Programador:** Desenvolver e testar as regras de segurança. Abaixo, um exemplo da estrutura e de algumas regras essenciais para o MVP:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Utilizadores só podem ler e escrever no seu próprio perfil.
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId;
    }

    // Qualquer utilizador autenticado pode ler os dados públicos dos cursos, missões e blocos.
    match /{collectionName=courses|missions|blocks}/{docId} {
      allow get: if request.auth != null;
    }

    // Apenas utilizadores inscritos na turma podem ler os seus detalhes e mensagens.
    function isEnrolled(classId) {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid)/enrollments/$(classId));
    }

    match /classes/{classId} {
      allow get: if request.auth != null && isEnrolled(classId);

      // Apenas utilizadores inscritos podem publicar mensagens.
      match /messages/{messageId} {
        allow read: if isEnrolled(classId);
        allow create: if request.auth != null
                      && isEnrolled(classId)
                      && request.resource.data.authorId == request.auth.uid;
      }
    }
  }
}

```
