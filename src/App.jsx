import { useState, useEffect } from "react";
import Hero from "./components/Hero";

const albums = [
  {
    nombre: "Right Place, Wrong Person",
    artista: "RM",
    precio: 35,
    image_url:
      "https://lightupk.com/cdn/shop/files/RM_RPWP__oe__ProductThumbnail_All_HQ.jpg?v=1714101703&width=1946",
  },
  {
    nombre: "Beautiful Chaos",
    artista: "Katseye",
    precio: 35,
    image_url:
      "https://nolae.eu/cdn/shop/files/katseye-beautiful-chaos-nolae-605048.jpg?v=1746611053&width=1024",
  },
];

const merch = [
  {
    nombre: "PHOTO-FOLIO Me, Myself, and RM: Entirety",
    precio: 20,
    image_url:
      "https://images.squarespace-cdn.com/content/v1/5aa2069c25bf02363bf5c7c4/1661310497649-SPUPAMPCJYZZ5WFMOFBI/rm-special-photo-folio-entirety-product-1.jpg",
  },
  {
    nombre: "Lightstick Katseye",
    precio: 50,
    image_url:
      "https://www.kpoptown.com/176856-medium_default/-pre-order-katseye-official-light-stick.jpg",
  },
];

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans">
      {/* Hero */}
      <Hero />


<div className="relative h-[600px] overflow-hidden">
  <img
    className="absolute top-0 left-0 w-full h-auto min-h-full object-cover"
    src="https://res.cloudinary.com/dr5gfo075/image/upload/v1759293978/Dise%C3%B1o_sin_t%C3%ADtulo_mzuuc4.png"
    alt="Imagen parallax"
    style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
  />

  {/* Overlay oscuro para mejorar contraste */}
  <div className="absolute inset-0 bg-black/35"></div>

  {/* Texto */}
  <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
      Sobre Nosotros
    </h2>
    <p className="max-w-2xl text-lg md:text-xl text-white drop-shadow-md">
      Bienvenido a nuestra tienda de música y merchandising. Aquí encontrarás
      tus álbumes favoritos, merch exclusivo y todo lo que necesitas para
      estar al día con tus artistas preferidos.
    </p>
  </div>
</div>





      {/* Sección de Álbumes */}
      <section className="py-16 px-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">
          Álbumes Destacados
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {albums.map((album, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={album.image_url}
                alt={album.nombre}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{album.nombre}</h3>
                <p className="text-gray-600">{album.artista}</p>
                <p className="mt-2 font-semibold">${album.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Merch */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Merchandising
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {merch.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.image_url}
                alt={item.nombre}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{item.nombre}</h3>
                <p className="mt-2 font-semibold">${item.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Contáctanos</h2>
        <form className="max-w-xl mx-auto grid gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="border rounded p-2"
          />
          <input
            type="email"
            placeholder="Correo"
            className="border rounded p-2"
          />
          <textarea
            placeholder="Mensaje"
            className="border rounded p-2"
          ></textarea>
          <button className="bg-indigo-600 text-white rounded py-2 px-4 hover:bg-indigo-700 transition">
            Enviar
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        &copy; 2025 Tu Tienda de Música. Todos los derechos reservados.
      </footer>
    </div>
  );
}
