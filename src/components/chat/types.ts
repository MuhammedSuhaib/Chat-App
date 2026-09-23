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

export interface AppTheme {
  text1: string;
  text2: string;
  bgImage: string;
}

export interface Preview {
  data: string;
  type: string;
  name?: string;
}
