require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

// Initialize Express
const app = express();
app.set('trust proxy', 1);
app.use(cors())
const PORT = process.env.PORT || 3000;

// Configuration
const MONGODB_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const botToken = process.env.botToken;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
const gitToken = process.env.GITHUB_TOKEN;

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Schemas
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

const filesSchema = new mongoose.Schema({
  folderName: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  fileLink: { type: String, required: true },
  downloadCount: { type: Number, default: 0 },
  telegramFileId: { type: String } // Store Telegram file ID for future reference
});

const folderSchema = new mongoose.Schema({
  folderName: { type: String, required: true, index: true, unique: true },
});

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  category: {
    internship: { type: Boolean, default: false },
    fresher: { type: Boolean, default: false },
    experienced: { type: Boolean, default: false },
    student: { type: Boolean, default: false },
    ug: { type: Boolean, default: false },
    pg: { type: Boolean, default: false }
  },
  data: {
    role: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    expires: { type: Date, required: true }
  },
  aboutData: { type: String },
  eligility: { type: String },
  roles: { type: String },
  link: { type: String },
});

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  aboutData: { type: String },
  companyLogo: {type: String},
  jobsCount: { type: Number, default: 1 },
});

// Models
jobSchema.index({ "data.expires": 1 }, { expireAfterSeconds: 0 });
const Job = mongoose.model('Job', jobSchema);
const Company = mongoose.model('Company', companySchema);
const User = mongoose.model('User', userSchema);
const fileStorage = mongoose.model('fileStorage', filesSchema);
const folderStorage = mongoose.model('folderStorage', folderSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));


const USERNAME = 'b-r-m-h';
const REPO = 'resources';
const BRANCH = 'main';

// Recursive GitHub fetcher
const getPDFLinksFromGitHub = async (path = '') => {
  const url = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${path}?ref=${BRANCH}`;
  console.log('Fetching GitHub URL:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'pdf-fetcher',
        'Authorization': `token ${gitToken}`
      }
    });

    const items = response.data;
    let pdfLinks = [];

    for (const item of items) {
      if (item.type === 'file' && item.name.endsWith('.pdf')) {
        const downloadLink = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${item.path}`;
        pdfLinks.push({
          name: item.name,
          path: item.path,
          url: downloadLink
        });
      } else if (item.type === 'dir') {
        const subDirLinks = await getPDFLinksFromGitHub(item.path);
        pdfLinks = pdfLinks.concat(subDirLinks);
      }
    }

    return pdfLinks;
  } catch (error) {
    console.error('Error fetching from GitHub:', error.message);
    return [];
  }
};

// Categorize PDFs by top-level folder
const categorizePDFs = (pdfList) => {
  const categories = {};

  for (const pdf of pdfList) {
    const parts = pdf.path.split('/');
    const folder = parts[0] || 'Uncategorized';

    if (!categories[folder]) {
      categories[folder] = [];
    }

    categories[folder].push({
      name: pdf.name,
      path: pdf.path,
      url: encodeURI(pdf.url)
    });
  }

  return categories;
};

// API Endpoint
app.get('/api/pdfs', async (req, res) => {
  try {
    const pdfs = await getPDFLinksFromGitHub();
    const categorized = categorizePDFs(pdfs);
    console.log(categorized)
    console.log(pdfs)
    res.json(categorized);
  } catch (err) {
    console.error('Failed to fetch and categorize PDFs:', err.message);
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});



// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.get('/login', (req, res) => {
//   if (req.session.user) return res.redirect(path.join(__dirname, 'public', 'admin', 'index.html'));
//   sendTelegramNotification("Opened Login page for brainy voyage");
//   res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).send('Email and password are required');

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).send('Invalid credentials');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).send('Invalid credentials');

//     req.session.user = { id: user._id, email: user.email };
//     res.redirect('/admin/');
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).send('Login failed');
//   }
// });

// app.get('/admin/', (req, res) => {
//   if (!req.session.user) return res.redirect(path.join(__dirname, 'public', 'login.html'));
//   sendTelegramNotification("Logged into the dashboard for Brainy Voyage");
//   res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       console.error('Logout error:', err);
//       return res.status(500).send('Error logging out');
//     }
//     res.redirect('/login');
//   });
// });

// File management endpoints

// Add these routes to your server.js

