import React, { useContext, useEffect, useState } from "react";
//firebase
import { firebaseContext } from "../firebase";

const useProductos = (orden) => {
  const [productos, guardarProductos] = useState([]);
  //Context con las operaciones CRUD de firebase
  const { firebase } = useContext(firebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db
        .collection("productos")
        .orderBy(orden, "desc")
        .onSnapshot(manejarSnapshot);
    };
    obtenerProductos();
  }, []);

  //Snapshot para acceder a los registros
  const manejarSnapshot = (snapshot) => {
    const productos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    guardarProductos(productos);
  };

  return { productos };
};

export default useProductos;
