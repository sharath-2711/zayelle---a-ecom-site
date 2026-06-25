import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAf7J-L37yE84VfDifCuHVWFRshHaI1L2o",
  authDomain: "kempt-analog-wqmt3.firebaseapp.com",
  projectId: "kempt-analog-wqmt3",
  storageBucket: "kempt-analog-wqmt3.firebasestorage.app",
  messagingSenderId: "439778155105",
  appId: "1:439778155105:web:8aca10d9cdafa51a5d6820"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific databaseId from the applet configuration
const db = getFirestore(app, "ai-studio-21b724e4-7d34-4be4-a286-4f9b95cc04ae");
const auth = getAuth(app);

// Core Constraint: Test Connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    } else {
      console.log("Firebase connection response parsed correctly:", error);
    }
  }
}
testConnection();

export { db, auth };
