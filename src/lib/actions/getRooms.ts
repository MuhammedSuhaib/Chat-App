import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getRooms() {
  // Fetch all documents from the "rooms" collection
  const snapshot = await getDocs(collection(db, "rooms"));
  // Map each document into a plain object, merging its Firestore ID with its data
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
