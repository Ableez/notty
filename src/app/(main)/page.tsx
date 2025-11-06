"use client";

import { useQuery } from "convex/react";
import { api } from "#/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

export default function WallsPage() {
  const { user } = useUser();
  const router = useRouter();
  const walls = useQuery(api.walls.get, {
    userId: user?.id || null,
  });
  const createWall = useMutation(api.walls.create);

  const handleCreateWall = async () => {
    if (!user) return;
    const wallId = await createWall({
      title: "New Wall",
      userId: user.id,
    });
    router.push(`/wall/${wallId}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Walls</h1>
        <button
          onClick={handleCreateWall}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Wall
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {walls?.map((wall) => (
          <Link key={wall._id} href={`/wall/${wall._id}`}>
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <h2 className="text-lg font-semibold">{wall.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
