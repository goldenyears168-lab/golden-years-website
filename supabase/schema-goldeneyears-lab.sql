-- =============================================================================
-- 好時有影 Golden Years Studio - Schema 建立腳本
-- 目標：goldeneyears168-lab Supabase 專案
-- 來源：好時官網預約（完整複製）
-- 建立順序：Enum > Tables > Triggers > Functions > Indexes > RLS Policies
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. 自訂 Enum 型別
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE IF NOT EXISTS public.session_workflow AS ENUM ('photographer', 'retoucher', 'manager', 'finance', 'closed');

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. 基礎表：staff（無外鍵依賴）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.staff (
    code text NOT NULL PRIMARY KEY,
    display_name text NOT NULL,
    roles text[] NOT NULL DEFAULT '{}',
    is_active boolean NOT NULL DEFAULT true,
    hired_at date,
    left_at date,
    note text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    stage_progress jsonb,
    email text,
    phone text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. 基礎表：bookings（無外鍵依賴）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
    id bigint NOT NULL PRIMARY KEY,
    code text UNIQUE,
    store_name text,
    client_name text,
    client_email text,
    client_phone text,
    job_title text,
    gender text,
    shoot_datetime timestamp without time zone,
    shoot_duration integer,
    shoot_type text,
    extra_id_photo text,
    group_size integer,
    customer_note text,
    referral text,
    purpose text,
    makeup_addon text,
    marketing_duration text,
    status text DEFAULT 'confirmed',
    raw_data jsonb,
    synced_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    import_source text DEFAULT 'system'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. 核心表：shoot_sessions（依賴 staff、bookings）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shoot_sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id bigint,
    code text,
    store_name text,
    client_name text,
    client_email text,
    client_phone text,
    job_title text,
    gender text,
    shoot_datetime timestamp without time zone,
    shoot_duration text,
    shoot_type text,
    extra_id_photo text,
    group_size text,
    customer_note text,
    referral text,
    purpose text,
    makeup_addon text,
    marketing_duration text,
    checked_in_at timestamp with time zone NOT NULL DEFAULT now(),
    id_photo_count integer DEFAULT 0,
    portrait_count integer DEFAULT 0,
    group_count integer DEFAULT 0,
    fee_total integer,
    cash integer DEFAULT 0,
    transfer integer DEFAULT 0,
    blessing_message text DEFAULT '',
    on_site_note text DEFAULT '',
    discount integer DEFAULT 0,
    surcharge integer DEFAULT 0,
    cloud_link text DEFAULT '',
    delivery_deadline timestamp with time zone,
    delivery_days integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    workflow_stage public.session_workflow NOT NULL DEFAULT 'photographer',
    uploaded_at timestamp with time zone,
    delivered_at timestamp with time zone,
    retoucher_note text,
    manager_note text,
    manager_reviewed_at timestamp with time zone,
    manager_confirmed_at timestamp with time zone,
    closed_at timestamp with time zone,
    finance_reviewed_at timestamp with time zone,
    is_student boolean NOT NULL DEFAULT false,
    is_shared boolean NOT NULL DEFAULT false,
    makeup_plan text NOT NULL DEFAULT '',
    full_body_count integer NOT NULL DEFAULT 0,
    extra_person_count integer NOT NULL DEFAULT 0,
    white_bg_count integer NOT NULL DEFAULT 0,
    rush_count integer NOT NULL DEFAULT 0,
    custom_adjustment integer NOT NULL DEFAULT 0,
    custom_note text NOT NULL DEFAULT '',
    finance_note text NOT NULL DEFAULT '',
    people_adjustment integer NOT NULL DEFAULT 0,
    photographer_payout numeric DEFAULT 0,
    assistant_payout numeric DEFAULT 0,
    team_lead_payout numeric DEFAULT 0,
    makeup_payout numeric DEFAULT 0,
    photographer_code text,
    assistant_code text,
    makeup_artist_code text,
    retoucher_code text,
    team_lead_code text,
    import_source text DEFAULT 'system',
    edit_history jsonb DEFAULT '[]',
    retoucher_payout numeric,
    photo_count_total integer DEFAULT 0,
    store_manager_code text,
    store_manager_payout numeric DEFAULT 0,
    group_bonus numeric DEFAULT 0,
    makeup_fee integer DEFAULT 0,
    quarterly_bonus_contribution numeric DEFAULT 0,
    -- 外鍵約束
    FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
    FOREIGN KEY (photographer_code) REFERENCES public.staff(code),
    FOREIGN KEY (assistant_code) REFERENCES public.staff(code),
    FOREIGN KEY (makeup_artist_code) REFERENCES public.staff(code),
    FOREIGN KEY (retoucher_code) REFERENCES public.staff(code),
    FOREIGN KEY (team_lead_code) REFERENCES public.staff(code),
    -- 唯一約束
    UNIQUE (booking_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. staff_shifts（依賴 staff）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.staff_shifts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    biz_date date NOT NULL,
    store_name text NOT NULL,
    shift_role text NOT NULL,
    staff_code text NOT NULL,
    note text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    FOREIGN KEY (staff_code) REFERENCES public.staff(code)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. session_payouts（依賴 shoot_sessions）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_payouts (
    session_id uuid NOT NULL PRIMARY KEY,
    payout_case text,
    photography_pool integer,
    amount_photographer integer,
    amount_assistant integer,
    amount_team_lead integer,
    amount_retoucher integer,
    amount_stylist integer,
    group_bonus_contribution integer,
    photo_fee_base integer,
    source text,
    calc_snapshot jsonb,
    locked_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    FOREIGN KEY (session_id) REFERENCES public.shoot_sessions(id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. survey_responses（依賴 shoot_sessions）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    name text NOT NULL,
    store_location text,
    store_location_other text,
    favorite_moment text,
    nps_score integer,
    improvement_suggestion text,
    desired_products text,
    liked_parts text,
    life_stage text[],
    life_stage_other text,
    activity_interest text[],
    activity_interest_other text,
    brand_feeling text,
    brand_feeling_other text,
    photo_auth text,
    photo_auth_other text,
    future_message text,
    source text DEFAULT 'web',
    created_at timestamp with time zone DEFAULT now(),
    session_id uuid,
    FOREIGN KEY (session_id) REFERENCES public.shoot_sessions(id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. expense_entries（依賴 shoot_sessions）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.expense_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    biz_date date NOT NULL,
    store_name text,
    category text NOT NULL,
    amount integer NOT NULL DEFAULT 0,
    description text,
    session_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    applicant text,
    department text,
    handler text,
    store_usage text,
    invoice_location text,
    invoice_image_url text,
    status text DEFAULT '待確認',
    paid_status text DEFAULT '未撥款',
    finance_note text,
    year_month text,
    items jsonb DEFAULT '[]',
    FOREIGN KEY (session_id) REFERENCES public.shoot_sessions(id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. daily_store_notes（複合主鍵）
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_store_notes (
    biz_date date NOT NULL,
    store_name text NOT NULL,
    note text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (biz_date, store_name)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. stage_checklist_items
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stage_checklist_items (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role text NOT NULL,
    stage text NOT NULL,
    item_name text NOT NULL,
    verifier text,
    note text,
    source_position text,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. staff_checklist_progress
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.staff_checklist_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_code text NOT NULL,
    checklist_item_id uuid NOT NULL,
    completed_at timestamp with time zone,
    verifier text,
    note text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (staff_code, checklist_item_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. access_logs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.access_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_code text NOT NULL,
    staff_name text NOT NULL,
    page text NOT NULL,
    accessed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- =============================================================================
-- 13. 觸發器函數
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_shoot_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 14. 觸發器綁定
-- =============================================================================
DO $$
BEGIN
    -- staff updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'staff_updated_at') THEN
        CREATE TRIGGER staff_updated_at
        BEFORE UPDATE ON public.staff
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- bookings updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'bookings_updated_at') THEN
        CREATE TRIGGER bookings_updated_at
        BEFORE UPDATE ON public.bookings
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- shoot_sessions updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'shoot_sessions_updated_at') THEN
        CREATE TRIGGER shoot_sessions_updated_at
        BEFORE UPDATE ON public.shoot_sessions
        FOR EACH ROW EXECUTE FUNCTION public.set_shoot_sessions_updated_at();
    END IF;

    -- staff_shifts updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'staff_shifts_updated_at') THEN
        CREATE TRIGGER staff_shifts_updated_at
        BEFORE UPDATE ON public.staff_shifts
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- session_payouts updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'session_payouts_updated_at') THEN
        CREATE TRIGGER session_payouts_updated_at
        BEFORE UPDATE ON public.session_payouts
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- survey_responses updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'survey_responses_updated_at') THEN
        CREATE TRIGGER survey_responses_updated_at
        BEFORE UPDATE ON public.survey_responses
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- expense_entries updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'expense_entries_updated_at') THEN
        CREATE TRIGGER expense_entries_updated_at
        BEFORE UPDATE ON public.expense_entries
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- daily_store_notes updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'daily_store_notes_updated_at') THEN
        CREATE TRIGGER daily_store_notes_updated_at
        BEFORE UPDATE ON public.daily_store_notes
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- stage_checklist_items updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'stage_checklist_items_updated_at') THEN
        CREATE TRIGGER stage_checklist_items_updated_at
        BEFORE UPDATE ON public.stage_checklist_items
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;

    -- staff_checklist_progress updated_at
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'staff_checklist_progress_updated_at') THEN
        CREATE TRIGGER staff_checklist_progress_updated_at
        BEFORE UPDATE ON public.staff_checklist_progress
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    END IF;
END $$;

