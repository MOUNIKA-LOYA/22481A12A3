import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

// 🔹 Logging Middleware
async function logAction(action, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    details,
  };

  try {
    await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token", // replace with real if provided
      },
      body: JSON.stringify(logEntry),
    });
  } catch (error) {
    console.error("Log API failed, saving locally", error);
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.push(logEntry);
    localStorage.setItem("logs", JSON.stringify(logs));
  }
}

// 🔹 Shortener Page
function Shortener({ links, setLinks }) {
  const [urls, setUrls] = useState([""]);
  const [errors, setErrors] = useState([]);

  const handleAddUrl = () => {
    if (urls.length < 5) setUrls([...urls, ""]);
  };

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const generateShortcode = () => Math.random().toString(36).substring(2, 7);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = [];
    let newLinks = [];

    urls.forEach((url, idx) => {
      if (!url) return;

      try {
        new URL(url); // Validate URL
      } catch {
        newErrors[idx] = "❌ Invalid URL";
        logAction("Error", { reason: "Invalid URL", url });
        return;
      }

      const code = generateShortcode();
      if (links.find((l) => l.shortcode === code)) {
        newErrors[idx] = "❌ Duplicate shortcode";
        logAction("Error", { reason: "Duplicate shortcode", code });
        return;
      }

      const newLink = {
        original: url,
        shortcode: code,
        expiryMinutes: 30,
        createdAt: new Date().getTime(),
      };

      newLinks.push(newLink);
      logAction("URL Shortened", newLink);
    });

    if (newLinks.length > 0) {
      const updatedLinks = [...links, ...newLinks];
      setLinks(updatedLinks);
      localStorage.setItem("links", JSON.stringify(updatedLinks));
    }

    setErrors(newErrors);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🔗 React URL Shortener
      </Typography>
      <form onSubmit={handleSubmit}>
        {urls.map((url, idx) => (
          <div key={idx}>
            <TextField
              label={`Enter URL ${idx + 1}`}
              value={url}
              onChange={(e) => handleChange(idx, e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors[idx]}
              helperText={errors[idx]}
            />
          </div>
        ))}
        <Button
          onClick={handleAddUrl}
          disabled={urls.length >= 5}
          variant="outlined"
          color="secondary"
        >
          Add Another URL
        </Button>
        <br />
        <Button type="submit" variant="contained" color="primary">
          Shorten URLs
        </Button>
      </form>

      <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Results
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short Link</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Expiry (mins)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <a
                    href={`/${link.shortcode}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {window.location.origin}/{link.shortcode}
                  </a>
                </TableCell>
                <TableCell>{link.original}</TableCell>
                <TableCell>{link.expiryMinutes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Link to="/stats">
        <Button variant="contained" color="secondary" style={{ marginTop: 20 }}>
          View Statistics
        </Button>
      </Link>
    </Container>
  );
}

// 🔹 Redirect Page
function RedirectPage({ links }) {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const link = links.find((l) => l.shortcode === code);

    if (!link) {
      alert("❌ Shortcode not found!");
      logAction("Error", { reason: "Shortcode not found", code });
      navigate("/");
      return;
    }

    const now = new Date().getTime();
    if (now - link.createdAt > link.expiryMinutes * 60000) {
      alert("⏰ Link expired!");
      logAction("Error", { reason: "Link expired", code });
      navigate("/");
      return;
    }

    logAction("Redirected", { code, to: link.original });
    window.location.href = link.original;
  }, [code, links, navigate]);

  return <p>Redirecting...</p>;
}

// 🔹 Statistics Page
function StatsPage({ links }) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📊 URL Shortener Statistics
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shortcode</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expiry (mins)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link, idx) => (
              <TableRow key={idx}>
                <TableCell>{link.shortcode}</TableCell>
                <TableCell>{link.original}</TableCell>
                <TableCell>
                  {new Date(link.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{link.expiryMinutes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Link to="/">
        <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
          Back to Shortener
        </Button>
      </Link>
    </Container>
  );
}

// 🔹 Main App
function App() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    setLinks(savedLinks);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shortener links={links} setLinks={setLinks} />} />
        <Route path="/stats" element={<StatsPage links={links} />} />
        <Route path="/:code" element={<RedirectPage links={links} />} />
      </Routes>
    </Router>
  );
}

export default App;
