import React, { useEffect, useContext, useState } from "react";
import Layout from "../../components/layout/Layout";
//Errores
import { Error404 } from "../../components/Error";
//next
import { useRouter } from "next/router";
//firebase
import { firebaseContext } from "../../firebase";
//styled
import styled from "@emotion/styled";
import { css } from "@emotion/core";
//Date
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
//Css
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

//styled components
const ConternedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //State del componente
  const [producto, guardarProducto] = useState({});
  const [comentario, guardarComentario] = useState({});
  const [consultardb, guardarConsultarDB] = useState(true);
  const [error, guardarError] = useState(false);

  //Routing y destructuring para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //Context de firebase
  const { firebase, usuario } = useContext(firebaseContext);

  //Para obtener producto y evitar el null al momento de consultar el id por primera vez
  useEffect(() => {
    if (id && consultardb) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();

        if (producto.exists) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id, consultardb]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //Verificar si el usuario actual ya ha votado
    if (haVotado.includes(usuario.uid)) return;

    //guardar el Id del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //obtener y sumar un voto
    const nuevoTotal = votos + 1;

    //Actualizar en la base de datos
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    //Actualizar en el state productos
    guardarProducto({ ...producto, votos: nuevoTotal });

    guardarConsultarDB(true); //Como hay un voto se vuelve a consultar a la base de datos
  };

  //Funciones para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("/");
    }

    //informacion extra del comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //tomar copia de los comentarios y agregarlos a la matriz
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar la base de datos
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ comentarios: nuevosComentarios });

    //Actualizar el state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    guardarConsultarDB(true); //Como hay un voto se vuelve a consultar a la base de datos
  };

  //funcion que revisa que el creador del del producto sea el mismo que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id === ususario.uid) {
      return true;
    }
  };

  //Elimina un producto de la base de datos
  const eliminarProducto = async () => {
    if (!usuario) return router.push("/");
    if (creador.id !== usuario.uid) return router.push("/");

    try {
      await firebase.db.collection("productos").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      {error ? (
        <Error404 />
      ) : (
        <>
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 4rem;
              `}
            >
              {nombre}
            </h1>
            <ConternedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlimagen} />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          placeholder="Agrega tu comentario"
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;

                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:{" "}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ConternedorProducto>
            {usuario && puedeBorrar && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Producto;
