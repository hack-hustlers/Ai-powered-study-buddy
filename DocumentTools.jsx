import React, { useState } from 'react';
import axios from 'axios';

const AI_URL = 'http://localhost:5000/api'; 

const DocumentTools = ({ token }) => {
  const [documentText, setDocumentText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const getAuthConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  });

  const handleSummarize = async () => {
    if (!documentText) return;
    setLoading(true);
    setResult('');

    try {
      const res = await axios.post(
        `${AI_URL}/summarize`, 
        { text: documentText }, 
        getAuthConfig()
      );
      setResult('SUMMARY:\n' + res.data.summary);
    } catch (error) {
      setResult('Error summarizing document. Check backend or API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!documentText) return;
    setLoading(true);
    setResult('');

    try {
      const res = await axios.post(
        `${AI_URL}/quiz`, 
        { text: documentText }, 
        getAuthConfig()
      );
      setResult('GENERATED QUIZ:\n' + res.data.quiz); 
    } catch (error) {
      setResult('Error generating quiz. Check backend or API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-tools-container">
      <h3>Analyze Your Study Material</h3>
      <textarea
        placeholder="Paste your document or lecture notes here..."
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
        rows="10"
        cols="80"
      />
      <div className="action-buttons">
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? 'Summarizing...' : 'Summarize Text'}
        </button>
        <button onClick={handleGenerateQuiz} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      <div className="results-area">
        <h4>Results:</h4>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default DocumentTools;