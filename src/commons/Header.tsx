import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { getUsernameFromFirestore } from "../services/FirestoreService";

const Header: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (auth.currentUser) {
        const fetchedUsername = await getUsernameFromFirestore();
        setUsername(fetchedUsername);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    signOut(auth); 
    setUsername(null); 
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
        <Button color="inherit" component={Link} to="/hiscores">
          Parhaat tulokset
        </Button>

        {auth.currentUser ? (
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
