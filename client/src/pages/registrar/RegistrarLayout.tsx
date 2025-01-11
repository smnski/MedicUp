import { ApiRoutes, Registrar } from "@medicup/shared";
import { Instagram, LinkedIn, Twitter, YouTube } from "@mui/icons-material";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Api } from "../../api";
import { AppRoutes } from "../../constants/AppRoutes";
import { RegistrarContext } from "../../context/RegistrarContext";

export default function RegistrarLayout() {
  const [registrar, setRegistrar] = useState<Registrar | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await Api.get<undefined, Registrar>(
        ApiRoutes.registrar.me,
        undefined
      );
      if (response.ok) {
        setRegistrar(response.data);
      } else {
        navigate(AppRoutes.auth.login.registrar);
      }
    };
    fetchPatient();
  }, [navigate]);

  const handleLogout = () => {
    // Usuń tokeny lub inne dane autoryzacyjne
    Api.post(ApiRoutes.auth.logout, undefined).finally(() => {
      navigate(AppRoutes.auth.login.registrar);
    });
  };

  return (
    <RegistrarContext.Provider value={registrar}>
      <Stack height="100%">
        {/* Header */}
        <header>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Dodane, aby przyciski były rozmieszczone na krańcach
              padding: "1rem",
              backgroundColor: "#ffffff",
              border: "2px solid lightgrey",
            }}
          >
            {/* Logo */}
            <Box sx={{ marginRight: "1rem", width: "50px", height: "auto" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 193 229"
                width="100%"
                height="100%"
              >
                <path
                  style={{ fill: "#3765ff", fillOpacity: 1 }}
                  d="M 0.3001292,75.380593 H 37.953427 L 57.972755,0.667449 109.93747,194.60242 138.49254,88.03344 h 55.06891 v 7.71067 H 145.53428 L 109.69998,229.47956 57.942579,36.318323 45.251496,83.68209 H 0.3001292 Z"
                />
              </svg>
            </Box>
            {/* Title */}
            <Typography variant="h4" component="div"></Typography>
            {/* Logout Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Wyloguj
            </Button>
          </Box>
        </header>

        <Stack flex="1" overflow="auto">
          <Outlet />
        </Stack>

        <Footer />
      </Stack>
    </RegistrarContext.Provider>
  );
}

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        padding: "2rem",
        borderTop: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Stack direction="row" spacing={2}>
        <Link href="https://twitter.com" target="_blank" rel="noopener">
          <Twitter sx={{ fontSize: 24, color: "black" }} />
        </Link>
        <Link href="https://instagram.com" target="_blank" rel="noopener">
          <Instagram sx={{ fontSize: 24, color: "black" }} />
        </Link>
        <Link href="https://youtube.com" target="_blank" rel="noopener">
          <YouTube sx={{ fontSize: 24, color: "black" }} />
        </Link>
        <Link href="https://linkedin.com" target="_blank" rel="noopener">
          <LinkedIn sx={{ fontSize: 24, color: "black" }} />
        </Link>
      </Stack>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Kontakt
        </Typography>
        <Typography>adres.biuro@example.com</Typography>
        <Typography>+48 111 222 333</Typography>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Adres
        </Typography>
        <Typography>ul. Floriańska 15</Typography>
        <Typography>31-019, Kraków</Typography>
      </Box>
    </Box>
  );
}