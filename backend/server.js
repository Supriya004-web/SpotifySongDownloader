const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create downloads folder
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
    console.log('📁 Downloads folder created');
}

// Search endpoint
app.post('/api/search', (req, res) => {
    const { query } = req.body;
    console.log('🔍 Searching:', query);
    
    const mockResults = [
        { title: 'Blinding Lights', artist: 'The Weeknd', url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT' },
        { title: 'Shape of You', artist: 'Ed Sheeran', url: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3' },
        { title: 'Levitating', artist: 'Dua Lipa', url: 'https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP' }
    ];
    
    const results = mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ success: true, results: results.length > 0 ? results : mockResults });
});

// Download endpoint
app.post('/api/download', (req, res) => {
    const { title } = req.body;
    console.log('📥 Downloading:', title);
    
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    const filePath = path.join(downloadsDir, fileName);
    
    // Dummy data
    const dummyData = Buffer.from('Dummy MP3 for ' + title, 'utf-8');
    fs.writeFileSync(filePath, dummyData);
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(filePath, () => {
        fs.unlinkSync(filePath);
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server running!' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Downloads: ${downloadsDir}`);
});