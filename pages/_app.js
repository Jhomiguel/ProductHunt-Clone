import App from "next/app";
import firebase, { firebaseContext } from "../firebase";
import useAutenticacion from "../hooks/useAutenticacion";
const MyApp = (props) => {
  const usuario = useAutenticacion();

  const { Component, pageProps } = props;

  return (
    <firebaseContext.Provider value={{ firebase, usuario }}>
      <Component {...pageProps} />
    </firebaseContext.Provider>
  );
};

export default MyApp;
