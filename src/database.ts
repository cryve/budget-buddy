import * as RxDB from 'rxdb';
import { RxDatabase } from 'rxdb';
import { budgetSchema, transactionSchema } from './schemas';

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http')); // enable syncing over http

const syncURL = `http://${window.location.hostname}:10102/`;
console.log('host: ' + syncURL);

let database: Promise<RxDatabase>; // chached
function getDatabase() {
  if (!database) { database = createDatabase(); }
  return database;
}

async function createDatabase() {
  const db = await RxDB.create({
    name: 'budgetmandb_v8',
    adapter: 'idb',
    password: 'budgetmanager',
    queryChangeDetection: true,
  });

  console.log(db);

  console.log('creating budgets collection...');
  const budgetsCollection = await db.collection({
    name: 'budgets',
    schema: budgetSchema,
  });

  console.log('creating transactions collection...');
  const transactionsCollection = await db.collection({
    name: 'transactions',
    schema: transactionSchema,
  });

  console.log('adding budgets collection hooks...');
  db.collections.budgets.preInsert((docObj) => {
    const title = docObj.title;
    return db.collections.budgets.findOne({ title }).exec().then((budgetWithSameTitle) => {
      if (budgetWithSameTitle != null) {
        throw new Error('title already used');
      }
      return db;
    });
  }, false);

  console.log('starting sync...');
  budgetsCollection.sync({
    remote: syncURL + 'budget/',
  });
  transactionsCollection.sync({
    remote: syncURL + 'transactions/',
  });

  return db;
}

export default getDatabase;
