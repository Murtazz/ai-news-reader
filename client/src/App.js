import { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setSummary("");
    setAudioUrl("");
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/summarize", { url });
      setSummary(res.data.summary);
      setAudioUrl(`http://127.0.0.1:8000${res.data.audio_url}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📰 AI News Summarizer</h1>

        <input
          type="text"
          placeholder="Enter news article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? <div className="spinner"></div> : "Summarize"}
        </button>

        {error && <p className="error">{error}</p>}

        {summary && (
          <div className="result-card fade-in">
            <h2>Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        {audioUrl && (
          <div className="result-card fade-in">
            <h2>Audio</h2>
            <audio controls src={audioUrl}></audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;