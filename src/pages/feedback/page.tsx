import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import { supabase } from "@/lib/supabase";

const STORE_OPTIONS = ["公館店", "中山店", "其他"];
const LIFE_STAGE_OPTIONS = ["學生 / 求職中", "職場人士", "即將畢業", "籌備婚禮", "新手爸媽", "其他人生階段"];
const ACTIVITY_OPTIONS = ["攝影課程", "妝髮教學", "外拍活動", "職涯形象諮詢", "品牌合作 / 聯名", "其他活動"];
const BRAND_FEELING_OPTIONS = ["專業可靠", "溫馨親切", "時尚有質感", "價格實惠", "其他感受"];
const PHOTO_AUTH_OPTIONS = ["同意公開分享（社群／官網）", "僅作品集使用，不公開姓名", "不同意使用", "其他"];
const OTHER_LABEL_PREFIX = "其他";

const inputClass =
  "px-3 py-2 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold bg-white text-brand-charcoal";
const textareaClass = `${inputClass} resize-y`;

function pillClass(active: boolean) {
  return `px-3 py-2 text-sm border-2 rounded-full cursor-pointer transition-all duration-150 ${
    active ? "border-brand-navy bg-brand-cream font-semibold" : "border-brand-creamDark bg-white hover:border-brand-gold"
  }`;
}

