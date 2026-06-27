import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import FloatingButtons from '@/components/feature/FloatingButtons';
import PageSEO from '@/components/base/PageSEO';
import { BookingSuccess } from '../components/BookingSuccess';
import { safeJsonParse } from '../domain/errors';
import { fetchBookingByToken } from '../api';
import type { BookingSummary } from '../types';
import type { WebsiteBookingPreview } from '../api';

import { STORAGE_KEY } from '../config';

function previewToSummary(p: WebsiteBookingPreview): BookingSummary {
  return {
    booking: {
      id: p.id,
      code: p.code,
      start_date_time: p.shoot_datetime,
      end_date_time: p.shoot_datetime,
      is_confirmed: '1',
      hash: p.id,
    },
    serviceLabel: p.makeup_addon ? `${p.shoot_type} · ${p.makeup_addon}` : p.shoot_type,
    storeLabel: p.store_name,
    client: { name: '', email: '', phone: '' },
    additionalAnswers: [],
    arrivalTime: null,
  };
}

export default function BookingThankYouPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const [summary, setSummary] = useState<BookingSummary | null>(() =>
    safeJsonParse<BookingSummary>(localStorage.getItem(STORAGE_KEY)),
  );
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    if (summary || !code) return;
    fetchBookingByToken(code)
      .then((p) => setSummary(previewToSummary(p)))
      .catch(() => setServerError(true));
  }, [code, summary]);

  const handleNewBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/booking');
  };

  if (!summary) {
    return (
      <>
        <PageSEO
          title="預約成功 | 好時有影 Golden Years Studio"
          description="您的預約已成功送出，期待與您見面！"
        />
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center bg-brand-cream px-4">
          <div className="text-center">
            {serverError || !code ? (
              <>
                <p className="text-brand-textMuted text-sm mb-4">
                  找不到預約紀錄，可能已過期或頁面直接開啟。
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/booking')}
                  className="
                    inline-flex items-center justify-center px-7 py-3
                    rounded-full bg-brand-navy text-white
                    text-base font-semibold cursor-pointer
                    transition-opacity duration-200 hover:opacity-90
                  "
                >
                  前往預約系統
                </button>
              </>
            ) : (
              <p className="text-brand-textMuted text-sm">載入預約資料中…</p>
            )}
          </div>
        </main>
        <Footer />
        <FloatingButtons />
      </>
    );
  }

  return (
    <>
      <PageSEO
        title="預約成功 | 好時有影 Golden Years Studio"
        description="您的預約已成功送出，期待與您見面！"
      />
      <Header />
      <main className="bg-brand-cream py-12 md:py-20 px-4">
        <div className="max-w-xl mx-auto animate-step-enter">
          <BookingSuccess summary={summary} onNewBooking={handleNewBooking} />
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
