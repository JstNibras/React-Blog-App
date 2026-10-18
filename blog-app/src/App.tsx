import './App.css'
import { useEffect } from 'react'
import { auth, db } from './firebase/config'

function App() {
  useEffect(() => {
    console.log("Firebase Auth initialized:", !!auth);
    console.log("Firestore initialized:", !!db);
  }, []);

  return (
    <main>
      <h1>Blog App</h1>
      <p>Firebase setup completed.</p>
    </main>
  );
}

export default App
