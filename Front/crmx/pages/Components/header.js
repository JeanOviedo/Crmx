import {gql, useQuery} from "@apollo/client";
import { useRouter} from "next/router";

const OBTENER_USUARIO = gql `
query obtenerUsuario {
  obtenerUsuario {
    id
    nombre
    apellido
  }
}
`;
const Header = () => {

    const ruta = useRouter();

    const HandleClose = () => {
        localStorage.removeItem("tokencrmx");
        ruta.push('/login');
    }

    const {data, loading, error} = useQuery(OBTENER_USUARIO);

    if (loading) 
        return null;
    

    if (!data) {
        return   ruta.push('/login');
    }


    const {nombre, apellido} = data.obtenerUsuario;


    return (
        <div className="flex justify-between mb-6">
            <p className="mr-2">Hola: {nombre}</p>

            <button type="button" className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md "
                onClick={HandleClose}>Cerrar Sesión</button>
        </div>
    );
};

export default Header;
