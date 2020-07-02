import React, { useState } from "react";
import { css } from "@emotion/core";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
//firebase
import firebase from "../firebase";
//Validaciones
import useValidacion from "../hooks/useValidacion";
import ValidarIniciarSesion from "../validacion/ValidarIniciarSesion";
//Next
import Router from "next/router";

const STATE_INICIAL = {
  email: "",
  password: "",
};
const Login = () => {
  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, ValidarIniciarSesion, iniciarSesion);

  //Extraer campos de valores
  const { email, password } = valores;

  //Funcion que registra a un usuario y lo envia al index
  async function iniciarSesion() {
    //Iniciando Sesion
    try {
      const usuario = await firebase.login(email, password);
      console.log(usuario);
      Router.push("/");
      console.log("Iniciando Sesion");
    } catch (error) {
      console.error("Hubo un error al autenticar el usuario", error.message);
      guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        {/*  //esta etiqueta vacia equivale a un Fragment */}
        <>
          <h1
            css={css`
              text-align: center;
              margin-bottom: 5rem;
            `}
          >
            Iniciar Sesion
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            {errores.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Iniciar Sesion" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default Login;
