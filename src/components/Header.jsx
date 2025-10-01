"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import Carrito from "./Carrito";
import SearchBar from "./SearchBar";

const navigation = [
  { name: "Tienda", href: "/tienda" },
  // { name: 'Features', href: '#' },
  // { name: 'Marketplace', href: '#' },
  // { name: 'Company', href: '#' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50 bg-white border-b-0">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <div className="flex lg:hidden mr-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="flex lg:flex-1">
              <a href="/tienda" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://japhiuwu.github.io/landing-page-vikia/imgs/logo.png"
                  className="h-6 w-auto"
                />
              </a>
            </div>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold hover:cursor-pointer text-gray-900 hover:text-gray-600"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end"></div>
          <div className="lg:flex lg:justify-end">
            <a className="text-sm/6 font-semibold text-white">
              <Carrito />
            </a>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://japhiuwu.github.io/landing-page-vikia/imgs/logo.png"
                  className="h-6 w-auto"
                />
              </a>
            </div>
                <span className="sr-only">VIKIA</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}
