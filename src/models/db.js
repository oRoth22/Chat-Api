const { MongoClient, ObjectId } = require("mongodb");

let singleton;

async function connect() {
  if (singleton) return singleton;

  const client = new MongoClient(process.env.DB_HOST);
  await client.connect();

  singleton = client.db(process.env.DB_DATABASE);
  return singleton;
}

let findAll = async (collection) => {
  const db = await connect();
  return await db.collection(collection).find({}).toArray();
}

let findOne = async (collection, _id) => {
  const db = await connect();
  let obj = await db.collection(collection).findOne({ _id: new ObjectId(_id) });
  if (obj)
    return obj;
  return false;
}

let updateOne = async (collection, object, param) => {
  const db = await connect();
  let result = await db.collection(collection).updateOne(param, { $set: object });
  return result;
}

module.exports = { findAll, findOne, updateOne };