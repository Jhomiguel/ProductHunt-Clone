import app from "firebase/app";
//Autenticancion de firebase
import "firebase/auth";
import firebaseConfig from "./config";
//Firestore
import "firebase/firestore";
//Storage
import "firebase/storage";

class Firebase {
  constructor() {
    //En caso de que no haya una aplicacion inicializada
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }
  //Registra un usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return await nuevoUsuario.user.updateProfile({
      displayName: nombre,
    });
  }
  //Iniciar Sesion del usuario
  async login(email, password) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  //Cierra la sesion del usuario
  async cerrarSesion() {
    await this.auth.signOut();
  }
}

const firebase = new Firebase();
export default firebase;
