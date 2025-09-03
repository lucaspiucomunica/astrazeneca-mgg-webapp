import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Configurações otimizadas para modo quiosque
  maxPoolSize: 10, // Máximo de 10 conexões no pool
  serverSelectionTimeoutMS: 5000, // 5 segundos para selecionar servidor
  socketTimeoutMS: 45000, // 45 segundos timeout de socket
  connectTimeoutMS: 10000, // 10 segundos para conectar
  heartbeatFrequencyMS: 10000, // Heartbeat a cada 10 segundos
  retryWrites: true, // Retry automático para writes
  retryReads: true, // Retry automático para reads
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global;

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
