import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
//Firebase
import { firebaseContext } from "../../firebase";

const Nav = styled.nav`
  padding-left: 2rem;

  a {
    font-size: 1.8rem;
    margin-left: 2rem;
    color: var(--gris2);
    font-family: "PT Sans", sans-serif;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;
const Navegacion = () => {
  const { usuario } = useContext(firebaseContext);
  return (
    <Nav>
      <Link href="/">
        <a>Inicio</a>
      </Link>
      <Link href="/populares">
        <a>Populares</a>
      </Link>
      {usuario ? (
        <Link href="/nuevo-producto">
          <a>Nuevo producto</a>
        </Link>
      ) : null}
    </Nav>
  );
};

export default Navegacion;
