# AI-Powered ATS Resume Matcher 🚀

An intelligent web application that simulates **real ATS (Applicant Tracking Systems)** using keyword matching, with **AI-powered suggestions via Ollama** to help job seekers optimize their resumes for better ATS scores.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![Ollama](https://img.shields.io/badge/AI-Ollama-green.svg)

## 🌟 Features

### Core Functionality

- **ATS-Style Keyword Matching**: Simulates real Applicant Tracking Systems used by companies
- **Smart Resume Analysis**: Upload resumes in PDF, DOCX, or TXT format (max 2MB)
- **Job Description Matching**: Compare resumes against job descriptions via file upload or text input
- **AI-Powered Keyword Suggestions**: Get intelligent suggestions powered by **Ollama (Local AI)**
- **Match Percentage**: See how well your resume matches based on keyword analysis
- **Detailed Breakdown**: View matched keywords, missing keywords, and skills analysis
- **Real ATS Scoring Algorithm**:
  - 50% Keyword matching (primary factor like real ATS)
  - 35% Technical skills matching
  - 10% Experience keywords
  - 5% Education keywords

### User Features

- **Authentication System**: Secure signup/login with JWT tokens
- **User Profile Management**: Update personal information, professional title, location, and LinkedIn URL
- **Password Recovery**: Email-based OTP password reset
- **Persistent Sessions**: Stay logged in across browser refreshes
- **Responsive Design**: Mobile-first UI that works on all devices

### Technical Highlights

- **Real-time ATS Analysis**: Instant keyword-based feedback like actual ATS systems
- **Local AI with Ollama**: Privacy-focused, no external API costs
- **Fast Processing**: Optimized for sub-2 second analysis
- **Fallback Mechanism**: Instant keyword-based suggestions when Ollama is unavailable
- **File Validation**: Client and server-side file size and type validation
- **Secure File Handling**: Automatic cleanup of uploaded files after processing
- **Modern UI/UX**: Clean, dark-themed interface with smooth animations

## 🛠️ Tech Stack

### Frontend

- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Lightning-fast build tool
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **React Router DOM 7.10.1** - Client-side routing
- **Axios 1.13.2** - HTTP client with interceptors
- **React Toastify 11.0.5** - Toast notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web application framework
- **MongoDB + Mongoose 9.0.1** - NoSQL database
- **JWT** - Secure authentication
- **Multer 2.0.2** - File upload handling
- **Ollama (llama3.2)** - Local AI for keyword suggestions
- **Nodemailer 7.0.11** - Email service for OTP

### File Processing

- **unpdf 1.4.0** - ES6-compatible PDF parser
- **mammoth 1.11.0** - DOCX to text converter

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local or Atlas)
- **Ollama** (for AI suggestions) - [Install here](https://ollama.ai)
- Email service credentials (for password reset)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "AI-powered resume and Jd matcher"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Ollama Configuration (Local AI)
OLLAMA_API_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Install and Start Ollama

**Install Ollama:**

```bash
# Download from https://ollama.ai or use:
# Windows/Mac: Download installer
# Linux: curl -fsSL https://ollama.com/install.sh | sh
```

**Pull the AI model:**

```bash
ollama pull llama3.2
```

**Start Ollama server:**

```bash
ollama serve
```

> Ollama will run on `http://127.0.0.1:11434`

### 5. Start the Backend

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 6. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
AI-powered resume and Jd matcher/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, icons
│   │   ├── components/          # React components
│   │   │   ├── layout/          # Header, Footer
│   │   │   ├── sections/        # Hero, Statistics, HowItWorks
│   │   │   └── ui/              # UploadBox, JobDescriptionBox
│   │   ├── contexts/            # AuthContext for state management
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AnalysisResultsPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── services/            # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   └── package.json
│
├── server/                      # Backend Node.js application
│   ├── config/                  # Configuration files
│   │   └── mongodb.js
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.js
│   │   └── analysis.controller.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/                  # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── Analysis.model.js
│   │   └── Resume.model.js
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── analysis.routes.js
│   │   └── routes.js
│   ├── services/                # Business logic
│   │   ├── llamaService.js      # Ollama AI integration
│   │   └── emailService.js
│   ├── uploads/                 # Temporary file storage (auto-cleaned)
│   ├── app.js                   # Express app setup
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/send-pass-otp` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `PUT /api/auth/update-profile` - Update user profile (protected)

### Analysis

- `POST /api/analysis/analyze` - Analyze resume against job description (ATS keyword matching)
- `GET /api/analysis/history` - Get user's analysis history (protected)
- `GET /api/analysis/:id` - Get specific analysis by ID (protected)

## 💡 Usage

### 1. Create an Account

- Navigate to the signup page
- Enter your name, email, and password
- Verify your email (if configured)

### 2. Upload Resume

- Go to the homepage
- Upload your resume (PDF, DOCX, or TXT, max 2MB)
- Optionally enter job title and company name

### 3. Add Job Description

- Upload a job description file OR
- Paste the job description text directly

### 4. Analyze

- Click "Start Analysis"
- View your **ATS match percentage** (keyword-based like real ATS)
- Review matched and missing **keywords**
- Read **AI-powered keyword suggestions** from Ollama
- See which exact keywords to add and where

### 5. Update Profile

- Access your profile from the header
- Update professional details
- Save changes to persist across sessions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **HTTP-Only Cookies**: Protection against XSS attacks
- **CORS Configuration**: Cross-origin request security
- **File Validation**: Type and size checks on uploads
- **Environment Variables**: Sensitive data protection
- **Automatic File Cleanup**: Prevent storage bloat

## 🎨 UI/UX Highlights

- **Dark Theme**: Modern, eye-friendly interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Non-intrusive alerts
- **Smooth Animations**: Enhanced user experience
- **Accessible**: WCAG-compliant color contrasts

## 🤖 AI Integration

The application uses **Ollama with llama3.2** for AI-powered keyword suggestions:

- **Local Processing**: No external API costs, complete privacy
- **Keyword Analysis**: Identifies missing keywords and suggests where to add them
- **Fast Response**: Optimized for ~1 second response time
- **ATS-Focused Prompts**: Trained to think like real ATS systems
- **Fallback Logic**: Instant keyword-based suggestions when Ollama is unavailable
- **Error Handling**: Graceful degradation on service failures

### How it Works:

1. Extracts keywords from job description
2. Matches them against resume (exact matching like ATS)
3. Calculates ATS score (50% keyword weight)
4. Sends missing keywords to Ollama
5. Ollama suggests specific placement strategies
6. Returns actionable, keyword-focused recommendations

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🚢 Deployment

### Backend (Node.js + MongoDB + Ollama)

1. Deploy to Railway, Render, or Heroku
2. Set environment variables (including OLLAMA_API_URL)
3. Connect to MongoDB Atlas
4. Configure CORS for the production domain
5. **Important**: Ensure Ollama is accessible or use fallback mode

### Frontend (React + Vite)

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Deploy to Vercel, Netlify, or AWS S3
3. Update `VITE_API_URL` to production backend URL

## 🐛 Known Issues

- AI suggestions require Ollama to be running (falls back to keyword suggestions if not)
- Large files (nearly 2MB) may take longer to process
- Email OTP requires proper SMTP configuration
- Ollama needs ~4GB RAM for llama3.2 model

## 🗺️ Future Enhancements

- [x] ATS (Applicant Tracking System) keyword matching
- [x] Local AI with Ollama for privacy
- [ ] Resume template suggestions
- [ ] Job search integration
- [ ] Resume version history
- [ ] PDF report generation
- [ ] Batch resume analysis
- [ ] Chrome extension for LinkedIn
- [ ] Mobile app (React Native)
- [ ] Industry-specific keyword databases
- [ ] ATS format checker (parsing issues detection)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Alok Sisodiya - Initial work

## 🙏 Acknowledgments

- Ollama team for local AI capabilities
- React and Vite communities
- Tailwind CSS team
- All open-source contributors

## 📚 Documentation

- [ATS_KEYWORD_MATCHING_UPDATE.md](ATS_KEYWORD_MATCHING_UPDATE.md) - System architecture details
- [OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md) - Performance optimizations
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing scenarios and examples

## 📧 Contact

For questions or support, please contact: aloksisodiya30@gmail.com

---

Made with ❤️ by Alok Sisodiya