// API login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = { id: user._id, email: user.email };
    res.json({ 
      success: true,
      user: { email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// API auth check endpoint
app.get('/api/auth/check', (req, res) => {
  res.json({
    authenticated: !!req.session.user,
    user: req.session.user || null
  });
});

// API logout endpoint
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ success: true });
  });
});








app.get('/ui/files/', async (req, res) => {
  try {
    res.json({ success: true, files: fileArray });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/ui/mongoDataStore/', async (req, res) => {
  try {
    const { foName, fiName, fiUri } = req.body;
    if (!foName || !fiName || !fiUri) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newFile = new fileStorage({
      folderName: foName,
      fileName: fiName,
      fileLink: fiUri,
    });
    
    const newFolder = new folderStorage({
      folderName: foName,
    });

    await newFile.save();
    await newFolder.save();
    fileArray = fileArray.filter(f => f.name !== fiName); // Clear from memory after saving
    res.json({ success: true, message: "Data received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Database endpoints
app.get('/materials/folders', async (req, res) => {
  try {
    const folders = await folderStorage.find({});
    res.status(200).json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch error' });
  }
});

app.get('/folder/files/', async (req, res) => {
  try {
    const files = await fileStorage.find({});
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "file error" });
  }
});


// Get all companies (matches UI's /hire/companies/)
app.get('/hire/companies', async (req, res) => {
  try {
    const companies = await Company.find().sort({ companyName: 1 });
    res.json(companies); // Direct array response matches UI expectation
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get jobs by company (POST to match your UI)
app.post('/hire/jobs', async (req, res) => {
  try {
    const { companyName } = req.body;
    const jobs = await Job.find({ company: companyName }).sort({ createdAt: -1 });
    res.json(jobs); // Direct array response
  } catch (err) {
    console.error("Error fetching company jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all jobs (for when no company filter)
app.get('/hire/data', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs); // Direct array response
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create/Update job (matches UI's /jobs/upload)
app.post('/jobs/upload', async (req, res) => {
  try {
    const jobData = req.body;
    
    // Validate required fields
    if (!jobData.id || !jobData.company || !jobData.data?.role) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Upsert job
    const job = await Job.findOneAndUpdate(
      { id: jobData.id },
      jobData,
      { upsert: true, new: true }
    );

    // Update company
    await Company.findOneAndUpdate(
      { companyName: jobData.company },
      { $set: { aboutData: jobData.aboutData }, $inc: { jobsCount: 1 } },
      { upsert: true }
    );

    res.json({ success: true, job });
  } catch (err) {
    console.error("Error saving job:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single job (for editing)
app.get('/hire/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete job
app.delete('/hire/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ id: req.params.id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Decrement company's job count
    await Company.findOneAndUpdate(
      { companyName: job.company },
      { $inc: { jobsCount: -1 } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Server error" });
  }
});





// For getting the job in the user point of view
app.get('/hiring/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'job', 'index.html'));
});


app.get('/api/job/:id', async (req, res) => {
  const job = await Job.findOne({ id: req.params.id })
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});




// Get all jobs endpoint
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find({});
        
        // Transform the data to match your frontend expectations
        const transformedJobs = jobs.map(job => ({
            'Company Name': job.company,
            'Id': job.id,
            'Role': job.data.role,
            'Salary': job.data.salary,
            'Location': job.data.location,
            'Category': job.category,
            'Deadline': job.data.expires // Format as YYYY-MM-DD
        }));
        
        res.json(transformedJobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});







// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
});













// Telegram notification
async function sendTelegramNotification(message) {
  if (!process.env.botToken || !process.env.CHAT_ID){
    
    try {
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.CHAT_ID,
        text: message,
      });
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  };
  
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.botToken}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}
const keepAlive = () => {
  setInterval(async () => {
    try {
      await axios.get(`https://${process.env.DOMAIN || 'localhost:3000'}/ping`);
      let msgStatus = `Ping received from Brainy Voyage`;
      await sendTelegramNotification(msgStatus);
      console.log('🔄 Keepalive ping sent');
    } catch (err) {
      const errorMsg = `❌ Keepalive failed: ${err.message}`;
      console.error(errorMsg);
      await sendTelegramNotification(errorMsg);
    }
  }, 4.5 * 60 * 1000); // 4.5 minutes
};



// Health Check
app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'alive',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/ads.txt', function (req, res) {
  res.sendFile(path.join(__dirname, 'ads.txt'));
});




// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    keepAlive(); // Start keepalive pings
  }
});