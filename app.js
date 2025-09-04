import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
} from "@mui/material";

// ------------------ Utilities ------------------
const generateShortCode = (length = 6) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const Logger = {
  log: (message, data = null) => {
    console.log([Logger] ${message}, data ? data : "");
  },
};

// ------------------ Main App ------------------
const App = () => {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [urls, setUrls] = useState([]);

  const handleShorten = () => {
    setError("");

    if (!isValidUrl(url)) {
      setError("Invalid URL format");
      Logger.log("Invalid URL attempted", url);
      return;
    }

    if (urls.length >= 5) {
      alert("You can only shorten up to 5 URLs per session.");
      return;
    }

    let code = customCode || generateShortCode();
    const validMinutes = validity ? parseInt(validity) : 30;

    const shortUrl = ${window.location.origin}/${code};
    Logger.log("Shortened URL created", { url, shortUrl, validMinutes });

    const newEntry = {
      originalUrl: url,
      shortUrl,
      code,
      expiry: new Date(Date.now() + validMinutes * 60000).toLocaleString(),
    };

    setUrls([...urls, newEntry]);
    setUrl("");
    setValidity("");
    setCustomCode("");
  };

  return (
    <Container className="p-6">
      <Typography variant="h4" gutterBottom align="center">
        React URL Shortener
      </Typography>

      {/* URL Shortener Form */}
      <Card className="my-4 p-4 shadow-lg rounded-2xl">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            URL Shortener
          </Typography>
          <TextField
            label="Original URL"
            variant="outlined"
            fullWidth
            margin="dense"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            label="Validity (minutes, default 30)"
            variant="outlined"
            fullWidth
            margin="dense"
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
          <TextField
            label="Custom Shortcode (optional)"
            variant="outlined"
            fullWidth
            margin="dense"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            className="mt-3"
            onClick={handleShorten}
          >
            Shorten URL
          </Button>
        </CardContent>
      </Card>

      {/* URL Statistics */}
      <Card className="my-4 p-4 shadow-lg rounded-2xl">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            URL Statistics
          </Typography>
          <List>
            {urls.map((item, index) => (
              <ListItem key={index}>
                <div>
                  <Typography>
                    <b>Original:</b> {item.originalUrl}
                  </Typography>
                  <Typography>
                    <b>Shortened:</b>{" "}
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.shortUrl}
                    </a>
                  </Typography>
                  <Typography>
                    <b>Expiry:</b> {item.expiry}
                  </Typography>
                </div>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;