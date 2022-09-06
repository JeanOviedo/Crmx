import  {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from 'apollo-link-context';
 

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('tokencrmx');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

   
  const client = new ApolloClient({
    connectToDevTools:true,
    cache:new InMemoryCache(),
    // uri:'http://localhost:4000/',
    link:authLink.concat(httpLink)
  });
 
export default client;