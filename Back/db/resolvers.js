var bcryptjs = require("bcryptjs");
const Usuario = require("../models/Usuarios");
const Cliente = require("../models/Clientes");
const jwt = require("jsonwebtoken");
const Productos = require("../models/Productos");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  // console.log(usuario);
  const { id, email, nombre, apellido } = usuario;

  return jwt.sign(
    {
      id,
      email,
      nombre,
      apellido,
    },
    secreta,
    { expiresIn }
  );
};
// Resolver
const resolvers = {
  // Query : {
  //     obtenerCurso : (_, {input}, ctx, info)=> {
  //         const resultado = cursos.filter(curso => curso.grado === input.grado);
  //         return resultado;
  //     }
  // },

  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRETA);
      return usuarioId;
    },
    obtenerProductos: async () => {
      try {
        const produc = await Productos.find({});
        return produc;
      } catch (error) {
        console.log(error);
      }
    },

    obtenerProducto: async (_, { id }) => {
      // revisar si el producto existe o no
      const producto = await Productos.findById(id);

      if (!producto) {
        throw new Error(`Producto ${id} not found`);
      }

      return producto;
    },

    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {}
    },

    obtenerClientesVendedor: async (_, {}, ctx) => {
      try {
        const clientes = await Cliente.find({
          vendedor: ctx.usuario.id.toString(),
        });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },

    obtenerCliente: async (_, { id }, ctx) => {
      // Revisar si cliente existe

      const cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error(`Cliente ${id} not found`);
      }

      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error(`sin credenciales`);
      }
      return cliente;
    },
  },
  // ___________________________Mutation_____________________________________
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      // Revisar usuario registrado
      const { email, password } = input;
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error(`Usuario ya esta registrado`);
      }

      // Hashear password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);
      try {
        const user = new Usuario(input);
        user.save(); // save user input
        return user;
      } catch (error) {
        console.log(error);
      }
    },

    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;

      // Si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      // Revisar si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("El Password es Incorrecto");
      }

      // Crear el token
      return {
        token: crearToken(existeUsuario, `${process.env.SECRETA}`, "8h"),
      };
    },

    nuevoProducto: async (_, { input }) => {
      try {
        const newProducto = new Producto(input);
        // Guardar el producto
        const resultado = await newProducto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    actualizarProducto: async (_, { id, input }) => {
      // revisar si el producto existe o no
      let producto = await Productos.findById(id);

      if (!producto) {
        throw new Error(`Producto no encontrado ${id} `);
      }

      // guardarlo en la base de datos
      producto = await Productos.findOneAndUpdate(
        {
          _id: id,
        },
        input,
        { new: true }
      );

      return producto;
    },

    eliminarProducto: async (_, { id }) => {
      let producto = await Productos.findById(id);
      if (!producto) {
        throw new Error(`Producto no encontrado ${id} `);
      }
      await Productos.findByIdAndDelete({ _id: id });
      return "Producto eliminado";
    },

    nuevoCliente: async (_, { input }, ctx) => {
      console.log(ctx);

      const { email } = input;
      // Verificar si el cliente ya esta registrado
      // console.log(input);

      const cliente = await Cliente.findOne({ email });
      if (cliente) {
        throw new Error("Ese cliente ya esta registrado");
      }

      const nuevoCliente = new Cliente(input);

      // asignar el vendedor
      nuevoCliente.vendedor = ctx.usuario.id;

      // guardarlo en la base de datos

      try {
        const resultado = await nuevoCliente.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },

    actualizarCliente: async (_, {id, input}, ctx) => {
        // Verificar si existe o no
        let cliente = await Cliente.findById(id);

        if(!cliente) {
            throw new Error('Ese cliente no existe');
        }

        // Verificar si el vendedor es quien edita
        if(cliente.vendedor.toString() !== ctx.usuario.id ) {
            throw new Error('No tienes las credenciales');
        }

        // guardar el cliente
        cliente = await Cliente.findOneAndUpdate({_id : id}, input, {new: true} );
        return cliente;
    },


    eliminarCliente: async (_, {id}, ctx) => {
     // Verificar si existe o no
     let cliente = await Cliente.findById(id);

     if(!cliente) {
         throw new Error('Ese cliente no existe');
     }

     // Verificar si el vendedor es quien edita
     if(cliente.vendedor.toString() !== ctx.usuario.id ) {
         throw new Error('No tienes las credenciales');
     }

      // eliminar  el cliente
      cliente = await Cliente.findOneAndDelete({_id : id});
      return "Cliente eliminado";

    }

  },
};

module.exports = resolvers;
