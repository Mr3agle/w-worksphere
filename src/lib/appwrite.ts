import { Client, Account, Databases, Functions } from 'appwrite';

const client = new Client();
// const endpoint = "http://localhost/v1"
// const pid = "67aa71f0001f547f161c"
const endpoint = process.env.APPWRITE_ENDPOINT!
const pid = process.env.APPWRITE_PROJECT_ID!
const srvTimeFnId = process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_SERVERTIME!
const functions = new Functions(client)

client
    .setEndpoint(endpoint)
    .setProject(pid);


export const databases = new Databases(client)
export const account = new Account(client);

export const getServerTimestamp = () => {
    return functions.createExecution(
      srvTimeFnId, // Reemplaza con el ID de tu función en Appwrite
      '',              // Body (vacío si no se requiere input)
      false,           // Ejecutar de forma sincrónica (false)
      '/',              // Path (opcional)
      'GET' as any,           // Método HTTP (opcional)
      {}               // Headers (opcional)
    )
    .then(
      function (response) {
        // console.log('Respuesta completa:', response);
        // const parsed = JSON.parse(execution.logs);
        // console.log('Parsed response:', parsed);
        // return parsed; 
        return response
      },
      function (error) {
        console.log('Error:', error);
        throw error;
      }
    );
  };
  