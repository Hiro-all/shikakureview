import { supabase } from "@/lib/supabase";
import DetailClient from "./DetailClient";

export async function generateStaticParams() {
  const { data } = await supabase.from("qualifications").select("id");
  return (data || []).map((q: { id: string }) => ({ id: q.id }));
}

export default function QualificationDetailPage() {
  return <DetailClient />;
}
