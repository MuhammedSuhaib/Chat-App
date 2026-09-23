"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
  const [room, setRoom] = useState("");
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const router = useRouter();

  // Load rooms on mount (only on client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("joinedRooms");
      if (saved) {
        setJoinedRooms(JSON.parse(saved));
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = room.trim();
    if (!trimmed) return;

    // Update local state and localStorage
    if (!joinedRooms.includes(trimmed)) {
      const updated = [...joinedRooms, trimmed];
      setJoinedRooms(updated);
      localStorage.setItem("joinedRooms", JSON.stringify(updated));
    }

    // Navigate to room
    router.push(`/rooms/${trimmed}`);
    setRoom("");
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white text-center">
        🚪 Enter a Chat Room
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room name..."
          className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition text-white font-semibold py-2 rounded-md shadow"
        >
          Join Room 🚀
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
          🧾 Your Rooms
        </h2>
        {joinedRooms.length === 0 ? (
          <p className="text-sm text-gray-500">No rooms yet.</p>
        ) : (
          <ul className="list-none space-y-1">
            {joinedRooms.map((r) => (
              <li key={r}>
                <a
                  href={`/rooms/${r}`}
                  className="block px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition"
                >
                  #{r}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
