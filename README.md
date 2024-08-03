# KodaWorld

KodaWorld is an innovative AI-powered educational platform designed to make learning engaging and interactive for students across various subjects. With its unique blend of llm technology and gamified learning experiences, KodaWorld aims to revolutionize the way students approach education.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Usage](#usage)
- [Contact](#contact)

## Features

- **AI-Powered Tutoring**: Engage with advanced AI tutors specialized in different subjects.
- **Interactive Learning Environments**: Explore environments tailored to each subject.
- **Gamified Learning Experiences**: Participate in subject-specific games and challenges to reinforce learning.
- **Personalized Learning Paths**: Benefit from AI-driven curriculum optimization based on individual progress.
- **Peer Matching**: Collaborate with other students through an intelligent peer matching system.
- **Real-time Progress Tracking**: Monitor learning progress with detailed analytics and insights.
- **Multi-subject Support**: Learn across various subjects including Science, History, Geography, and Music.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **3D Rendering**: Three.js, React Three Fiber
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Backend**: Python, FastAPI
- **AI/ML**: LangChain, OpenAI GPT models
- **Database**: (Not specified in the current codebase, likely to be added)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- pnpm (v6 or later)
- AI71 API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/kodaworld.git
   cd kodaworld
   ```

2. Install frontend dependencies:
   ```
   pnpm install
   ```

3. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   AI71_API_KEY=your-ai71-api-key
   ```

5. Start the development server:
   ```
   pnpm dev
   ```

6. In a separate terminal, start the backend server:
   ```
   python -m uvicorn ai71.main:app --reload
      ```

7. Open [http://localhost:8000](http://localhost:8000) in your browser to see the application.

## Project Structure

The project is organized into two main parts:

1. **Frontend** (Next.js application in `src/` directory)
2. **Backend** (Python FastAPI application in `ai71/` directory)

Key directories:

- `src/components/`: React components
- `src/pages/`: Next.js pages
- `src/styles/`: CSS and styling files
- `ai71/`: Backend Python code
- `public/`: Static assets

## Key Components

- `KodaWorld.tsx`: Main component for the KodaWorld interface
- `CharacterBase.tsx`: Base component for character-specific pages
- `AITutor.tsx`: AI-powered tutoring component
- `CurriculumOptimizer.tsx`: AI-driven curriculum optimization tool
- `PeerMatcher.tsx`: Intelligent peer matching system
- `DialogueManager.py`: Manages conversations with AI characters
- `ScientificSimulator.py`: Generates scientific simulations

## Usage

After starting the application, users can:

1. Navigate through different subject areas represented by animal characters.
2. Engage in AI-powered tutoring sessions.
3. Participate in interactive games and simulations.
4. Track their learning progress and receive personalized recommendations.
5. Collaborate with peers on various learning activities.


