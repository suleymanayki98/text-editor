const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Mevcut endpoint'ler
app.get('/api/get-components', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading components:', error);
    res.status(500).json({ error: 'Failed to read components' });
  }
});

app.post('/api/save-components', async (req, res) => {
  try {
    const { components } = req.body;
    await fs.writeFile(
      path.join(__dirname, 'data.json'),
      JSON.stringify(components, null, 2)
    );
    res.status(200).json({ message: 'Components saved successfully' });
  } catch (error) {
    console.error('Error saving components:', error);
    res.status(500).json({ error: 'Failed to save components' });
  }
});

// Yeni endpoint'ler
app.get('/api/get-email-data', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'email.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading email data:', error);
    res.status(500).json({ error: 'Failed to read email data' });
  }
});

app.post('/api/save-email-data', async (req, res) => {
  try {
    const { emailData } = req.body;
    await fs.writeFile(
      path.join(__dirname, 'email.json'),
      JSON.stringify(emailData, null, 2)
    );
    res.status(200).json({ message: 'Email data saved successfully' });
  } catch (error) {
    console.error('Error saving email data:', error);
    res.status(500).json({ error: 'Failed to save email data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));