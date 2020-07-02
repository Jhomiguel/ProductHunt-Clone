import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
//Errores
import { Error404 } from "../components/Error";
//router next
import { useRouter } from "next/router";
import DetallesProducto from "../components/layout/DetallesProducto";
//Custom Hooks
import useProductos from "../hooks/useProductos";

const Buscar = () => {
  const [resultados, guardarResultado] = useState([]);
  const [error, guardarError] = useState(false);
  const router = useRouter();
  const {
    query: { q },
  } = router;

  //todos los productos
  const { productos } = useProductos("creado");

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    if (Object.keys(filtro).length === 0) guardarError(true);
    else {
      guardarResultado(filtro);
      guardarError(false);
    }
  }, [q, productos]);

  return (
    <div>
      <Layout>
        {error ? (
          <Error404 />
        ) : (
          <div className="listado-productos">
            <div className="contenedor">
              <ul className="bg-white">
                {resultados.map((producto) => (
                  <DetallesProducto key={producto.id} producto={producto} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Buscar;