-- =============================================================================
-- 15. 業務邏輯函數
-- =============================================================================

-- 15.1 攝影師登記（check_in_booking）
CREATE OR REPLACE FUNCTION public.check_in_booking(p_booking_id bigint)
RETURNS uuid AS $$
DECLARE
    b public.bookings%ROWTYPE;
    sid uuid;
    v_makeup_plan text;
BEGIN
    SELECT id INTO sid FROM public.shoot_sessions WHERE booking_id = p_booking_id;
    IF FOUND THEN
        RETURN sid;
    END IF;

    SELECT * INTO b FROM public.bookings WHERE id = p_booking_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到預約 (id=%)', p_booking_id;
    END IF;
    IF COALESCE(b.status, '') = 'cancelled' THEN
        RAISE EXCEPTION '此預約已取消';
    END IF;

    v_makeup_plan := CASE
        WHEN COALESCE(b.makeup_addon, '') = '' OR b.makeup_addon IN ('無', '不含') THEN ''
        WHEN b.makeup_addon ILIKE '%訂製%' THEN '訂製妝髮女'
        WHEN b.makeup_addon ILIKE '%精緻%' AND
             COALESCE(b.gender, '') ILIKE ANY (ARRAY['%男%', '%Male%', '%male%', '%M%'])
             THEN '精緻妝髮男'
        WHEN b.makeup_addon ILIKE '%精緻%' THEN '精緻妝髮女'
        WHEN b.makeup_addon ILIKE '%基礎%' AND
             COALESCE(b.gender, '') ILIKE ANY (ARRAY['%男%', '%Male%', '%male%', '%M%'])
             THEN '基礎日常妝男'
        WHEN b.makeup_addon ILIKE '%基礎%' THEN '基礎日常妝女'
        ELSE ''
    END;

    INSERT INTO public.shoot_sessions (
        booking_id,
        code,
        store_name,
        client_name,
        client_email,
        client_phone,
        job_title,
        gender,
        shoot_datetime,
        shoot_duration,
        shoot_type,
        extra_id_photo,
        group_size,
        customer_note,
        referral,
        purpose,
        makeup_addon,
        makeup_plan,
        marketing_duration,
        workflow_stage,
        checked_in_at,
        import_source,
        delivery_deadline
    ) VALUES (
        b.id,
        b.code,
        b.store_name,
        b.client_name,
        b.client_email,
        b.client_phone,
        b.job_title,
        b.gender,
        b.shoot_datetime,
        CASE WHEN b.shoot_duration IS NULL THEN NULL ELSE b.shoot_duration::text END,
        b.shoot_type,
        b.extra_id_photo,
        CASE WHEN b.group_size IS NULL THEN NULL ELSE b.group_size::text END,
        b.customer_note,
        b.referral,
        b.purpose,
        b.makeup_addon,
        v_makeup_plan,
        b.marketing_duration,
        'photographer',
        now(),
        COALESCE(b.import_source, 'system'),
        (b.shoot_datetime AT TIME ZONE 'Asia/Taipei')::date + interval '4 days'
    )
    RETURNING id INTO sid;

    RETURN sid;
