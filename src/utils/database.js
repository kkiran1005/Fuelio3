import { openDB } from 'idb';

const DB_NAME = 'fuelio-db';
const DB_VERSION = 1;
const STORE_NAME = 'fuel-records';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('date', 'date');
        store.createIndex('odometer', 'odometer');
      }
    },
  });
};

export const addFuelRecord = async (record) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const id = await store.add({
    ...record,
    date: new Date().toISOString(),
  });
  await tx.done;
  return id;
};

export const getAllFuelRecords = async () => {
  const db = await initDB();
  return db.getAllFromIndex(STORE_NAME, 'date');
};

export const getFuelRecord = async (id) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

export const updateFuelRecord = async (id, record) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({ ...record, id });
  await tx.done;
};

export const deleteFuelRecord = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
};

export const calculateEfficiency = (fuelAmount, distance) => {
  if (!fuelAmount || !distance) return null;
  return (distance / fuelAmount).toFixed(2);
};

export const calculateAverageEfficiency = (records) => {
  if (records.length === 0) return 0;
  
  const sortedRecords = [...records].sort((a, b) => 
    a.odometer - b.odometer
  );
  
  let totalDistance = 0;
  let totalFuel = 0;
  
  for (let i = 1; i < sortedRecords.length; i++) {
    const distance = sortedRecords[i].odometer - sortedRecords[i - 1].odometer;
    totalDistance += distance;
    totalFuel += sortedRecords[i].fuelAmount;
  }
  
  return totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : 0;
};
