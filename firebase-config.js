// firebase-config.js
// Configuración pública de Firebase (no es secreta, está diseñada para
// ir en el cliente). La seguridad real la dan las reglas de Firestore
// y la verificación de contraseña en los servidores de Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNULQgIIG9QAfqQVnN33_gEYF4DibdjKw",
  authDomain: "mi-sitio-admin.firebaseapp.com",
  projectId: "mi-sitio-admin",
  storageBucket: "mi-sitio-admin.firebasestorage.app",
  messagingSenderId: "883016596794",
  appId: "1:883016596794:web:5876e51c205b52de37e403",
  measurementId: "G-34NKF9PHKK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- Autenticación ---------- */

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Ejecuta callback(user) cada vez que cambia el estado de sesión.
export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/* ---------- Proyectos (Firestore) ---------- */

// Escucha en tiempo real la lista de proyectos, ordenados del más nuevo al más viejo.
// callback recibe un array de objetos { id, title, imageUrl, description, stack, githubUrl, demoUrl }
export function watchProjects(callback) {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(projects);
  });
}

export function addProject(project) {
  return addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: serverTimestamp()
  });
}

export function updateProject(id, data) {
  return updateDoc(doc(db, 'projects', id), data);
}

export function deleteProject(id) {
  return deleteDoc(doc(db, 'projects', id));
}
