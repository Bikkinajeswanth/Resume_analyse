# Resume Analyzer - AI-Powered Resume Optimization Platform

A production-grade, futuristic Resume Analyzer Web Application built with the MERN stack that intelligently analyzes resumes section-by-section, scores them, and provides actionable insights to help job seekers optimize their resumes for better ATS compatibility and job readiness.

![Resume Analyzer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

## 🚀 Features

### Core Functionality
- **PDF Resume Upload** - Secure file upload with validation
- **AI-Powered Analysis** - Intelligent section detection and scoring
- **Section-Wise Scoring** - Detailed scores (0-100) for each resume section:
  - Personal Information
  - Professional Summary
  - Skills
  - Work Experience
  - Education
  - Projects
  - Certifications
  - Formatting Quality

### Advanced Analytics
- **Overall Resume Score** - Weighted composite score (0-100)
- **ATS Compatibility Score** - Measures how well your resume passes Applicant Tracking Systems
- **Role Fit Analysis** - Determines best-fit role (Frontend/Backend/Full Stack/DevOps/Data Science)
- **Resume Strength Level** - Categorizes as Beginner, Intermediate, or Industry Ready
- **Skill Extraction** - Automatically identifies technical skills
- **Keyword Density Analysis** - Tracks important keyword usage
- **Missing Skills Detection** - Suggests relevant skills to add

### Actionable Feedback
- Section-wise improvement suggestions
- Missing sections detection
- Bullet point quality analysis
- Resume length & readability insights
- Priority-based recommendations (High/Medium/Low)

### User Features
- **JWT Authentication** - Secure signup/login
- **Resume History** - Track all previous analyses
- **Interactive Dashboard** - Visual score breakdown with charts
- **Detailed Results View** - Comprehensive analysis with visualizations
- **Delete/Manage** - Full CRUD operations for resume analyses

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - Modern React with fast HMR
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, responsive charts
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** (Mongoose) - NoSQL database
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Resume_lyzer/
├── server/                 # Backend
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── auth.js        # JWT protection
│   │   └── upload.js      # File upload config
│   ├── models/
│   │   ├── User.js
│   │   └── ResumeAnalysis.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── resumeRoutes.js
│   ├── services/
│   │   └── resumeAnalysisEngine.js  # Core analysis logic
│   ├── server.js          # Express app entry point
│   └── package.json
│
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ScoreGauge.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadResume.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   └── ResumeHistory.jsx
│   │   ├── utils/
│   │   │   ├── api.js     # Axios configuration
│   │   │   └── auth.js    # Auth helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Resume_lyzer
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
NODE_ENV=development
```

**Important:**
- Replace `MONGO_URI` with your MongoDB Atlas connection string
- Generate a strong `JWT_SECRET` (minimum 32 characters)
- Never commit `.env` files to version control

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update this to your backend API URL.

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### ResumeAnalysis Model
```javascript
{
  userId: ObjectId (ref: User),
  resumeText: String,
  fileName: String,
  detectedSections: {
    personalInfo: Boolean,
    summary: Boolean,
    skills: Boolean,
    workExperience: Boolean,
    education: Boolean,
    projects: Boolean,
    certifications: Boolean
  },
  sectionScores: {
    personalInfo: Number (0-100),
    summary: Number (0-100),
    skills: Number (0-100),
    workExperience: Number (0-100),
    education: Number (0-100),
    projects: Number (0-100),
    certifications: Number (0-100),
    formatting: Number (0-100)
  },
  extractedSkills: [String],
  matchedSkills: [String],
  missingSkills: [String],
  atsScore: Number (0-100),
  roleFit: String (enum),
  resumeScore: Number (0-100),
  resumeStrength: String (enum),
  feedback: [{
    section: String,
    type: String,
    message: String,
    priority: String
  }],
  keywordDensity: Map,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Resume Analysis
- `POST /api/resume/analyze` - Analyze uploaded resume (protected)
- `GET /api/resume/history` - Get user's resume history (protected)
- `GET /api/resume/:id` - Get specific analysis (protected)
- `DELETE /api/resume/:id` - Delete analysis (protected)

### Health Check
- `GET /api/health` - API health status

## 🎨 UI/UX Features

- **Modern, Futuristic Design** - Clean, professional interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Interactive Charts** - Visual score breakdowns using Recharts
- **Real-time Feedback** - Toast notifications for user actions
- **Drag & Drop Upload** - Easy file upload experience
- **Progress Indicators** - Visual feedback during analysis
- **Color-coded Scores** - Green (75+), Amber (50-74), Red (<50)

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. **Push code to GitHub**
2. **Connect repository to Render/Railway**
3. **Set environment variables:**
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT` (usually auto-assigned)
4. **Deploy**

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```
2. **Deploy the `dist` folder to Vercel/Netlify**
3. **Set environment variable:**
   - `VITE_API_URL` - Your backend API URL

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs in development)
5. Get your connection string
6. Replace `<password>` and `<dbname>` in the connection string
7. Add to `MONGO_URI` in your `.env` file

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- File type validation (PDF only)
- File size limits (5MB)
- CORS configuration
- Environment variable protection

## 📈 Scoring Algorithm

The resume scoring uses a weighted algorithm:

- **Personal Info** (5%) - Contact details, LinkedIn, GitHub
- **Summary** (10%) - Length, keywords, action verbs
- **Skills** (20%) - Number, categorization, relevance
- **Work Experience** (30%) - Bullet points, action verbs, quantifiable achievements
- **Education** (15%) - Degree, university, graduation details
- **Projects** (10%) - Project mentions, technologies, links
- **Certifications** (5%) - Certification mentions
- **Formatting** (5%) - Spacing, headers, bullet points, length

## 🧪 Testing

To test the application:

1. Register a new account
2. Upload a PDF resume
3. View the analysis results
4. Check the dashboard for statistics
5. Review resume history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues, questions, or contributions, please open an issue on the repository.

## 🎯 Future Enhancements

- [ ] Job description matching
- [ ] Resume comparison tool
- [ ] Export analysis as PDF
- [ ] Resume templates
- [ ] AI-powered resume rewriting
- [ ] Integration with job boards
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ using the MERN Stack**

