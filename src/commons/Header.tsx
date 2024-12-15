import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getUsernameFromFirestore } from "../services/FirestoreService";

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [username, setUsername] = useState<string | null>(null);

  // Kuuntele auth-tilan muutoksia
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const fetchedUsername = await getUsernameFromFirestore();
        setUsername(fetchedUsername);
      } else {
        setUsername(null);
      }
    });
    return () => unsubscribe(); // Poista kuuntelija komponentin purkauduttua
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Uloskirjautuminen onnistui.");
    } catch (error) {
      console.error("Virhe uloskirjautumisessa:", error);
    }
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, padding: 0, height: "34px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Helsingin kadut
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Uusi peli
        </Button>
        <Button color="inherit" component={Link} to="/highscores">
          Parhaat tulokset
        </Button>

        {currentUser ? (
          <Button color="inherit" onClick={handleLogout}>
            Kirjaudu ulos ({username || "Anonyymi"})
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Kirjaudu sisään
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;