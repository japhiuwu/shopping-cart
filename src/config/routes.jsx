import App from "../App";
import Tienda from "../Tienda";
import ErrorPage from "./ErrorPage";
import User from "../components/User"
import Producto from "../Producto"

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "user/:id",
    element: <User />,
  },
  {
    path: "tienda",
    element: <Tienda />,
  },
    {
    path: "producto/:id",
    element: <Producto />,
  },
];

export default routes;