function toggleInArray(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

interface FormState {
  name: string;
  email: string;
  storeLocation: string;
  storeLocationOther: string;
  favoriteMoment: string;
  npsScore: number | null;
  improvementSuggestion: string;
  desiredProducts: string;
  likedParts: string;
  lifeStage: string[];
  lifeStageOther: string;
  activityInterest: string[];
  activityInterestOther: string;
  brandFeeling: string;
  brandFeelingOther: string;
  photoAuth: string;
  photoAuthOther: string;
  futureMessage: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  storeLocation: "",
  storeLocationOther: "",
  favoriteMoment: "",
  npsScore: null,
  improvementSuggestion: "",
  desiredProducts: "",
  likedParts: "",
  lifeStage: [],
  lifeStageOther: "",
  activityInterest: [],
  activityInterestOther: "",
  brandFeeling: "",
  brandFeelingOther: "",
  photoAuth: "",
  photoAuthOther: "",
  futureMessage: "",
};

export default function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("請填寫姓名與 Email");
      return;
    }
    setSubmitting(true);
    setError(null);

    const { error: submitError } = await supabase.from("survey_responses").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      store_location: form.storeLocation || null,
      store_location_other: form.storeLocationOther || null,
      favorite_moment: form.favoriteMoment || null,
      nps_score: form.npsScore,
      improvement_suggestion: form.improvementSuggestion || null,
      desired_products: form.desiredProducts || null,
      liked_parts: form.likedParts || null,
      life_stage: form.lifeStage.length ? form.lifeStage : null,
      life_stage_other: form.lifeStageOther || null,
      activity_interest: form.activityInterest.length ? form.activityInterest : null,
      activity_interest_other: form.activityInterestOther || null,
      brand_feeling: form.brandFeeling || null,
      brand_feeling_other: form.brandFeelingOther || null,
      photo_auth: form.photoAuth || null,
      photo_auth_other: form.photoAuthOther || null,
      future_message: form.futureMessage || null,
      source: "web",
      session_id: sessionId || null,
    });

    setSubmitting(false);

    if (submitError) {
      setError("送出失敗，請稍後再試一次。");
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <PageSEO
        title="意見回饋 | 好時有影 Golden Years Studio"
        description="告訴我們您這次拍攝的感受，好時有影期待您的每一則回饋。"
      />
      <Header />
      <main className="bg-brand-cream py-12 md:py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
              GOLDEN FEEDBACK
            </p>
            <h1 className="text-display text-2xl md:text-3xl font-medium mb-3">
              我們想聽聽您的感受
            </h1>
            <p className="text-brand-textLight text-sm md:text-base">
              感謝您選擇好時有影，您的每一則回饋，都是我們持續進步的養分。
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-brand-navy font-medium text-lg mb-2">感謝您的填寫！</p>
              <p className="text-brand-textLight text-sm">
                我們已經收到您的回饋，期待與您下一次的相遇。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 md:p-8">
              <label className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  您的姓名 <em className="text-red-600 not-italic">*</em>
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  Email <em className="text-red-600 not-italic">*</em>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                />
              </label>

              <div className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">您拍攝的門市</span>
                <div className="flex flex-wrap gap-2">
                  {STORE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("storeLocation", opt)}
                      aria-pressed={form.storeLocation === opt}
                      className={pillClass(form.storeLocation === opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {form.storeLocation === "其他" && (
                  <input
                    type="text"
                    value={form.storeLocationOther}
                    onChange={(e) => update("storeLocationOther", e.target.value)}
                    placeholder="請說明門市或拍攝地點"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  您有多大機率會推薦好時有影給親友？
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 11 }, (_, i) => i).map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => update("npsScore", score)}
                      aria-pressed={form.npsScore === score}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm font-medium cursor-pointer transition-all duration-150 ${
                        form.npsScore === score
                          ? "border-brand-navy bg-brand-cream font-semibold"
                          : "border-brand-creamDark bg-white hover:border-brand-gold"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-brand-textMuted">
                  <span>0・完全不會</span>
                  <span>10・非常願意</span>
                </div>
              </div>

              <label className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  拍攝過程中，有沒有讓您印象最深刻的瞬間？
                </span>
                <textarea
                  value={form.favoriteMoment}
                  onChange={(e) => update("favoriteMoment", e.target.value)}
                  rows={3}
                  className={textareaClass}
                />
              </label>

              <label className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  您最喜歡我們服務的哪些部分？（例如：妝髮、攝影師引導、修圖品質等）
                </span>
                <textarea
                  value={form.likedParts}
                  onChange={(e) => update("likedParts", e.target.value)}
                  rows={2}
                  className={textareaClass}
                />
              </label>

              <label className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  我們可以怎麼做得更好？
                </span>
                <textarea
                  value={form.improvementSuggestion}
                  onChange={(e) => update("improvementSuggestion", e.target.value)}
                  rows={3}
                  className={textareaClass}
                />
              </label>

              <label className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  您希望我們未來提供哪些產品或服務？
                </span>
                <textarea
                  value={form.desiredProducts}
                  onChange={(e) => update("desiredProducts", e.target.value)}
                  rows={2}
                  className={textareaClass}
                />
              </label>

              <div className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">您目前的人生階段（可複選）</span>
                <div className="flex flex-wrap gap-2">
                  {LIFE_STAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("lifeStage", toggleInArray(form.lifeStage, opt))}
                      aria-pressed={form.lifeStage.includes(opt)}
                      className={pillClass(form.lifeStage.includes(opt))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {form.lifeStage.includes(OTHER_LABEL_PREFIX + "人生階段") && (
                  <input
                    type="text"
                    value={form.lifeStageOther}
                    onChange={(e) => update("lifeStageOther", e.target.value)}
                    placeholder="請說明"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">您對哪些活動有興趣？（可複選）</span>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("activityInterest", toggleInArray(form.activityInterest, opt))}
                      aria-pressed={form.activityInterest.includes(opt)}
                      className={pillClass(form.activityInterest.includes(opt))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {form.activityInterest.includes(OTHER_LABEL_PREFIX + "活動") && (
                  <input
                    type="text"
                    value={form.activityInterestOther}
                    onChange={(e) => update("activityInterestOther", e.target.value)}
                    placeholder="請說明"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">好時有影給您的整體感受是？</span>
                <div className="flex flex-wrap gap-2">
                  {BRAND_FEELING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("brandFeeling", opt)}
                      aria-pressed={form.brandFeeling === opt}
                      className={pillClass(form.brandFeeling === opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {form.brandFeeling === OTHER_LABEL_PREFIX + "感受" && (
                  <input
                    type="text"
                    value={form.brandFeelingOther}
                    onChange={(e) => update("brandFeelingOther", e.target.value)}
                    placeholder="請說明"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">照片使用授權</span>
                <div className="flex flex-wrap gap-2">
                  {PHOTO_AUTH_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("photoAuth", opt)}
                      aria-pressed={form.photoAuth === opt}
                      className={pillClass(form.photoAuth === opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {form.photoAuth === OTHER_LABEL_PREFIX && (
                  <input
                    type="text"
                    value={form.photoAuthOther}
                    onChange={(e) => update("photoAuthOther", e.target.value)}
                    placeholder="請說明"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <label className="flex flex-col gap-2 mb-6">
                <span className="text-sm font-medium text-brand-charcoal">
                  還有什麼想對好時有影說的話嗎？
                </span>
                <textarea
                  value={form.futureMessage}
                  onChange={(e) => update("futureMessage", e.target.value)}
                  rows={3}
                  className={textareaClass}
                />
              </label>

              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center px-7 py-3 rounded-full bg-brand-navy text-white text-base font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "送出中…" : "送出回饋"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
