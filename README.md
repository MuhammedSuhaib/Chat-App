# Firebase Chat App (PWA)

A real-time, privacy-focused chat application built with Next.js 15, Firebase, and TypeScript. Features Google authentication, end-to-end encryption on demand, audio voice notes, rich media previews, native browser notifications, customizable wallpapers, and Progressive Web App (PWA) offline support.

## 🚀 Key Features

- 🔐 **Google Authentication** - Secure sign-in with Firebase Auth.
- 🔒 **On-Demand End-to-End Encryption** - AES-GCM 256-bit client-side encryption using PBKDF2 passphrase key derivation.
- 💬 **Real-time Messaging** - Instant live chat powered by Firebase Firestore.
- 🎙️ **Voice Notes** - Record, preview, and play audio voice notes directly inside the chat interface.
- 📸 **Media & File Attachments** - Share images, GIFs, and PDF documents.
- 🔔 **Native Push Notifications** - Background browser notifications when new messages arrive.
- 🎨 **Theme & Local Wallpapers** - Custom accent colors and upload custom local image wallpapers or URLs.
- 📱 **PWA & Mobile Responsive** - Installable Progressive Web App with offline caching support (`@ducanh2912/next-pwa`).

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.2 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Primitives:** Radix UI (`Popover`, `DropdownMenu`, etc.)
- **Icons:** Lucide React
- **Authentication & Database:** Firebase Auth & Firestore
- **Security:** Web Crypto API (`SubtleCrypto` for AES-GCM encryption)
- **PWA Integration:** `@ducanh2912/next-pwa`

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/
│   │   └── og/           # OpenGraph link preview metadata API route
│   ├── rooms/            # Dynamic chat room routes (`/rooms/[room]`)
│   ├── layout.tsx        # Root layout with PWA manifest & theme providers
│   └── page.tsx          # Home page & room creation
├── components/           # React components
│   ├── auth/             # Authentication forms & handlers
│   ├── chat/             # Modular chat components & barrel exports
│   │   ├── ChatHeader.tsx          # Header with encryption toggle & settings
│   │   ├── ChatInput.tsx           # Message input, media attachment & mic recorder
│   │   ├── ColorPaletteSection.tsx # Color theme selector
│   │   ├── LinkPreview.tsx         # OpenGraph metadata preview for links
│   │   ├── MediaMenuPopover.tsx    # Media upload popover menu
│   │   ├── MediaPreview.tsx        # Modal preview for images, audio & PDFs
│   │   ├── MessageActionsMenu.tsx  # Context menu for message actions
│   │   ├── MessageAttachment.tsx   # Attachment renderer
│   │   ├── MessageBubble.tsx       # Message bubble with decryption & media rendering
│   │   ├── MessageContent.tsx      # Render message text & links
│   │   ├── MessageList.tsx         # Auto-scrolling message list container
│   │   ├── RoomSettingsModal.tsx   # Room configuration modal
│   │   ├── WallpaperSection.tsx    # Wallpaper customization options
│   │   ├── index.ts                # Module export aggregator
│   │   └── types.ts                # TypeScript types & interfaces
│   ├── encryption/       # Web Crypto API encryption hooks & components
│   ├── ui/               # Reusable UI components (button, popover, etc.)
│   ├── AvatarDropdown.tsx # User avatar & account menu
│   ├── ChatUI.tsx        # Chat orchestrator component
│   └── Theme-provider.tsx
├── hooks/                # Custom React hooks (audio recording, room messages)
└── lib/                  # Utilities, actions & Firebase helpers
    ├── actions/          # Server actions for room creation/fetching
    ├── encryption.ts     # Web Crypto API AES-GCM encryption/decryption helpers
    ├── firebase.ts       # Firebase app initialization & config
    └── utils.ts          # Utility helper functions
```

## 💻 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase Project set up with Auth and Firestore enabled

### Installation

1. Clone this repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build production bundle & PWA service worker
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint code checks


## NEXT
- Testing














