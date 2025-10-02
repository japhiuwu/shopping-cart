"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { supabase } from "../config/supabaseClient";
import Toasts from "./Toasts";
import { useCart } from "./CartContext";

export default function Carrito() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState([]);
  const [productos, setProductos] = useState([]);
  const { cart, removeFromCart } = useCart();
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [qty, setQty] = useState(0);

  const total =
    productos.reduce((acc, item) => {
      return acc + item.productos.precio * item.cantidad;
    }, 0) || 0;

  async function fetchCarrito() {
    const carrito_id = localStorage.getItem("codigo-carrito");

    if(carrito_id){
      const { data, error } = await supabase
        .from("items_carrito")
        .select("*, productos(*)") // hace el inner join con productos
        .eq("carrito_id", carrito_id);
  
      if (error) {
        setToast(["Error cargando carrito", "d", Date.now()]);
      } else {
        console.log(data);
        setProductos(data);
      }
    }
  }

  useEffect(() => {
    fetchCarrito();
  }, [cart]);

  async function removeItem(producto_id, version) {
    const carrito_id = localStorage.getItem("codigo-carrito");
    let { data, error } = await supabase
      .from("items_carrito")
      .delete()
      .eq("carrito_id", carrito_id)
      .eq("producto_id", producto_id)
      .eq("version", version);
    if (error) {
      setToast(["Error al borrar el item", "d", Date.now()]);
    } else {
      setToast(["Se ha borrado el item con éxito", "s", Date.now()]);
      fetchCarrito();
    }
  }

  function setQuantity(index, value) {
    console.log(qty)
    console.log(productos[index].cantidad + value)

    if (productos[index].cantidad + value < 1) 
      return

    if (updateIndex == index || updateIndex == -1) {
      if (productos[index].cantidad + value <= getStock(productos[index])) {
        setUpdateIndex(index);
        setProductos((prevProductos) =>
          prevProductos.map((item, i) =>
            i === index
              ? { ...item, cantidad: Math.max(1, item.cantidad + value) }
              : item
          )
        );
      } else {
        setToast(["Has llegado al límite de stock", "w", Date.now()]);
        return;
      }
    } else {
      setToast(["Confirma los cambios actuales antes de continuar", "w", Date.now()]);
        return;
R    }

    if (qty == productos[index].cantidad + value){
      setUpdateIndex(-1);
      setQty(0)
    } 
    if (qty == 0 && updateIndex == -1)
      setQty(productos[index].cantidad);
  }

  async function updateQuantity(index) {
    const carrito_id = localStorage.getItem("codigo-carrito");

    try {
      const { data, error } = await supabase
        .from("items_carrito")
        .update({ cantidad: productos[index]?.cantidad })
        .eq("carrito_id", carrito_id)
        .eq("producto_id", productos[index]?.producto_id)
        .eq("version", productos[index]?.version)
        .select();

      if (error) {
        console.error(error);
        setToast(["Error al actualizar la cantidad", "d", Date.now()]);
      } else {
        setToast(["Se ha actualizado la cantidad del item", "s", Date.now()]);
        setUpdateIndex(-1);
        fetchCarrito(); // refresca la lista
      }
    } catch (err) {
      console.error(err);
      setToast(["Error al actualizar la cantidad", "d", Date.now()]);
    }
  }

  function getStock(product) {
    const { stock, versiones } = product.productos;

    // Si no hay versiones, devolver el stock[0]
    if (!versiones || !product.version) return stock[0] || 0;

    // Buscar el índice de la versión
    const index = versiones.indexOf(product.version);
    if (index === -1) return 0; // versión no encontrada

    return stock[index] || 0;
  }

  return (
    <>
      <Toasts message={toast[0]} type={toast[1]} id={toast[2]} />
      <div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:text-gray-600 hover:cursor-pointer"
        >
          {!open && (
            <div className="bg-gray-900 text-white rounded-full w-5 h-5 absolute top-4 right-7">
              {productos.length}
            </div>
          )}
          {!open && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="w-8 h-8 text-gray-800"
            >
              <path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z" />
            </svg>
          )}
        </button>
        <Dialog open={open} onClose={setOpen} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
          />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                >
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {productos.map((product, index) => (
                              <li
                                key={product.producto_id + product.version}
                                className="flex py-6"
                              >
                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    alt={product.productos?.nombre}
                                    src={product.productos?.image_url?.[0]}
                                    className="size-full object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={product.href}>
                                          {product.productos?.nombre}
                                        </a>
                                      </h3>

                                      <p className="ml-4">
                                        $
                                        {product.productos?.precio *
                                          product.cantidad}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.version?.toUpperCase()}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex text-gray-500 h-8">
                                      <span className="py-1 mr-2">QTY</span>
                                      <button
                                        onClick={() => setQuantity(index, -1)}
                                        type="button"
                                        data-input-counter-decrement="quantity-input"
                                        className="decrement-button bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg px-1.5 h-7 focus:ring-gray-100 focus:ring-2 focus:outline-none"
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
                                        value={product.cantidad}
                                        data-input-counter
                                        aria-describedby="helper-text-explanation"
                                        className="quantity-input bg-gray-50 border-x-0 border-gray-300 h-7 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-8 py-2"
                                        placeholder="999"
                                        required
                                      />
                                      <button
                                        onClick={() => setQuantity(index, 1)}
                                        type="button"
                                        data-input-counter-increment="quantity-input"
                                        className="increment-button bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg px-2 h-7 focus:ring-gray-100 focus:ring-2 focus:outline-none"
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

                                    <div className="flex">
                                      {(updateIndex != index || qty == product.cantidad) && (
                                        <button
                                          onClick={() =>
                                            removeItem(
                                              product.producto_id,
                                              product.version
                                            )
                                          }
                                          type="button"
                                          className="font-medium  text-red-500 hover:text-red-700"
                                        >
                                          Remove
                                        </button>
                                      )}
                                      {(updateIndex == index && qty != product.cantidad) && (
                                        <button
                                          onClick={() => updateQuantity(index)}
                                          type="button"
                                          className="font-medium  text-indigo-600 hover:text-indigo-500"
                                        >
                                          Update QTY
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${total}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}
