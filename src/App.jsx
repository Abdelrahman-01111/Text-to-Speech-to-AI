import { useState, useRef } from "react";
import "./App.css";
import send from "./send.js";
function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in your browser");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcriptSegment + " ");
          } else {
            interim += transcriptSegment;
          }
        }
        setInterimTranscript(interim);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    recognitionRef.current.lang = language;
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  const copyToClipboard = () => {
    if (transcript.trim()) {
      navigator.clipboard.writeText(transcript.trim());
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="app-container">
      <div className="speech-to-text-card">
        <div className="header">
          <h1>🎤 Speech to Text</h1>
          <p>Click the microphone to start speaking</p>
        </div>

        <div className="language-selector">
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isListening}
          >
            <option value="en-US">English (US)</option>
            <option value="ar-AR">Arabic</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="it-IT">Italian</option>
            <option value="pt-BR">Portuguese (Brazil)</option>
            <option value="ja-JP">Japanese</option>
            <option value="zh-CN">Mandarin Chinese</option>
          </select>
        </div>

        <div className="transcript-container">
          <div className="transcript-display">
            {transcript && <p className="final-text">{transcript}</p>}
            {interimTranscript && (
              <p className="interim-text">{interimTranscript}</p>
            )}
            {!transcript && !interimTranscript && (
              <p className="placeholder">
                Your transcribed text will appear here...
              </p>
            )}
          </div>
        </div>

        <div className="controls">
          <button
            className={`btn-mic ${isListening ? "listening" : ""}`}
            onClick={isListening ? stopListening : startListening}
          >
            <span className={`mic-icon ${isListening ? "pulse" : ""}`}>🎤</span>
            <span>{isListening ? "Stop" : "Start"}</span>
          </button>

          <button
            className="btn-secondary"
            onClick={clearTranscript}
            disabled={!transcript && !interimTranscript}
          >
            Clear
          </button>

          <button
            className="btn-secondary"
            onClick={copyToClipboard}
            disabled={!transcript}
          >
            Copy
          </button>
          <button
            className="btn-secondary"
            disabled={!transcript}
            onClick={() => {
              send(transcript).then((response) => {
                alert("AI Response: " + response);
              });
            }}
          >
            Send
          </button>
        </div>

        <div className="status">
          {isListening && (
            <span className="listening-indicator">🔴 Listening...</span>
          )}
          {!isListening && transcript && (
            <span className="success-indicator">✓ Recording saved</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
