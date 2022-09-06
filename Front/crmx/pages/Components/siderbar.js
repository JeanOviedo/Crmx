import Link from "next/link";
import {useRouter} from "next/router";

export default function Sidebar() {
    const Ruta = useRouter();
    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5  sm:min-h-screen p-5">
            <div>
                <h2 className="text-white text-2xl font-black">CRMX - Clientes</h2>
            </div>
            <nav className="mt-5 list-none">
                <li className={
                    Ruta.pathname === "/" ? "bg-blue-800 p-2" : "p-2"
                }>
                    <Link href="/">
                        <a className="text-white block">Clientes</a>
                    </Link>
                </li>
                <li className={
                    Ruta.pathname === "/pedidos" ? "bg-blue-800 p-2" : "p-2"
                }>
                    <Link href="/pedidos">
                        <a className="text-white  block">Pedidos</a>
                    </Link>
                </li>

                <li className={
                    Ruta.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"
                }>
                    <Link href="/productos">
                        <a className="text-white  block">Productos</a>
                    </Link>
                </li>
            </nav>
        </aside>
    );
}
