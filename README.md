# Atena - Intelligent Study Management System

Atena is an AI-driven study management platform that helps students optimize their academic performance through personalized scheduling, intelligent resource management, and data-driven insights.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Express.js, Node.js, Python (ML services)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase integration
- **ML/AI**: OpenAI API, Python custom models, TensorFlow.js
- **Real-time Features**: Supabase Realtime, WebSockets
- **State Management**: React Context API, SWR for data fetching

## Architecture Overview

The application follows a modern, scalable architecture:

1. **Next.js App Router**: Leveraging Server Components for improved performance
2. **API Routes**: Combination of Next.js API routes and Express.js microservices
3. **Serverless Functions**: For ML processing and background tasks
4. **Database Layer**: Supabase for structured data, vector embeddings for AI features
5. **Authentication Flow**: JWT-based auth with secure refresh token rotation
6. **Caching Strategy**: SWR for client-side, Redis for server-side

## Core Features Implementation Plan

### Phase 1: Foundation & User Experience

- [x] User authentication & profile management
- [x] Dashboard UI with customizable widgets
- [x] Dark/light mode implementation
- [x] Responsive design for all device sizes
- [x] Basic Pomodoro timer & task tracker

### Phase 2: AI-Powered Features

- [x] AI-Powered Pomodoro Timer
  - Smart scheduling based on workload
  - Performance tracking and adaptation
  - ML-based session duration recommendations

- [ ] Resource Library
  - Document upload & organization
  - Automatic tagging system
  - AI-generated document summaries

- [ ] Flashcard Generator
  - Note parsing & conversion to flashcards
  - Anki export compatibility
  - Spaced repetition algorithm

- [ ] Collaborative Whiteboard
  - Excalidraw integration
  - Real-time collaboration
  - Auto-save & version history

### Phase 3: Insights & Analysis

- [ ] Smart Task Prioritizer
  - ML-based assignment ranking
  - Deadline & difficulty analysis
  - Auto-scheduling suggestions

- [ ] Weakness Analysis
  - Performance tracking across subjects
  - Topic-based strength/weakness identification
  - Targeted resource recommendations

- [ ] Study Note Automation
  - Audio lecture transcription (Whisper API)
  - Note summarization & organization (GPT)
  - Key concept extraction

- [ ] Exam Predictions
  - Syllabus analysis & question generation
  - Personalized practice tests
  - Performance prediction

### Phase 4: Engagement & Wellness

- [ ] Gamification System
  - Achievement badges & milestones
  - Streak tracking & rewards
  - Weekly leaderboards (anonymous)

- [ ] Wellness Integration
  - Study/break balance monitoring
  - Mindfulness exercises integration
  - Sleep & hydration tracking

- [ ] Community Features
  - Study group formation & management
  - Peer note sharing marketplace
  - Course-specific Q&A forums

### Phase 5: Advanced Features & Monetization

- [ ] Premium Analytics
  - Advanced performance insights
  - Long-term trend analysis
  - Personalized improvement plans

- [ ] Tutor Matchmaking
  - Peer tutor discovery
  - Scheduling & payment processing
  - Rating & review system

- [ ] Resource Marketplace
  - Premium study material access
  - Educational partner integrations
  - User-generated content marketplace

## Machine Learning Services

Atena uses custom machine learning microservices to power its intelligent features:

### Pomodoro Session Optimizer

The Pomodoro Session Optimizer is a machine learning model that:
- Analyzes past study sessions and their effectiveness
- Considers factors like subject, time of day, and energy level
- Recommends optimal study and break durations
- Continuously improves based on user feedback

### ML Microservice Setup

1. Navigate to the ML services directory:
   ```bash
   cd ml-services
   ```

2. Run the setup script:
   ```bash
   ./start.sh
   ```

   This will:
   - Create a virtual environment (if needed)
   - Install required dependencies
   - Create necessary data directories
   - Start the ML microservice on port 5050

3. Verify the service is running:
   ```bash
   curl http://localhost:5050/health
   ```

### API Integration

The frontend integrates with the ML services via:
- Next.js API routes as proxy endpoints
- React Query for client-side data fetching and mutations
- Custom React hooks that abstract the ML service interaction

## Development Principles

- **Component Architecture**: Server Components by default, Client Components only when necessary
- **Error Handling**: Comprehensive error boundaries and fallback UI
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Performance**: Core Web Vitals optimization, code splitting, lazy loading
- **Security**: OWASP best practices, regular security audits
- **Testing**: Jest for unit tests, Cypress for E2E

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+ (for ML services)
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/atena.git
   cd atena
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. For ML services (optional)
   ```bash
   cd ml-services
   pip install -r requirements.txt
   python server.py
   ```

## Contribution Guidelines

- Follow kebab-case for component and file naming
- Use TypeScript for all new code
- Implement proper loading states and error handling
- Write tests for critical functionality
- Follow the provided ESLint and Prettier configurations

## License

MIT

## Contact

For questions or collaboration opportunities, reach out to [contact@atena-study.com](mailto:contact@atena-study.com) 