

import Layout from './Components/layout'
import {gql, useQuery} from "@apollo/client";
import {useRouter} from "next/router";

const CLIENTES_USUARIO = gql `
  query ObtenerClientesVendedor {
  obtenerClientesVendedor {
    id
    nombre
    apellido
    empresa 
    email
  }
}
`;

export default function Index() {
  const ruta = useRouter();
// Consulta de Apollo
const { data, loading, error} = useQuery (CLIENTES_USUARIO);
console.log(data) ;
console.log(loading) ;
console.log(error);

if(loading) return 'Cargando....';
if (!data) {
  return  ruta.push('/login');
}
  return (
   <div>
<Layout>
<h1 className="text-2x1 text-gray-800 font-light">Clientes</h1>


<table className="table-auto shadow-md mt-10 w-full w-lg " >
        <thead className="bg-gray-800" >
          <tr className="text-white" >
            <th className="w-1/5 py-2" >Nombre</th>
            <th className="w-1/5 py-2" >Empresa</th>
            <th className="w-1/5 py-2" >Email</th>
 
          </tr>
 
        </thead>
        <tbody className="bg-white" >
          {data.obtenerClientesVendedor.map( cliente => (
            <tr key={cliente.id} >
              <td className="border px-4 py-2" > {cliente.nombre}  {cliente.apellido} </td>
              <td className="border px-4 py-2" > {cliente.empresa}</td>
              <td className="border px-4 py-2" > {cliente.email}</td>
            </tr>
 
          ))}
 
        </tbody>
 
      </table>

</Layout>

   </div>
  )
}
