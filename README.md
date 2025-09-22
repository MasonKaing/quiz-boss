# QuizzBoss

## Description

QuizzBoss is an innovative study enhancement website that leverages the power of Gemini AI to supercharge your learning experience. Our platform is designed to transform the way you study by providing intelligent tools that adapt to your learning style.

### Key Features:
- **AI-Powered Summaries**: Automatically summarize key points from your study materials
- **Dynamic Flash Cards**: Generate custom flash cards tailored to your content
- **Interactive Quizzes**: Test your knowledge with AI-generated questions
- **Time Tracking**: Monitor your study sessions and track progress
- **Point System**: Earn points as you study and complete quizzes
- **Boss Battle Mode**: Use earned points as shields to protect yourself in epic quiz boss battles!

Transform your study routine from mundane to magnificent with QuizzBoss - where learning meets adventure!

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (version 14.0 or higher)
- **Python** (version 3.7 or higher)
- **npm** (usually comes with Node.js)

## Installation Guide

### Step 1: Clone the Repository
```bash
git clone <repository-url>
add Gemini API Key to .env.local
cd quiz-boss
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
pip install flask flask-cors
cd ..
```

### Step 4: Start the Application

#### Terminal 1 - Frontend
```bash
npm run dev
```

#### Terminal 2 - Backend
Open a new terminal window and run:
```bash
cd backend
python app.py
```

### Step 5: Access the Application
Once both servers are running, open your web browser and navigate to:
```
http://localhost:3000
```

The website should now work as intended!

## Usage

1. **Upload Study Materials**: Import your notes (copy and paste)
2. **Generate Content**: Let Gemini AI create summaries, flash cards, and quizzes
3. **Study & Earn Points**: Complete study sessions and quizzes to earn points
4. **Boss Battles**: Use your earned points as shields in challenging quiz boss fights!

## Project Structure
```
quiz-boss/
├── frontend/           # React frontend application
├── backend/           # Python Flask backend
├── public/            # Static assets
├── src/              # Source code
└── README.md         # This file
```

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Python, Flask
- **AI Integration**: Google Gemini API
- **Real-time Communication**: WebSockets

## License
This project is licensed under the MIT License.

