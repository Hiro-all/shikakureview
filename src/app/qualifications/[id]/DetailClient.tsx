"use client";

import { supabase } from "@/lib/supabase";
import { Qualification, Review } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-500">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export default function DetailClient() {
  const params = useParams();
  const id = params.id as string;

  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [qualRes, revRes] = await Promise.all([
        supabase.from("qualifications").select("*").eq("id", id).single(),
        supabase
          .from("reviews")
          .select("*")
          .eq("qualification_id", id)
          .order("created_at", { ascending: false }),
      ]);
      if (qualRes.data) setQualification(qualRes.data as Qualification);
      if (revRes.data) setReviewList(revRes.data as Review[]);
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 py-16">読み込み中...</p>;
  }

  if (!qualification) {
    return <p className="text-center text-gray-500 py-16">資格が見つかりません。</p>;
  }

  const reviewCount = reviewList.length;

  const avgStudyHours =
    reviewCount > 0
      ? Math.round(
          reviewList.reduce((sum, r) => sum + r.study_hours, 0) / reviewCount
        )
      : 0;
  const avgDifficulty =
    reviewCount > 0
      ? Math.round(
          reviewList.reduce((sum, r) => sum + r.difficulty, 0) / reviewCount
        )
      : 0;
  const avgUsefulness =
    reviewCount > 0
      ? Math.round(
          reviewList.reduce((sum, r) => sum + r.usefulness, 0) / reviewCount
        )
      : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {qualification.name}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">平均勉強時間</p>
          <p className="text-3xl font-bold text-blue-600">
            {reviewCount > 0 ? `${avgStudyHours}時間` : "—"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">難易度</p>
          <p className="text-2xl">
            {reviewCount > 0 ? <Stars count={avgDifficulty} /> : "—"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">実用度</p>
          <p className="text-2xl">
            {reviewCount > 0 ? <Stars count={avgUsefulness} /> : "—"}
          </p>
        </div>
      </div>

      {/* Write Review Button */}
      <div className="mb-8">
        <Link
          href={`/reviews/new?qualification_id=${id}`}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
        >
          レビューを書く
        </Link>
        <span className="ml-3 text-gray-500 text-sm">
          {reviewCount}件のレビュー
        </span>
      </div>

      {/* Reviews List */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">レビュー一覧</h2>
      {reviewList.length > 0 ? (
        <div className="space-y-4">
          {reviewList.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span className="font-medium">
                  勉強時間: {review.study_hours}時間
                </span>
                {review.study_period && (
                  <span>勉強期間: {review.study_period}</span>
                )}
                <span>
                  難易度: <Stars count={review.difficulty} />
                </span>
                <span>
                  実用度: <Stars count={review.usefulness} />
                </span>
                {review.attempts && <span>受験回数: {review.attempts}回</span>}
              </div>
              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          まだレビューがありません。最初のレビューを投稿しましょう！
        </p>
      )}
    </div>
  );
}
