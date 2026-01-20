# AI-Powered ATS Resume Matcher 🚀

An intelligent web application that simulates **real ATS (Applicant Tracking Systems)** using keyword matching, with **AI-powered suggestions via Groq** to help job seekers optimize their resumes for better ATS scores.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![Groq](https://img.shields.io/badge/AI-Groq-orange.svg)

## 🌟 Features

### Core Functionality

- **ATS-Style Keyword Matching**: Simulates real Applicant Tracking Systems used by companies
- **Smart Resume Analysis**: Upload resumes in PDF, DOCX, or TXT format (max 2MB)
- **Job Description Matching**: Compare resumes against job descriptions via file upload or text input
- **AI-Powered Keyword Suggestions**: Get intelligent suggestions powered by **Groq AI (Llama 3.1)**
- **Match Percentage**: See how well your resume matches based on keyword analysis
- **Detailed Breakdown**: View matched keywords, missing keywords, and skills analysis
- **Real ATS Scoring Algorithm**:
  - 50% Keyword matching (primary factor like real ATS)
  - 35% Technical skills matching
  - 10% Experience keywords
  - 5% Education keywords

### User Features

- **Authentication System**: Secure signup/login with JWT tokens and Google OAuth
- **User Profile Management**: Update personal information, professional title, location, and LinkedIn URL
- **Password Recovery**: Email-based OTP password reset
- **Persistent Sessions**: Stay logged in across browser refreshes
- **Responsive Design**: Mobile-first UI that works on all devices

### Technical Highlights

- **Real-time ATS Analysis**: Instant keyword-based feedback like actual ATS systems
- **Cloud AI with Groq**: Fast, production-ready AI suggestions (free tier available)
- **Fast Processing**: Optimized for sub-2 second analysis
- **Fallback Mechanism**: Instant keyword-based suggestions when AI is unavailable
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
- **Passport.js** - Google OAuth authentication
- **Multer 2.0.2** - File upload handling
- **Groq SDK** - Cloud AI for keyword suggestions (Llama 3.1)
- **Nodemailer 7.0.11** - Email service for OTP

### File Processing

- **unpdf 1.4.0** - ES6-compatible PDF parser
- **mammoth 1.11.0** - DOCX to text converter

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local or Atlas)
- **Groq API Key** (free tier available) - [Get one here](https://console.groq.com)
- Email service credentials (for password reset)
- Google OAuth credentials (optional, for Google sign-in)

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
NODE_ENV=development

# Groq AI Configuration (Cloud AI)
GROQ_API_KEY=your_groq_api_key_here

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your_session_secret

# Client URL
CLIENT_URL=http://localhost:5173
```

### 4. Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up/Login (free, no credit card required)
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the key and add it to your `.env` file

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
│   │   ├── aiService.js         # Groq AI integration
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
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
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

The application uses **Groq AI with Llama 3.1** for AI-powered keyword suggestions:

- **Cloud-Based Processing**: Fast, production-ready, no local setup required
- **Free Tier Available**: ~14,400 requests per day with no credit card required
- **Keyword Analysis**: Identifies missing keywords and suggests where to add them
- **Ultra-Fast Response**: Optimized for sub-1 second response time
- **ATS-Focused Prompts**: Trained to think like real ATS systems
- **Fallback Logic**: Instant keyword-based suggestions when API is unavailable
- **Error Handling**: Graceful degradation on service failures

### How it Works:

1. Extracts keywords from job description
2. Matches them against resume (exact matching like ATS)
3. Calculates ATS score (50% keyword weight)
4. Sends missing keywords to Groq AI
5. Groq suggests specific placement strategies
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

### Backend (Node.js + MongoDB + Groq)

1. Deploy to Railway, Render, or Heroku
2. Set environment variables (including GROQ_API_KEY)
3. Connect to MongoDB Atlas
4. Configure CORS for the production domain
5. **Note**: Groq API works seamlessly in production (cloud-based)

### Frontend (React + Vite)

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Deploy to Vercel, Netlify, or AWS S3
3. Update `VITE_API_URL` to production backend URL

## 🐛 Known Issues

- AI suggestions require Groq API key (falls back to keyword suggestions if not configured)
- Large files (nearly 2MB) may take longer to process
- Email OTP requires proper SMTP configuration
- Google OAuth requires proper callback URL configuration in production

## 🗺️ Future Enhancements

- [x] ATS (Applicant Tracking System) keyword matching
- [x] Cloud AI with Groq for production deployment
- [x] Google OAuth integration
- [ ] Resume template suggestions
- [ ] Job search integration
- [ ] Resume version history
- [ ] PDF report generation
- [ ] Batch resume analysis
- [ ] Chrome extension for LinkedIn
- [ ] Mobile app (React Native)
- [ ] Industry-specific keyword databases
- [ ] ATS format checker (parsing issues detection)
- [ ] Multi-language support

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

- Groq team for fast and reliable AI infrastructure
- React and Vite communities
- Tailwind CSS team
- MongoDB team
- All open-source contributors

## 📧 Contact

For questions or support, please contact: aloksisodiya30@gmail.com

---

Made with ❤️ by Alok Sisodiya
