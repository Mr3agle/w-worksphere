import { Client, Account, Databases } from 'appwrite';

const client = new Client();
// const endpoint = "http://localhost/v1"
// const pid = "67aa71f0001f547f161c"
const endpoint = process.env.APPWRITE_ENDPOINT!
const pid = process.env.APPWRITE_PROJECT_ID!

client
    .setEndpoint(endpoint)
    .setProject(pid);


export const databases = new Databases(client)
export const account = new Account(client);
