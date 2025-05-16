
require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer')
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const { required } = require('nodemon/lib/config');

// Initialize Express
const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;
// Configuration
const MONGODB_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const botToken = process.env.botToken;

// MongoDB Connection (no deprecated options)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected');
  // startScheduledJobs();
});

// User Schema
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
  folderName: {type: String, required:true, index:true},
  fileName:{type:String, required:true},
  fileLink:{type:String, required:true},
  downloadCount: { type: Number, default: 0 }
})
const fileStorage = mongoose.model('fileStorage', filesSchema);

const folderSchema = new mongoose.Schema({
  folderName: {type: String, required: true, index:true, unique:true},
})
const folderStorage = mongoose.model('folderStorage', folderSchema)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration (with connect-mongo)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    req.session.user = { id: user._id, email: user.email };
    console.log('✅ Logged in:', req.session.user);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed');
  }
});

// Uncomment to allow registration
/*
app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    if (password.length < 8) {
      return res.status(400).send('Password must be at least 8 characters');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).send('Email already in use');

    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration failed');
  }
});
*/

app.get('/dashboard', (req, res) => {
  console.log('Dashboard hit, session:', req.session.user);
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
});



// For the form
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in", // Or smtp.zoho.com if you're outside India
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.ZOHO_EMAIL,
    to: process.env.ZOHO_EMAIL,
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});










// Replace with your bot's token
const apiUrl = `https://api.telegram.org/bot${botToken}/`;
let lastUpdateId = 0;
let fileArray = [];
async function getUpdates() {
  try {
      const response = await fetch(`${apiUrl}getUpdates?offset=${lastUpdateId + 1}&allowed_updates=["channel_post"]`);
      const data = await response.json();

      if (data.ok && data.result.length > 0) {
          data.result.forEach(update => {
              console.log(update);
              lastUpdateId = update.update_id;

              // Handle channel post documents
              if (update.channel_post?.document) {
                  const fileId = update.channel_post.document.file_id;
                  const originalFileName = update.channel_post.document.file_name;

                  try{
                    getFile(fileId, originalFileName)
                  }catch(err){
                    console.log(err);
                  }
              }
          });
      }
  } catch (error) {
      console.error('Update error:', error);
  }
}

