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
    <div className="card-primary p-6 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center tracking-wide">
        Enter a{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Chat Room
        </span>
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room name..."
          className="input-primary"
        />
        <button type="submit" className="btn-primary py-2">
          Join Room
        </button>
      </form>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          🧾 Your Rooms
        </h2>
        {joinedRooms.length === 0 ? (
          <p className="text-xs text-zinc-500">No rooms joined yet.</p>
        ) : (
          <ul className="list-none space-y-1.5 max-h-48 overflow-y-auto">
            {joinedRooms.map((r) => (
              <li key={r}>
                <a
                  href={`/rooms/${r}`}
                  className="block px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 hover:border-primary/40 hover:bg-primary/10 text-primary hover:text-secondary text-sm font-medium transition-all"
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
