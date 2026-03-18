export interface Qualification {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  qualification_id: string;
  study_hours: number;
  study_period: string | null;
  difficulty: number;
  usefulness: number;
  attempts: number | null;
  comment: string | null;
  created_at: string;
}

export interface ReviewWithQualification extends Review {
  qualifications: Qualification;
}

export interface QualificationWithStats extends Qualification {
  avg_study_hours: number;
  avg_difficulty: number;
  avg_usefulness: number;
  review_count: number;
}
