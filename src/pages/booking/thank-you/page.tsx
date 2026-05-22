import { useNavigate } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import FloatingButtons from '@/components/feature/FloatingButtons';
import PageSEO from '@/components/base/PageSEO';
import { BookingSuccess } from '../components/BookingSuccess';
import type { BookingSummary } from '../types';

import { STORAGE_KEY } from '../config';

export default function BookingThankYouPage() {
  const navigate = useNavigate();

  /* retrieve summary from localStorage */
  const raw = localStorage.getItem(STORAGE_KEY);
  const summary: BookingSummary | null = raw ? JSON.parse(raw) : null;

  const handleNewBooking = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/booking');
  };

  /* guard: no summary data */
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