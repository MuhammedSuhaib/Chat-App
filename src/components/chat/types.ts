// Represents a chat message document stored in Firestore.
export interface Message {
  id: string;
  text: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  userId: string;
  mediaType?: "image" | "audio" | "pdf" | "gif";
  mediaData?: string;
  fileName?: string;
}

// Defines custom visual theme settings for the chat room interface.
export interface AppTheme {
  text1: string;
  text2: string;
  bgImage: string;
}

// Represents temporary preview state for pending media attachments before sending.
export interface Preview {
  data: string;
  type: string;
  name?: string;
}

// Shared base interface for components that require theme settings.
export interface BaseChatProps {
  theme: AppTheme;
}

// Shared base interface for components that require both room context and theme settings.
export interface RoomChatProps extends BaseChatProps {
  room: string;
}
