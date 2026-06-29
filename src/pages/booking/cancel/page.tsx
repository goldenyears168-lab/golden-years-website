import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import FloatingButtons from '@/components/feature/FloatingButtons';
import PageSEO from '@/components/base/PageSEO';
import {
  cancelBookingByToken,
  fetchBookingByToken,
  formatTime,
  weekdayLabel,
  type WebsiteBookingPreview,
} from '../api';
import { LINE_OFFICIAL_URL } from '../config';

type PageState = 'loading' | 'ready' | 'cancelled' | 'error';

export default function BookingCancelPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('loading');
  const [booking, setBooking] = useState<WebsiteBookingPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setState('error');
      setError('連結無效');
      return;
    }

    setState('loading');
    setError(null);

    try {
      const data = await fetchBookingByToken(token);
      setBooking(data);
      if (String(data.status ?? '').toLowerCase().includes('cancel')) {
        setState('cancelled');
      } else {
        setState('ready');
      }
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : '無法載入預約資料');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCancel = async () => {
    if (!token || !booking?.can_cancel) return;

    const ok = window.confirm('確定要取消這筆預約嗎？取消後時段將釋出，如需改期請重新預約。');
    if (!ok) return;

    setSubmitting(true);
    setError(null);

    try {
      const data = await cancelBookingByToken(token);
      setBooking(data);
      setState('cancelled');
    } catch (e) {
      setError(e instanceof Error ? e.message : '取消失敗，請稍後再試或私訊官方 LINE');
    } finally {
      setSubmitting(false);
    }
  };

  const shootDt = booking?.shoot_datetime ?? '';
  const [datePart, timePart] = shootDt.includes(' ') ? shootDt.split(' ') : [shootDt, ''];
  const timeFormatted = timePart ? formatTime(timePart) : '';

  return (
    <>
      <PageSEO
        title="取消預約 | 好時有影 Golden Years Studio"
        description="取消您的預約時段"
      />
      <Header />
      <main className="bg-brand-cream py-12 md:py-20 px-4">
        <div className="max-w-xl mx-auto animate-step-enter">
          <div className="text-center bg-white border border-brand-creamDark rounded-lg p-5 md:p-8 shadow-sm">
            {state === 'loading' && (
              <p className="text-brand-textMuted text-sm">載入預約資料中…</p>
            )}

            {state === 'error' && (
              <>
                <h2 className="text-xl font-semibold text-brand-navy mb-2">無法開啟此連結</h2>
                <p className="text-sm text-brand-textMuted mb-6">{error ?? '連結可能已失效'}</p>
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-brand-navy text-white text-base font-semibold"
                >
                  前往預約
                </Link>
              </>
            )}

            {(state === 'ready' || state === 'cancelled') && booking && (
              <>
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-full text-2xl font-bold leading-[56px] ${
                    state === 'cancelled'
                      ? 'bg-brand-cream text-brand-navy'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                  aria-hidden
                >
                  {state === 'cancelled' ? '✓' : '!'}
                </div>

                <h2 className="text-xl font-semibold text-brand-navy mb-2">
                  {state === 'cancelled' ? '預約已取消' : '取消預約'}
                </h2>

                <p className="text-sm text-brand-textMuted mb-5 leading-relaxed">
                  {state === 'cancelled'
                    ? '我們已收到您的取消，該時段已釋出。如需改期，請重新預約。'
                    : '請確認以下預約資訊。取消後如需改期，請重新選擇時段。'}
                </p>

                <ul className="list-none p-0 m-0 mb-5 text-brand-textMuted text-sm leading-relaxed space-y-1 text-left">
                  <li>
                    預約代碼：
                    <strong className="text-brand-navy ml-1">{booking.code}</strong>
                  </li>
                  <li>
                    {booking.shoot_type}
                    {booking.makeup_plan
                      ? ` · ${booking.makeup_plan}`
                      : ''}
                  </li>
                  <li>{booking.store_name}</li>
                  {datePart && (
                    <li>
                      {datePart} {weekdayLabel(datePart)} {timeFormatted}
                    </li>
                  )}
                </ul>

                {state === 'ready' && !booking.can_cancel && booking.cancel_block_reason && (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-left">
                    {booking.cancel_block_reason}
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-left">
                    {error}
                  </p>
                )}

                {state === 'ready' && booking.can_cancel && (
                  <>
                    <p className="text-xs text-brand-textMuted mb-4">
                      請最晚於拍攝前一天取消。
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleCancel()}
                      disabled={submitting}
                      className="w-full px-5 py-3 mb-3 rounded-full bg-brand-navy text-white text-base font-semibold disabled:opacity-60"
                    >
                      {submitting ? '取消中…' : '確認取消預約'}
                    </button>
                  </>
                )}

                {state === 'cancelled' ? (
                  <button
                    type="button"
                    onClick={() => navigate('/booking')}
                    className="w-full px-5 py-3 rounded-full bg-brand-navy text-white text-base font-semibold"
                  >
                    重新預約
                  </button>
                ) : (
                  <a
                    href={LINE_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-brand-creamDark text-brand-navy text-base font-semibold"
                  >
                    私訊官方 LINE
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
