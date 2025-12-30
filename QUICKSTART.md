# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database password
7. Add `?retryWrites=true&w=majority` at the end if not present

### Step 2: Configure Backend (1 minute)

1. Navigate to `server` folder
2. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
3. Edit `.env` and add:
   ```env
   MONGO_URI=your_connection_string_from_step_1
   JWT_SECRET=any_random_string_at_least_32_characters_long
   PORT=5000
   NODE_ENV=development
   ```

### Step 3: Install Dependencies (1 minute)

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### Step 4: Run the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Wait for: `Server running in development mode on port 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Wait for: `Local: http://localhost:3000`

### Step 5: Test It Out! 🎉

1. Open `http://localhost:3000` in your browser
2. Click "Sign Up" to create an account
3. Upload a PDF resume
4. View your analysis results!

## ✅ Troubleshooting

### MongoDB Connection Error
- Check your `MONGO_URI` in `.env`
- Make sure you whitelisted your IP in MongoDB Atlas
- Verify your password doesn't have special characters (URL encode if needed)

### Port Already in Use
- Change `PORT` in `server/.env` to a different number (e.g., 5001)
- Update `VITE_API_URL` in `client/.env` to match

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### PDF Upload Fails
- Ensure file is actually a PDF
- Check file size is under 5MB
- Verify backend is running

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check out the API endpoints
- Customize the scoring algorithm in `server/services/resumeAnalysisEngine.js`
- Deploy to production using the deployment guide in README

Happy analyzing! 🚀

