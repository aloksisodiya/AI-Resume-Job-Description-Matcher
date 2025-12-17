# AI-Powered Resume and Job Description Matcher 🚀

An intelligent web application that uses AI to analyze and match resumes with job descriptions, providing detailed insights and recommendations to help job seekers optimize their applications.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)

## 🌟 Features

### Core Functionality

- **Smart Resume Analysis**: Upload resumes in PDF, DOCX, or TXT format (max 2MB)
- **Job Description Matching**: Compare resumes against job descriptions via file upload or text input
- **AI-Powered Insights**: Get intelligent suggestions powered by OpenAI GPT-4o-mini
- **Match Percentage**: See how well your resume matches the job requirements
- **Detailed Breakdown**: View matched skills, missing skills, and keyword analysis
- **Weighted Scoring Algorithm**:
  - 40% Keywords matching
  - 40% Technical skills
  - 10% Experience level
  - 10% Education match

### User Features

- **Authentication System**: Secure signup/login with JWT tokens
- **User Profile Management**: Update personal information, professional title, location, and LinkedIn URL
- **Password Recovery**: Email-based OTP password reset
- **Persistent Sessions**: Stay logged in across browser refreshes
- **Responsive Design**: Mobile-first UI that works on all devices

### Technical Highlights

- **Real-time Analysis**: Instant feedback on resume-job description compatibility
- **Fallback Mechanism**: Rule-based suggestions when AI quota is exceeded
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
- **OpenAI API** - AI-powered suggestions
- **Nodemailer 7.0.11** - Email service for OTP

### File Processing

- **unpdf 1.4.0** - ES6-compatible PDF parser
- **mammoth 1.11.0** - DOCX to text converter

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key
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
OPENAI_API_KEY=your_openai_api_key

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend server:

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 3. Frontend Setup

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
│   │   └── routes.js
│   ├── services/                # Business logic
│   │   ├── openaiService.js
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

- `POST /api/analyze` - Analyze resume against job description (protected)

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
- View your match percentage
- Review matched and missing skills
- Read AI-powered suggestions for improvement

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

The application uses OpenAI's GPT-4o-mini model to provide intelligent suggestions:

- **Analysis Context**: Sends match percentage, skills data, and resume/JD snippets
- **JSON Response Format**: Structured output for consistency
- **Fallback Logic**: Rule-based suggestions when API quota is exceeded
- **Error Handling**: Graceful degradation on API failures

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

### Backend (Node.js + MongoDB)

1. Deploy to Railway, Render, or Heroku
2. Set environment variables
3. Connect to MongoDB Atlas
4. Configure CORS for the production domain

### Frontend (React + Vite)

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Deploy to Vercel, Netlify, or AWS S3
3. Update `VITE_API_URL` to production backend URL

## 🐛 Known Issues

- AI suggestions depend on OpenAI API quota availability
- Large files (nearly 2MB) may take longer to process
- Email OTP requires proper SMTP configuration

## 🗺️ Future Enhancements

- [ ] ATS (Applicant Tracking System) score
- [ ] Resume template suggestions
- [ ] Job search integration
- [ ] Resume version history
- [ ] PDF report generation
- [ ] Batch resume analysis
- [ ] Chrome extension for LinkedIn
- [ ] Mobile app (React Native)

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

- OpenAI for the GPT API
- React and Vite communities
- Tailwind CSS team
- All open-source contributors

## 📧 Contact

For questions or support, please contact: aloksisodiya30@gmail.com

---

Made with ❤️ by Alok Sisodiya

