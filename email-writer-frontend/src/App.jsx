import { useState } from 'react';
import axios from 'axios';
import './App.css';
import {
  Box,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('None');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // 🧠 Handle submit — calls backend API via Axios
  const handleSubmit = async () => {
    if (!emailContent) return;

    setLoading(true);
    setReply('');
    setError(null);

    try {
      const response = await axios.post('http://localhost:8091/api/email/generate', {
        emailText: emailContent,
        tone: tone,
      });

      // ✅ If backend returns plain text
      setReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (err) {
      console.error('Error generating reply:', err);
      setError('❌ Failed to generate email reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Clear input + output
  const handleClear = () => {
    setEmailContent('');
    setTone('None');
    setReply('');
    setError(null);
  };

  // 📋 Copy reply text
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Email Reply Generator
        </Typography>

        <Box sx={{ mx: 3 }}>
          {/* ✉️ Incoming Email */}
          <TextField
            fullWidth
            label="Incoming Email"
            multiline
            minRows={6}
            variant="outlined"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* 🎛️ Tone Selector */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="tone-select-label">Tone</InputLabel>
            <Select
              labelId="tone-select-label"
              id="tone-select"
              value={tone}
              label="Tone"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
            </Select>
          </FormControl>

          {/* 🧩 Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          </Box>

          {/* 💬 Display Reply */}
          {reply && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Generated Reply:
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={6}
                variant="outlined"
                value={reply}
                inputProps={{ readOnly: true }}
                sx={{
                  mt: 1,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCopy}
                  disabled={loading}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* ✅ Snackbar feedback */}
        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setCopied(false)}>
            Copied to clipboard!
          </Alert>
        </Snackbar>

        {/* ❌ Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default App;