// Get the Telegram file path and log the proxy URL
async function getFile(fileId, originalFileName) {
  try {
      const response = await fetch(`${apiUrl}getFile?file_id=${fileId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.ok) {
          const filePath = data.result.file_path;

          // Construct proxy download URL with original file name
          // const baseUrl = 'http://localhost:3000'; // Change to your deployed domain if needed
          const downloadUrl = `/api/telegram-file?file_path=${encodeURIComponent(filePath)}&file_name=${encodeURIComponent(originalFileName)}`;

          console.log(`✅ File ready: ${originalFileName}`);
          // console.log(`🔗 Proxy download link: ${downloadUrl}`);

          links(originalFileName, downloadUrl);
      }
  } catch (error) {
      console.error('Error getting file:', error);
  }
}

// Proxy endpoint to securely serve the file
app.get('/api/telegram-file', async (req, res) => {
  try {
      const filePath = req.query.file_path;
      const originalFileName = req.query.file_name || 'downloaded_file';

      if (!filePath) return res.status(400).send('Missing file_path');

      const telegramFileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
      const response = await axios.get(telegramFileUrl, { responseType: 'stream' });

      res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
      res.setHeader('Content-Type', response.headers['content-type']);

      response.data.pipe(res);
  } catch (error) {
      console.error('Proxy download error:', error);
      res.status(500).send('Error downloading file');
  }
});

// let fileArray = [];

// Fetch files - used by frontend "Check" button
app.get('/ui/files/', async (req, res) => {
  try {
    console.log("GET /ui/files - Got to backend");
    res.json({ success: true, fileArray });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add file to array from Telegram bot or elsewhere
async function links(fileName, link) {
  const fileObject = {
    name: fileName,
    url: link
  };

  fileArray.push(fileObject);
  console.log('File added:', fileObject);
  console.log('Current JSON array:', fileArray);
}

// Frontend sends folderName + each file (name, URL)
app.post('/ui/mongoDataStore/', async (req, res) => {
  try {
    const { foName, fiName, fiUri } = req.body;
    console.log("POST /ui/mongoDataStore - Received:", foName, fiName, fiUri);

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
    })

    await newFile.save();
    await newFolder.save();
    fileArray.length = 0;
    res.json({ success: true, message: "Data received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// [OPTIONAL] You can use this POST route if needed
app.post('/ui/mongo', async (req, res) => {
  try {
    console.log("POST /ui/mongo - Got to backend");
    res.json({ success: true, fileArray });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// app.get('/api/telegram-file', async (req, res) => {
//   try {
//     const { file_path, file_name } = req.query;
    
//     if (!file_path) {
//       return res.status(400).json({ error: "Missing file_path" });
//     }

//     const telegramUrl = `https://api.telegram.org/file/bot${botToken}/${file_path}`;
//     const response = await axios.head(telegramUrl); // Check file existence first

//     // Get the filename from the URL if not provided
//     const fileName = file_name || file_path.split('/').pop();

//     // Stream the file with proper error handling
//     const fileResponse = await axios.get(telegramUrl, { 
//       responseType: 'stream',
//       maxContentLength: 50 * 1024 * 1024, // Allow files up to 50 MB
//     });

//     res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
//     res.setHeader('Content-Type', fileResponse.headers['content-type'] || 'application/octet-stream');

//     fileResponse.data.pipe(res);
//   } catch (error) {
//     console.error('Proxy download error:', error.message);
//     res.status(500).json({ 
//       error: "Failed to download file",
//       details: error.response?.status === 400 ? "File may be too large (>20 MB)" : error.message 
//     });
//   }
// });



// Example of how to create a download link in your UI
// function createDownloadLink(fileName, downloadUrl) {
//   const downloadContainer = document.getElementById('downloads-container') || document.body.appendChild(document.createElement('div'));
//   const link = document.createElement('a');
//   link.href = downloadUrl;
//   link.textContent = `Download ${fileName}`;
//   link.download = fileName;
//   link.style.display = 'block';
//   link.style.margin = '10px 0';
  
//   downloadContainer.appendChild(link);
// }

// app.get('/api/telegram-file', async (req, res) => {
//   try {
//       const filePath = req.query.file_path;
//       if (!filePath) return res.status(400).send('File path required');
      
//       const telegramUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
//       const response = await axios.get(telegramUrl, { responseType: 'stream' });
      
//       // Set proper filename from the path
//       const fileName = filePath.split('/').pop();
//       res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
//       response.data.pipe(res);
//   } catch (error) {
//       console.error('Proxy download error:', error);
//       res.status(500).send('Error downloading file');
//   }
// });

// Better polling implementation
let pollingInterval = 5000;
let isPolling = false;

async function startPolling() {
    if (isPolling) return;
    isPolling = true;
    
    while (isPolling) {
        await getUpdates();
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
    }
}

// Start polling
startPolling();








// Fetching data from mongoDB
app.get('/materials/folders', async(req,res)=>{
  try{
    const folders = await folderStorage.find({});
    console.log(folders)
    res.status(200).json(folders)
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: 'Fetch error' });
  }
})

app.get('/folder/files/', async(req,res) => {
  try{
    const files = await fileStorage.find({});
    console.log(files);
    res.status(200).json(files)
  }
  catch(err){
    console.log(err);
    res.status(500).json({error : "file error"})
  }
})



const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;


// telegram Notification
async function sendTelegramNotification(message) {
  if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) return;
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

// Health Check
app.get('/ping', async (req, res) => {
  res.status(200).json({
    status: 'alive',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const keepAlive = () => {
  setInterval(async () => {
    try {
      await axios.get(`https://${process.env.DOMAIN || 'localhost:3000'}/ping`);
      let msgStatus = `Ping received at ${new Date().toISOString()} From code`;
      await sendTelegramNotification(msgStatus);
      console.log('🔄 Keepalive ping sent from brainy');
    } catch (err) {
      const errorMsg = `❌ Keepalive failed: ${err.message}`;
      console.error(errorMsg);
      await sendTelegramNotification(errorMsg);
    }
  }, 0.5 * 60 * 1000); // 4.5 minutes
};





















// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  keepAlive();
});
