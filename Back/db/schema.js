const { gql } = require("apollo-server");

// Shema
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Cliente {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }



  input ClienteInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }


  input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Float!
  }



  input AutenticarInput {
    email: String!
    password: String!
  }

  type Token {
    token: String
  }
  type Producto {
    id: ID
    nombre: String
    existencia: String
    precio: Float
    creado: String
  }
  type Query {
    # Usuario
    obtenerUsuario(token: String!): Usuario
    # Producto
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto
    # Cliente
    obtenerClientes: [Cliente]
    obtenerClientesVendedor: [Cliente]
    obtenerCliente (id: ID!) :Cliente
  }
  type Mutation {
    # Usuario
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    # Producto
    nuevoProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID, input: ProductoInput): Producto
    eliminarProducto(id: ID!) : String

    #Clientes
    nuevoCliente(input: ClienteInput) : Cliente
    actualizarCliente(id: ID!, input: ClienteInput): Cliente
    eliminarCliente(id: ID!) : String

  }
`;

module.exports = typeDefs;
