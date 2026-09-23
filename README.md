# Firebase Chat App

A real-time chat application built with Next.js, Firebase, and TypeScript. Features Google authentication, multiple chat rooms, and a modern dark/light theme interface.

## Features

- 🔐 **Google Authentication** - Secure sign-in with Firebase Auth
- 💬 **Real-time Chat** - Instant messaging with Firestore
- 🏠 **Multiple Rooms** - Create and join different chat rooms
- 🌙 **Dark/Light Mode** - Toggle between themes with next-themes
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework:** Next.js 15.3.2 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Theme:** next-themes for dark/light mode
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Firebase project set up

### Installation

1. Clone this repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up Firebase configuration in `src/lib/firebase.ts`

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── rooms/         # Chat room pages
│   ├── layout.tsx     # Root layout with providers
│   └── page.tsx       # Home page
├── components/        # React components
│   ├── ui/            # Reusable UI components
│   ├── Auth.tsx       # Authentication component
|   |── AuthWrapper.tsx
│   ├── ChatUI.tsx     # Chat interface
│   └── Theme-provider.tsx
└── lib/               # Utilities and actions
    ├── actions/       # Server actions
    ├── firebase.ts    # Firebase configuration
    └── utils.ts       # Helper functions
```

## Usage

1. **Sign In:** Click the sign-in button and authenticate with Google
2. **Join Room:** Enter a room name to create or join a chat room
3. **Chat:** Send messages in real-time with other users
4. **Theme:** Toggle between light and dark modes using the theme switcher

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Add your Firebase config to `src/lib/firebase.ts`

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

This app is configured for deployment on Replit. The project includes:

- Automatic dependency installation
- Development server configuration
- Firebase hosting setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## whats next 

- encryption on demand
- peerjs
- notifications
- testable test each step after completation
- clean documentation of everything and updated readme etc