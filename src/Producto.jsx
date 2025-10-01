import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./config/supabaseClient";
import { useCart } from "./components/CartContext";
import Toasts from "./components/Toasts";

function Producto() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState({});
  const [version, setVersion] = useState();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState([]);

  useEffect(() => {
    const fetchProducto = async () => {
      let { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("producto_id", id);

      if (error) {
        setToast(["Error al obtener el producto","d",Date.now()]);
      } else {
        if (data[0].versiones == null) {
          setVersion(0);
          document.getElementById("quantity-span").style.display = "block";
        }
        setProducto(data[0]);
      }
    };

    fetchProducto();

    const actualizarVistoProducto = async () => {
      let { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("producto_id", id);
        if (error) {
        console.error(error)
      } else {
        console.log(data)
      }
    };

    actualizarVistoProducto();
  }, []);

  function selectVersion(index) {
    document.getElementById("quantity-span").style.display = "block";
    setVersion(index);
    setQuantity(1);
    if (producto.image_url?.length >= index) {
      setActiveImage(index + 1);
    }
  }

  async function AgregarCarrito() {
    if(version >= 0){
      const cantidad = Number(document.getElementById("quantity-input").value);

      if (cantidad < 1) {
        setToast(["La cantidad debe ser mayor a 0","w",Date.now()]);
      } else {
        const carrito_id = localStorage.getItem("codigo-carrito");
        const versionNombre = producto.versiones?.[version];
        const { data, error } = await supabase
          .from("items_carrito")
          .insert({
            carrito_id,
            producto_id: producto.producto_id,
            cantidad,
            version: versionNombre,
          })
          .select("*");

        if (error) {
          setToast(["Error agregando al carrito","d",Date.now()]);
        } else {
          setToast(["Agregado al carrito con éxito","s",Date.now()]);
          addToCart(producto);
        }
      }
    } else {
      setToast(["Debe escoger una versión","w",Date.now()]);
    }
  }

  return (
    <>
      <Toasts message={toast[0]} type={toast[1]} id={toast[2]}/>
      <div className="pt-24 min-h-full">
        <div className="bg-white">
          <div className="pt-6">
            <nav aria-label="Breadcrumb">
              <ol
                role="list"
                className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
              >
                <li key={producto.produco_id}>
                  <div className="flex items-center">
                    <a
                      href={producto.produco_id}
                      className="mr-2 text-sm font-medium text-gray-900"
                    >
                      {producto.nombre}
                    </a>
                    <svg
                      fill="currentColor"
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>

                <li className="text-sm">
                  <a
                    href={producto.produco_id}
                    aria-current="page"
                    className="font-medium text-gray-500 hover:text-gray-600"
                  >
                    {producto.nombre}
                  </a>
                </li>
              </ol>
            </nav>

            {/* Image gallery */}
            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
              <img
                alt={producto.nombre}
                src={
                  Array.isArray(producto.image_url)
                    ? producto.image_url[activeImage] || producto.image_url[0]
                    : producto.image_url
                }
                // src={producto.image_url}
                className="row-span-2 aspect-square size-full rounded-lg object-cover"
              />
              {/* <img
                alt={producto.nombre}
                src={producto.image_url}
                className="col-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
              />
              <img
                alt={producto.nombre}
                src={producto.image_url}
                className="col-start-2 row-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
              />
              <img
                alt={producto.nombre}
                src={producto.image_url}
                className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
              /> */}
            </div>

            {/* producto info */}
            <div className="mx-auto max-w-2xl px-2 pt-4 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-4 lg:pb-24">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {producto.nombre}
                </h1>
                <div className="space-y-6 mt-2">
                  <p className="text-xl text-gray-900">
                    {producto.descripcion_corta}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">producto information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  ${producto.precio}
                </p>

                {/* Reviews */}
                {/* <div className="mt-6">
                  <h3 className="sr-only">Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          aria-hidden="true"
                          className={classNames(
                            reviews.average > rating
                              ? "text-gray-900"
                              : "text-gray-200",
                            "size-5 shrink-0"
                          )}
                        />
                      ))}
                    </div>
                    <p className="sr-only">{reviews.average} out of 5 stars</p>
                    <a
                      href={reviews.href}
                      className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {reviews.totalCount} reviews
                    </a>
                  </div>
                </div> */}

                <form className="mt-10">
                  {/* Colors */}
                  <div>
                    {producto.versiones != null && (
                      <>
                        <h3 className="text-sm font-medium text-gray-900">
                          Versiones
                        </h3>

                        <fieldset aria-label="Choose a color" className="mt-4">
                          <div className="flex items-center gap-x-3">
                            {producto.versiones.map((version, index) => (
                              <label
                                key={version}
                                aria-label={version}
                                className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-indigo-600 has-checked:bg-indigo-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo-600 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
                              >
                                <input
                                  onClick={() => selectVersion(index)}
                                  defaultValue={version}
                                  name="size"
                                  type="radio"
                                  disabled={producto.stock[index] <= 0}
                                  className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                                />
                                <span className="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
                                  {version}
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </>
                    )}
                  </div>

                  <span id="quantity-span" className="hidden">
                    <label
                      htmlFor="quantity-input"
                      className="block mt-4 mb-3 text-sm font-medium text-gray-900"
                    >
                      {producto?.stock?.[version] > 0
                        ? "Escoge una cantidad:"
                        : "Sin Stock"}
                    </label>
                    {producto?.stock?.[version] > 0 && (
                      <div className="relative flex items-center max-w-[8rem]">
                        <button
                          onClick={() =>
                            setQuantity((q) =>
                              Math.max(
                                producto?.stock?.[version] > 0 ? 1 : 0,
                                q - 1
                              )
                            )
                          }
                          type="button"
                          id="decrement-button"
                          data-input-counter-decrement="quantity-input"
                          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                        >
                          <svg
                            className="w-3 h-3 text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 1h16"
                            />
                          </svg>
                        </button>
                        <input
                          type="text"
                          readOnly
                          value={quantity}
                          id="quantity-input"
                          data-input-counter
                          aria-describedby="helper-text-explanation"
                          className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5"
                          placeholder="999"
                          required
                        />
                        <button
                          onClick={() =>
                            setQuantity((q) =>
                              q < producto?.stock?.[version] ? q + 1 : q
                            )
                          }
                          type="button"
                          id="increment-button"
                          data-input-counter-increment="quantity-input"
                          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                        >
                          <svg
                            className="w-3 h-3 text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 1v16M1 9h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </span>

                  <button
                    disabled={producto?.stock?.[version] <= 0}
                    type="button"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent 
                              bg-indigo-600 px-8 py-3 text-base font-medium text-white 
                              hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden
                              disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                    onClick={() => AgregarCarrito()}
                  >
                    Agregar al Carrito
                  </button>
                </form>
              </div>

              <div className="py-2 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-2 lg:pr-8 lg:pb-16">
                {/* Description and details */}
                {producto.detalles != null && (
                  <div className="mt-10">
                    <h3 className="text-sm font-medium text-gray-900">
                      Highlights
                    </h3>

                    <div className="mt-4">
                      <ul
                        role="list"
                        className="list-disc space-y-2 pl-4 text-sm"
                      >
                        {producto.detalles.map((highlight) => (
                          <li key={highlight} className="text-gray-400">
                            <span className="text-gray-600">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">Details</h2>

                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-gray-600">
                      {producto.descripcion}
                    </p>
                  </div>
                </div>

                {producto.tags != null && (
                  <div className="mt-10">
                    <h3 className="text-sm font-medium text-gray-900">Tags</h3>

                    <div className="mt-4">
                      <ul role="list" className="list-disc space-y-2  text-sm">
                        {producto.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex mr-2 items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 inset-ring inset-ring-indigo-400/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Producto;
