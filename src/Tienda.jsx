"use client";

import { supabase } from './config/supabaseClient'
import { useState } from "react";
import Productos from "./components/Productos";
import { v4 as uuidv4 } from "uuid";

async function initCarrito() {
  let codigoCliente = localStorage.getItem("codigo-cliente");

  if (!codigoCliente) {
    codigoCliente = uuidv4();
    localStorage.setItem("codigo-cliente", codigoCliente);

    const { dataU, errorU } = await supabase
      .from("usuarios")
      .insert([{ user_id: codigoCliente, nombre: 'Usuario Temporal' }])
      .select();

    if (errorU) {
      console.error("Error creando carrito:", errorU);
    } else {
      console.log("Carrito creado:", dataU);
    }

    const { data, error } = await supabase
      .from("carritos")
      .insert([{ user_id: codigoCliente }])
      .select();

    if (error) {
      console.error("Error creando carrito:", error);
    } else {
      console.log("Carrito creado:", data);
      localStorage.setItem("codigo-carrito", data[0]?.carrito_id);

    }
  } else {
    console.log("Cliente ya tiene código:", codigoCliente);
  }

  return codigoCliente;
}

console.log(initCarrito())

export default function Tienda() {
  return (
    <div className="bg-gray-950">
      <Productos />
    </div>
  );
}
