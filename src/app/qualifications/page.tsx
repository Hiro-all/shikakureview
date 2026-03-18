"use client";

import { supabase } from "@/lib/supabase";
import { Qualification } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QualificationsPage() {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("qualifications")
        .select("*")
        .order("name");
      if (data) setQualifications(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = qualifications.filter((q) =>
    q.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        資格一覧
      </h1>

      <input
        type="text"
        placeholder="資格名で検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">該当する資格が見つかりません。</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <Link
              key={q.id}
              href={`/qualifications/${q.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-800">{q.name}</h2>
              <p className="text-sm text-blue-600 mt-1">詳細を見る →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
