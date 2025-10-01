import { supabase } from '../config/supabaseClient'
import { useState, useEffect } from 'react'

export default function Example() {
    const [productos, setProductos] = useState([])
    
    useEffect(() => {
    const fetchProductos = async () => {
    let { data, error } = await supabase
        .from('productos')
        .select('producto_id,descripcion,image_url,nombre,descripcion_corta,precio')

      if (error) {
        console.error(error)
      } else {
        console.log(data)
        setProductos(data)
      }
    }

    fetchProductos()
  }, [])
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2> */}

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {productos.map((product) => (
            <div key={product.producto_id} className="group relative">
              <img
              alt={product.descripcion}
              src={product.image_url[0]}
              className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={"producto/" + product.producto_id}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.nombre}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.descripcion_corta}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
