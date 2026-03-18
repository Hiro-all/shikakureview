"use client";

import { supabase } from "@/lib/supabase";
import { Qualification } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl ${
            n <= value ? "text-yellow-500" : "text-gray-300"
          } hover:text-yellow-400 transition`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("qualification_id") || "";

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [qualificationId, setQualificationId] = useState(preselectedId);
  const [studyHours, setStudyHours] = useState("");
  const [studyPeriod, setStudyPeriod] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [usefulness, setUsefulness] = useState(3);
  const [attempts, setAttempts] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("qualifications")
        .select("*")
        .order("name");
      if (data) setQualifications(data);
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!qualificationId) {
      setError("資格を選択してください。");
      return;
    }
    if (!studyHours || Number(studyHours) <= 0) {
      setError("正しい勉強時間を入力してください。");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase.from("reviews").insert({
      qualification_id: qualificationId,
      study_hours: Number(studyHours),
      study_period: studyPeriod || null,
      difficulty,
      usefulness,
      attempts: attempts ? Number(attempts) : null,
      comment: comment || null,
    });

    if (insertError) {
      setError("レビューの投稿に失敗しました。もう一度お試しください。");
      setSubmitting(false);
      return;
    }

    router.push(`/qualifications/${qualificationId}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 max-w-2xl"
    >
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Certification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          資格 <span className="text-red-500">*</span>
        </label>
        <select
          value={qualificationId}
          onChange={(e) => setQualificationId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          required
        >
          <option value="">資格を選択してください</option>
          {qualifications.map((q) => (
            <option key={q.id} value={q.id}>
              {q.name}
            </option>
          ))}
        </select>
      </div>

      {/* Study Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          勉強時間 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
          placeholder="例: 100"
          min="1"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          required
        />
      </div>

      {/* Study Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          勉強期間
        </label>
        <input
          type="text"
          value={studyPeriod}
          onChange={(e) => setStudyPeriod(e.target.value)}
          placeholder="例: 3ヶ月"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          難易度 <span className="text-red-500">*</span>
        </label>
        <StarInput value={difficulty} onChange={setDifficulty} />
      </div>

      {/* Usefulness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          実用度 <span className="text-red-500">*</span>
        </label>
        <StarInput value={usefulness} onChange={setUsefulness} />
      </div>

      {/* Attempts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          受験回数
        </label>
        <input
          type="number"
          value={attempts}
          onChange={(e) => setAttempts(e.target.value)}
          placeholder="例: 1"
          min="1"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          コメント
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="あなたの体験を共有してください..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "投稿中..." : "レビューを投稿"}
      </button>
    </form>
  );
}

export default function NewReviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">レビューを書く</h1>
      <Suspense fallback={<p className="text-gray-500">フォームを読み込み中...</p>}>
        <ReviewForm />
      </Suspense>
    </div>
  );
}
