# Atena - AI-Powered Learning Assistant Platform

<div align="center">
  <img src="/public/logo.png" alt="Atena Logo" width="200">
  <p><em>Your personalized study companion</em></p>
</div>

## Overview

Atena is a comprehensive learning platform designed to help students optimize their study sessions, collaborate with peers, and leverage AI-assisted learning tools. The application combines modern educational methodologies with cutting-edge AI technology to provide a personalized learning experience.

## Features

### 📚 Study Dashboard

- **Study Sessions Management**: Create, schedule, and track study sessions with customizable focus timers
- **Analytics & Progress Tracking**: Visualize your study habits and progress with detailed charts and statistics
- **Note Taking**: Create and organize structured notes with support for markdown, code snippets, and file attachments
- **Spaced Repetition**: Automatically schedule review sessions based on proven learning science

### 🤖 AI Assistant

- **Contextual Learning Support**: Ask questions about your study materials and get instant, relevant answers
- **Personalized Explanations**: Receive explanations tailored to your knowledge level and learning style
- **Study Material Generation**: Generate practice problems, flashcards, and study guides based on your notes
- **Multiple AI Models**: Choose between different AI models including Claude, GPT, Gemini, and more

### 👥 Collaboration

- **Real-time Collaboration**: Work together on study materials, notes, and problem-solving
- **Group Study Sessions**: Create or join virtual study rooms with integrated chat and file sharing
- **Resource Sharing**: Share notes, documents, and learning resources with peers
- **Discussion Threads**: Create topic-specific discussions to deepen understanding

### 📅 Schedule & Calendar

- **Smart Scheduling**: AI-powered recommendations for optimal study times
- **Calendar Integration**: Sync your study schedule with external calendars (Google, Outlook)
- **Deadline Tracking**: Never miss an assignment or exam with reminder notifications
- **Pomodoro Timer**: Built-in focus timer with customizable work/break periods

### ⚙️ Customization & Accessibility

- **Themes**: Light, dark, and high-contrast themes
- **Accessibility Features**: Screen reader support, keyboard navigation, reduced motion, and large text options
- **Personalized Settings**: Tailor the interface to your preferences and workflow

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router) with Server Components
- **Language**: TypeScript
- **UI Components**: Custom components built with Tailwind CSS and Radix UI
- **State Management**: React Context API and SWR for data fetching and caching
- **Animations**: Framer Motion for smooth, accessible animations

### Backend

- **API Routes**: Next.js API routes for serverless function handling
- **Authentication**: NextAuth.js for secure authentication with multiple providers
- **Database Access**: Prisma ORM for type-safe database queries
- **AI Integration**: OpenAI, Anthropic, and Google API clients

### Database & Storage

- **Database**: PostgreSQL for relational data storage
- **File Storage**: Vercel Blob Storage for user-uploaded files
- **Caching**: Redis for performance optimization

### Deployment & Infrastructure

- **Hosting**: Vercel for frontend and serverless functions
- **CI/CD**: GitHub Actions for continuous integration and deployment
- **Monitoring**: Vercel Analytics and custom logging

## Project Structure

```
atena/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main application pages
│   │   ├── ai-assistant/ # AI assistant feature
│   │   ├── calendar/     # Calendar and scheduling
│   │   ├── collaborate/  # Collaboration features
│   │   ├── notes/        # Note-taking functionality
│   │   ├── settings/     # User settings
│   │   └── study/        # Study session management
│   └── providers.tsx     # Global context providers
├── components/           # Reusable UI components
│   ├── ai/               # AI-related components
│   ├── auth/             # Authentication components
│   ├── calendar/         # Calendar components
│   ├── collaborate/      # Collaboration components
│   ├── dashboard-layout/ # Layout components for dashboard
│   ├── notes/            # Note-taking components
│   ├── study/            # Study session components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions & services
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Service integrations
│   ├── stores/           # Client-side stores
│   └── utils/            # Helper functions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## Data Storage & Persistence

### User Data

- **User Profiles**: PostgreSQL (users table)
- **Preferences**: PostgreSQL (user_preferences table)
- **Authentication**: JWT stored in HTTP-only cookies

### Application Data

- **Study Sessions**: PostgreSQL (study_sessions table)
- **Notes**: PostgreSQL (notes, note_blocks tables)
- **Calendar Events**: PostgreSQL (calendar_events table)
- **Collaboration**: PostgreSQL (conversations, messages, shared_resources tables)

### AI Conversations

- **Chat History**: PostgreSQL (ai_conversations, ai_messages tables)
- **Prompt Templates**: PostgreSQL (ai_prompt_templates table)

### Files & Media

- **Uploaded Files**: Vercel Blob Storage with metadata in PostgreSQL
- **Images**: Vercel Blob Storage with optimized delivery

## Setup & Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database
- API keys for AI services (OpenAI, Anthropic, etc.)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/atena.git
cd atena
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/atena"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

4. **Set up the database**

```bash
npx prisma migrate dev
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**

Navigate to `http://localhost:3000` to see the application running.

## Accessibility

Atena is committed to accessibility for all users. The application includes:

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for interactive elements
- Screen reader compatibility
- Customizable text size and contrast
- Reduced motion option
- Color schemes that meet WCAG 2.1 AA contrast requirements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or suggestions, please open an issue on GitHub or contact the development team at [support@atena.app](mailto:support@atena.app).

---

<div align="center">
  <p>Made with ❤️ for better learning experiences</p>
</div> 