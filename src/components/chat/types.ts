// Represents a chat message document stored in Firestore.
export interface Message {
  id: string;
  text: string;
  displayName: string;
  photoURL: string;
  createdAt: { toDate?: () => Date } | null;
  userId: string;
  mediaType?: "image" | "audio" | "pdf" | "gif";
  mediaData?: string;
  fileName?: string;
  encrypted?: boolean;
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

// Props for ColorPaletteSection component.
export interface ColorPaletteSectionProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

// OG metadata returned by the link preview API.
export interface OGData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

// Props for LinkPreview component.
export interface LinkPreviewProps {
  url: string;
}

// Props for MediaMenuPopover component.
export interface MediaMenuPopoverProps {
  onPickMedia: () => void;
  onPickCamera: (preview: Preview) => void;
}

// Props for MediaPreview component extending BaseChatProps.
export interface MediaPreviewProps extends BaseChatProps {
  preview: Preview;
  onCancel: () => void;
  onSend: () => void;
}

// Props for MessageActionsMenu component.
export interface MessageActionsMenuProps {
  isMine: boolean;
  photoURL: string;
  displayName: string;
  messageId: string;
  room: string;
  accentColor: string;
  currentText: string;
  onEdit: (id: string, text: string) => void;
}

// Props for MessageAttachment component.
export interface MessageAttachmentProps {
  mediaType?: "image" | "audio" | "pdf" | "gif";
  mediaData: string;
  fileName?: string;
  accentColor: string;
}

// Props for MessageBubble component extending RoomChatProps.
export interface MessageBubbleProps extends RoomChatProps {
  msg: Message; // The message object containing text, author details, timestamp, and optional media payload
  cryptoKey: CryptoKey | null; // Active room decryption key, if encryption is unlocked
  onEdit: (id: string, text: string) => void;
}

// Props for MessageContent component.
export interface MessageContentProps {
  text: string;
  textColor: string;
}

// Props for MessageList component extending RoomChatProps.
export interface MessageListProps extends RoomChatProps {
  messages: Message[]; // Array of chat messages for the current room
  cryptoKey: CryptoKey | null; // Active room decryption key, if encryption is unlocked
  onEdit: (id: string, text: string) => void;
}

// Props for RoomSettingsModal component.
export interface RoomSettingsModalProps {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
}

// Props for WallpaperSection component.
export interface WallpaperSectionProps {
  currentBgImage: string;
  onBgImageChange: (bgImage: string) => void;
}

// Props for ChatHeader component extending RoomChatProps.
export interface ChatHeaderProps extends RoomChatProps {
  setTheme: (t: AppTheme) => void;
  isUploading: boolean;
  encryptionEnabled: boolean;
  setEncryptionEnabled: (v: boolean) => void;
}

// Props for ChatInput component extending BaseChatProps.
export interface ChatInputProps extends BaseChatProps {
  input: string; // Current message input text
  setInput: (v: string) => void;
  editingId: string | null;
  isRecording: boolean;
  onSend: () => void;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onPrepareMedia: (file: File) => void; // Function to convert selected file into a data URL for preview
  setPreview: (p: Preview | null) => void;
}
