import Layout from "./Components/layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useState} from "react";
import {useRouter} from "next/router";

const AUTENTICAR_USUARIO = gql `
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;
const Login = () => {
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const [Mensaje, setMensaje] = useState(null);
    const router = useRouter();


    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },

        validationSchema: Yup.object(
            {email: Yup.string().email("El email no es válido").required("El email no puede ir vacio"), password: Yup.string().required('El password es obligatorio')}
        ),

        onSubmit: async valores => {
            console.log(valores);
            const {email, password} = valores;
            try {
                const {data} = await autenticarUsuario({
                    variables: {
                        input: {
                            email: email,
                            password: password

                        }
                    }
                })
                setMensaje(`Iniciando...`);
                const {token}  = data.autenticarUsuario;
                localStorage.setItem('tokencrmx', token);

                setTimeout(() => {
                    setMensaje(null);
                    router.push("/");
                }, 2000);

            } catch (error) {
                setMensaje(error.message.replace("GraphQL error: ", ""));
                console.log("error", error.message);
                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
            }
        }
    });


    const mostrarMensaje = () => {
      return (
        <div className="bg-white rounded  py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p>{Mensaje}</p>
        </div>
      );
    };

    return (
        <>
            <Layout>
            {Mensaje && mostrarMensaje()}
                <h1 className="text-center text-2xl text-white font-light">Login</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={
                                formik.handleSubmit
                        }>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>

                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email Usuario"
                                    value={
                                        formik.values.email
                                    }
                                    onChange={
                                        formik.handleChange
                                    }/>
                            </div>

                            {
                            formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{
                                        formik.errors.email
                                    }</p>
                                </div>
                            ) : null
                        }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>

                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password Usuario"
                                    value={
                                        formik.values.password
                                    }
                                    onChange={
                                        formik.handleChange
                                    }/>
                            </div>

                            {
                            formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{
                                        formik.errors.password
                                    }</p>
                                </div>
                            ) : null
                        }
                            <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercas  hover:bg-gray-900 cursor-pointer" value="Iniciar Sesión"/>
                        </form>
                    </div>
                    {" "} </div>
            </Layout>
        </>
    );
};

export default Login;