END;
$$ LANGUAGE plpgsql;

-- 15.6 工作流：攝影師上傳 -> 修圖師
CREATE OR REPLACE FUNCTION public.mark_session_uploaded(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'photographer' THEN
        RAISE EXCEPTION '僅「攝影師紀錄表」可送至修圖師 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'retoucher', uploaded_at = now(), updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.7 工作流：修圖師交件 -> 店長
CREATE OR REPLACE FUNCTION public.mark_session_delivered(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'retoucher' THEN
        RAISE EXCEPTION '僅「修圖師紀錄表」可標記客人已交件 (目前=%)', s.workflow_stage;
    END IF;
    IF COALESCE(trim(s.cloud_link), '') = '' THEN
        RAISE EXCEPTION '請先填寫雲端連結';
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'manager', delivered_at = now(), manager_reviewed_at = now(), updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.8 工作流：店長確認 -> 財務
CREATE OR REPLACE FUNCTION public.mark_session_manager_confirmed(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'manager' THEN
        RAISE EXCEPTION '僅「店長審核表」可送財務結算 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'finance', manager_confirmed_at = now(), updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.9 工作流：財務結案 -> 已結案
CREATE OR REPLACE FUNCTION public.mark_session_closed(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'finance' THEN
        RAISE EXCEPTION '僅「財務結算表」可確認結案 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'closed', finance_reviewed_at = now(), closed_at = now(), updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.10 工作流：退回財務 <- 已結案
CREATE OR REPLACE FUNCTION public.revert_session_to_finance(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'closed' THEN
        RAISE EXCEPTION '僅「已結案表」可退回財務結算 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'finance', closed_at = NULL, finance_reviewed_at = NULL, updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.11 工作流：退回店長 <- 財務
CREATE OR REPLACE FUNCTION public.revert_session_to_manager(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'finance' THEN
        RAISE EXCEPTION '僅「財務結算表」可退回店長 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'manager', manager_confirmed_at = NULL, finance_reviewed_at = NULL, updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.12 工作流：退回修圖師 <- 店長
CREATE OR REPLACE FUNCTION public.revert_session_to_uploaded(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'manager' THEN
        RAISE EXCEPTION '僅「店長審核表」可退回修圖師 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'retoucher', delivered_at = NULL, manager_reviewed_at = NULL, manager_confirmed_at = NULL, updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.13 工作流：退回攝影師 <- 修圖師
CREATE OR REPLACE FUNCTION public.revert_session_to_registered(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    IF s.workflow_stage <> 'retoucher' THEN
        RAISE EXCEPTION '僅「修圖師紀錄表」可退回攝影師 (目前=%)', s.workflow_stage;
    END IF;
    UPDATE public.shoot_sessions SET workflow_stage = 'photographer', uploaded_at = NULL, delivered_at = NULL, manager_reviewed_at = NULL, updated_at = now() WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.14 刪除 session
CREATE OR REPLACE FUNCTION public.delete_session(p_session_id uuid)
RETURNS void AS $$
DECLARE
    s public.shoot_sessions%ROWTYPE;
BEGIN
    SELECT * INTO s FROM public.shoot_sessions WHERE id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到 session (id=%)', p_session_id;
    END IF;
    DELETE FROM public.shoot_sessions WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 15.15 Dashboard 統計
CREATE OR REPLACE FUNCTION public.get_dashboard_summary(p_today text)
RETURNS jsonb AS $$
  SELECT jsonb_build_object(
    'totalSessions', (SELECT count(*)::int FROM public.shoot_sessions),
    'totalRevenue', COALESCE((SELECT sum(fee_total)::int FROM public.shoot_sessions), 0),
    'todayShootCount', COALESCE((SELECT count(*)::int FROM public.shoot_sessions WHERE shoot_datetime >= p_today::date AND shoot_datetime < (p_today::date + interval '1 day')), 0),
    'todayRevenue', COALESCE((SELECT sum(fee_total)::int FROM public.shoot_sessions WHERE shoot_datetime >= p_today::date AND shoot_datetime < (p_today::date + interval '1 day')), 0),
    'pendingRetouch', (SELECT count(*)::int FROM public.shoot_sessions WHERE workflow_stage = 'retoucher'),
    'pendingManager', (SELECT count(*)::int FROM public.shoot_sessions WHERE workflow_stage = 'manager'),
    'pendingFinance', (SELECT count(*)::int FROM public.shoot_sessions WHERE workflow_stage = 'finance'),
    'closedThisMonth', (SELECT count(*)::int FROM public.shoot_sessions WHERE workflow_stage = 'closed' AND closed_at >= date_trunc('month', p_today::date)),
    'stageStats', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'stage', workflow_stage,
        'count', cnt::int,
        'revenue', rev::int,
        'avgFee', CASE WHEN cnt > 0 THEN round(rev / cnt) ELSE 0 END
      ) ORDER BY workflow_stage)
      FROM (
        SELECT workflow_stage, count(*) as cnt, COALESCE(sum(fee_total), 0) as rev
        FROM public.shoot_sessions
        GROUP BY workflow_stage
      ) sub
    ), '[]'::jsonb)
  );
$$ LANGUAGE sql;

-- 15.16 店鋪分布統計
CREATE OR REPLACE FUNCTION public.get_store_distribution()
RETURNS TABLE(store_name text, count bigint, revenue bigint) AS $$
  SELECT COALESCE(s.store_name, '未指定') as store_name, count(*) as count, COALESCE(sum(s.fee_total), 0)::bigint as revenue
  FROM public.shoot_sessions s
  GROUP BY s.store_name
  ORDER BY revenue DESC;
$$ LANGUAGE sql;

-- 15.17 每日拍攝統計
CREATE OR REPLACE FUNCTION public.get_daily_shoots(p_from text, p_to text)
RETURNS TABLE(date text, count bigint, revenue bigint) AS $$
  SELECT to_char(s.shoot_datetime, 'YYYY-MM-DD') as date, count(*) as count, COALESCE(sum(s.fee_total), 0)::bigint as revenue
  FROM public.shoot_sessions s
  WHERE s.shoot_datetime >= p_from::date AND s.shoot_datetime < (p_to::date + interval '1 day')
  GROUP BY to_char(s.shoot_datetime, 'YYYY-MM-DD')
  ORDER BY date ASC;
$$ LANGUAGE sql;

-- =============================================================================
-- 16. 索引
-- =============================================================================

-- bookings 索引
CREATE INDEX IF NOT EXISTS bookings_store_name_idx ON public.bookings USING btree (store_name);
CREATE INDEX IF NOT EXISTS bookings_shoot_datetime_idx ON public.bookings USING btree (shoot_datetime);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_code_unique ON public.bookings USING btree (code) WHERE ((code IS NOT NULL) AND (code <> ''::text));

-- shoot_sessions 索引
CREATE INDEX IF NOT EXISTS shoot_sessions_shoot_datetime_idx ON public.shoot_sessions USING btree (shoot_datetime);
CREATE INDEX IF NOT EXISTS shoot_sessions_checked_in_at_idx ON public.shoot_sessions USING btree (checked_in_at);
CREATE INDEX IF NOT EXISTS shoot_sessions_workflow_shoot_idx ON public.shoot_sessions USING btree (workflow_stage, shoot_datetime);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_photographer_code ON public.shoot_sessions USING btree (photographer_code);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_workflow_stage ON public.shoot_sessions USING btree (workflow_stage);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_store_name ON public.shoot_sessions USING btree (store_name);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_client_name ON public.shoot_sessions USING btree (client_name);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_client_phone ON public.shoot_sessions USING btree (client_phone);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_shoot_type ON public.shoot_sessions USING btree (shoot_type);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_code ON public.shoot_sessions USING btree (code);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_store_datetime ON public.shoot_sessions USING btree (store_name, shoot_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_shoot_sessions_workflow_store ON public.shoot_sessions USING btree (workflow_stage, store_name);

-- staff_shifts 索引
CREATE INDEX IF NOT EXISTS idx_staff_shifts_staff_code ON public.staff_shifts USING btree (staff_code);
CREATE INDEX IF NOT EXISTS idx_staff_shifts_biz_date_store ON public.staff_shifts USING btree (biz_date, store_name);

-- survey_responses 索引
CREATE INDEX IF NOT EXISTS idx_survey_email ON public.survey_responses USING btree (email);
CREATE INDEX IF NOT EXISTS idx_survey_created_at ON public.survey_responses USING btree (created_at DESC);

-- access_logs 索引
CREATE INDEX IF NOT EXISTS idx_access_logs_accessed_at ON public.access_logs USING btree (accessed_at DESC);

-- =============================================================================
-- 17. 啟用 RLS
-- =============================================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_store_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 18. RLS 策略
-- =============================================================================

-- bookings
CREATE POLICY IF NOT EXISTS bookings_select ON public.bookings FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS bookings_update ON public.bookings FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS bookings_insert ON public.bookings FOR INSERT TO service_role WITH CHECK (true);

-- shoot_sessions
CREATE POLICY IF NOT EXISTS shoot_sessions_select_anon ON public.shoot_sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS shoot_sessions_insert_anon ON public.shoot_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS shoot_sessions_update_anon ON public.shoot_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- staff
CREATE POLICY IF NOT EXISTS staff_allow_all ON public.staff FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS staff_allow_all_anon ON public.staff FOR ALL TO anon USING (true) WITH CHECK (true);

-- staff_shifts
CREATE POLICY IF NOT EXISTS staff_shifts_allow_all ON public.staff_shifts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS staff_shifts_allow_all_anon ON public.staff_shifts FOR ALL TO anon USING (true) WITH CHECK (true);

-- daily_store_notes
CREATE POLICY IF NOT EXISTS daily_store_notes_allow_all ON public.daily_store_notes FOR ALL TO public USING (true) WITH CHECK (true);

-- session_payouts
CREATE POLICY IF NOT EXISTS session_payouts_allow_all ON public.session_payouts FOR ALL TO public USING (true) WITH CHECK (true);

-- expense_entries
CREATE POLICY IF NOT EXISTS expense_entries_allow_all ON public.expense_entries FOR ALL TO public USING (true) WITH CHECK (true);

-- survey_responses
CREATE POLICY IF NOT EXISTS survey_insert_anon ON public.survey_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS survey_select_auth ON public.survey_responses FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS survey_select_anon ON public.survey_responses FOR SELECT TO anon USING (true);

-- stage_checklist_items
CREATE POLICY IF NOT EXISTS auth_read_checklist ON public.stage_checklist_items FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS auth_insert_checklist ON public.stage_checklist_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS auth_update_checklist ON public.stage_checklist_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS auth_delete_checklist ON public.stage_checklist_items FOR DELETE TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS anon_read_checklist ON public.stage_checklist_items FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS anon_insert_checklist ON public.stage_checklist_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS anon_update_checklist ON public.stage_checklist_items FOR UPDATE TO anon USING (true);
CREATE POLICY IF NOT EXISTS anon_delete_checklist ON public.stage_checklist_items FOR DELETE TO anon USING (true);

-- staff_checklist_progress
CREATE POLICY IF NOT EXISTS anon_read_progress ON public.staff_checklist_progress FOR SELECT TO public USING (true);
CREATE POLICY IF NOT EXISTS auth_read_progress ON public.staff_checklist_progress FOR SELECT TO public USING (true);
CREATE POLICY IF NOT EXISTS anon_insert_progress ON public.staff_checklist_progress FOR INSERT TO public WITH CHECK (true);
CREATE POLICY IF NOT EXISTS auth_insert_progress ON public.staff_checklist_progress FOR INSERT TO public WITH CHECK (true);
CREATE POLICY IF NOT EXISTS anon_update_progress ON public.staff_checklist_progress FOR UPDATE TO public USING (true);
CREATE POLICY IF NOT EXISTS auth_update_progress ON public.staff_checklist_progress FOR UPDATE TO public USING (true);
CREATE POLICY IF NOT EXISTS anon_delete_progress ON public.staff_checklist_progress FOR DELETE TO public USING (true);
CREATE POLICY IF NOT EXISTS auth_delete_progress ON public.staff_checklist_progress FOR DELETE TO public USING (true);

-- access_logs
CREATE POLICY IF NOT EXISTS allow_public_insert ON public.access_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS allow_public_select ON public.access_logs FOR SELECT TO anon, authenticated USING (true);

-- =============================================================================
-- 19. 延伸設定（依據 Supabase 專案特性）
-- =============================================================================

-- 發布 schema（確保 public 權限正確）
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- 授予所有現有表的權限
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 授予序列權限（給自增欄位用）
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =============================================================================
-- 完成！
-- =============================================================================