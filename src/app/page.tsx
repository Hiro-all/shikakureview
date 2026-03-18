"use client";

import { supabase } from "@/lib/supabase";
import { Qualification, ReviewWithQualification } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-500">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export default function HomePage() {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [recentReviews, setRecentReviews] = useState<ReviewWithQualification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [qualRes, revRes] = await Promise.all([
        supabase.from("qualifications").select("*").order("name"),
        supabase
          .from("reviews")
          .select("*, qualifications(id, name)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (qualRes.data) setQualifications(qualRes.data as Qualification[]);
      if (revRes.data) setRecentReviews(revRes.data as ReviewWithQualification[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-16">Loading...</p>;
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Shikaku Review
        </h1>
        <p className="text-gray-500 text-lg mb-6">
          Real reviews for professional certifications
        </p>
        <Link
          href="/qualifications"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
        >
          Browse Certifications
        </Link>
      </section>

      {/* Popular Certifications */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Popular Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {qualifications.map((q) => (
            <Link
              key={q.id}
              href={`/qualifications/${q.id}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition block"
            >
              <h3 className="font-semibold text-gray-800">{q.name}</h3>
              <p className="text-sm text-blue-600 mt-1">View details →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Reviews */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recent Reviews
        </h2>
        {recentReviews.length > 0 ? (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Link
                    href={`/qualifications/${review.qualification_id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {review.qualifications?.name}
                  </Link>
                  <span className="text-sm text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-gray-600 mb-2">
                  <span>Study: {review.study_hours}h</span>
                  <span>
                    Difficulty: <Stars count={review.difficulty} />
                  </span>
                  <span>
                    Usefulness: <Stars count={review.usefulness} />
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        )}
      </section>
    </div>
  );
}
