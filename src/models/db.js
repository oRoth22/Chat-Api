const { MongoClient, ObjectId } = require("mongodb");

let singleton;

let connect = async() => {
  if (singleton) return singleton;

  const client = new MongoClient(process.env.DB_HOST);
  await client.connect();

  singleton = client.db(process.env.DB_DATABASE);
  return singleton;
}

let findAll = async (collection) => {
  const db = await connect();
  return await db.collection(collection).find().toArray();
}

let findOne = async (collection, _id) => {
  const db = await connect();
  let obj = await db.collection(collection).find({ _id: new ObjectId(_id) });
  if (obj)
    return obj[0];
  return false;
}

let insertOne = async(collection,object) => {
  const db = await connect();
  return await db.collection(collection).insertOne(object);
}

let updateOne = async (collection, object, param) => {
  if (typeof param !== 'object' || Object.keys(param).length === 0) {
    console.log('Parameter must be a valid JavaScript object');
  }
  const db = await connect();
  let result = await db.collection(collection).updateOne(param, { $set: { field: false } });
  return result;
}

module.exports = { findAll, findOne, updateOne, insertOne};