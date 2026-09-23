//? THIS is for creating rooms
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

export async function createRoom(name: string, userId: string) {
  // 1. Create room with auto ID
  const roomRef = await addDoc(collection(db, "rooms"), {
    name,
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  // 2. Add owner as approved member in subcollection
  await setDoc(doc(db, "rooms", roomRef.id, "members", userId), {
    approved: true,
  });

  return roomRef.id; // return the new room ID if needed
}
