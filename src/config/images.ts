const BASE = "https://2026readdy.goldennextai.com";

function range(folder: string, prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(3, "0");
    return `${BASE}/${folder}/${prefix}${num}.jpg`;
  });
}

function url(folder: string, filename: string): string {
  return `${BASE}/${folder}/${filename}`;
}

/* ── 1. 首頁 ── */
export const home = {
  hero: [
    /* LCP：首幀請與根目錄 index.html 的 preload href 同步 */
    `${BASE}/01-taipei-homepage-hero-carousel-need-5/taipei-professional-headshot-studio-homepage-hero-003.jpg`,
    `${BASE}/01-taipei-homepage-hero-carousel-need-5/taipei-professional-headshot-studio-homepage-hero-005.jpg`,
    `${BASE}/01-taipei-homepage-hero-carousel-need-5/taipei-professional-headshot-studio-homepage-hero-001.jpg`,
    `${BASE}/01-taipei-homepage-hero-carousel-need-5/taipei-professional-headshot-studio-homepage-hero-002.jpg`,
    `${BASE}/01-taipei-homepage-hero-carousel-need-5/taipei-professional-headshot-studio-homepage-hero-004.jpg`,
  ],
  services: range(
    "02-taipei-homepage-service-cards-need-6",
    "goldenyears-taipei-portrait-service-cards-",
    6,
  ),
  founder: url(
    "06-about-founder-portrait-need-1",
    "goldenyears-founder-story-portrait-taipei-001.jpg",
  ),
  studio: url(
    "courses",
    "1778421866612_goldenyears-photography-workshop-pricing-taipei-003.jpg",
  ),
  makeupHero: url(
    "04-taipei-homepage-makeup-hero-need-1",
    "taipei-studio-hair-makeup-section-hero-001.jpg",
  ),
};

/* ── 2. 關於頁面 ── */
export const about = {
  hero: url(
    "05-about-page-hero-banner-need-2",
    "goldenyears-studio-about-page-hero-banner-001.jpg",
  ),
  banner: "https://static.readdy.ai/image/a59c001a1bbea72997731a60711927db/692ed695728c78c95f37b9ffa5eeafbf.jpeg",
  founder: url(
    "06-about-founder-portrait-need-1",
    "goldenyears-founder-story-portrait-taipei-001.jpg",
  ),
};

/* ── 3. 團隊 ── */
export const team = range(
  "07-about-team-headshots-need-11",
  "goldenyears-taipei-photography-team-headshots-",
  11,
);

/* ── 4. 部落格 ── */
export const blog = {
  hero: url(
    "32-blog-journal-hero-need-1",
    "goldenyears-studio-blog-journal-hero-taipei-001.jpg",
  ),
  covers: [
    `${BASE}/17-portfolio-corporate-group-taipei-need-15/taipei-corporate-team-photography-portfolio-010.jpg`,
    `${BASE}/courses/1778421865758_goldenyears-photography-workshop-pricing-taipei-001.jpg`,
    `${BASE}/personal-portrait-extra/taipei-personal-portrait-photoshoot-007.jpg`,
    `${BASE}/photo-inbox/09-pricing-photography-categories-need-10/goldenyears-taipei-portrait-pricing-categories-005.jpg`,
    `${BASE}/photo-inbox/11-pricing-makeup-packages-need-5/taipei-studio-makeup-hair-pricing-packages-003.jpg`,
    `${BASE}/photo-inbox/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-016.jpg`,
    `${BASE}/studio-interior-bts/goldenyears-taipei-studio-interior-space-001.jpg`,
    `${BASE}/photo-inbox/studio-interior-bts/goldenyears-taipei-studio-interior-space-001.jpg`,
    `${BASE}/09-pricing-photography-categories-need-10/goldenyears-taipei-portrait-pricing-categories-001.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-001.jpg`,
    `${BASE}/22-portfolio-family-taipei-need-15/taipei-family-portrait-photography-portfolio-001.jpg`,
    `${BASE}/02-taipei-homepage-service-cards-need-6/goldenyears-taipei-portrait-service-cards-001.jpg`,
    `${BASE}/18-portfolio-graduation-taipei-need-15/taipei-graduation-portrait-portfolio-studio-001.jpg`,
  ],
};

/* ── 5. 預約 ── */
export const booking = {
  hero: url(
    "34-online-booking-hero-need-1",
    "goldenyears-taipei-online-booking-hero-001.jpg",
  ),
};

/* ── 6. 妝髮 ── */
export const hairMakeup = {
  hero: url(
    "28-hair-makeup-service-plans-need-5",
    "taipei-studio-makeup-service-packages-007.jpg",
  ),
  teacher: url(
    "07-about-team-headshots-need-11",
    "goldenyears-taipei-photography-team-headshots-009.jpg",
  ),
  plans: [
    `${BASE}/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-002.jpg`,
    `${BASE}/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-003.jpg`,
    `${BASE}/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-004.jpg`,
    `${BASE}/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-005.jpg`,
    `${BASE}/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-001.jpg`,
  ],
};

/* ── 7. 裁切工具 ── */
export const photoCrop = {
  hero: url(
    "35-id-photo-crop-hero-need-1",
    "taipei-id-photo-cropping-tool-hero-001.jpg",
  ),
};

/* ── 8. 攝影服務頁面 ── */
export const photography = {
  hero: url(
    "13-photography-service-hero-quote-need-2",
    "taipei-portrait-photography-service-hero-001.jpg",
  ),
  featured: range(
    "14-photography-featured-portfolio-need-15",
    "goldenyears-taipei-featured-portfolio-highlights-",
    15,
  ),
};

/* ── 9. 價目表 ── */
export const pricing = {
  hero: url(
    "08-pricing-page-hero-need-1",
    "taipei-headshot-pricing-page-hero-001.jpg",
  ),
  categories: [
    `${BASE}/09-pricing-photography-categories-need-10/goldenyears-taipei-portrait-pricing-categories-001.jpg`,
    `${BASE}/09-pricing-photography-categories-need-10/goldenyears-taipei-portrait-pricing-categories-002.jpg`,
    `${BASE}/photo-inbox/14-photography-featured-portfolio-need-15/goldenyears-taipei-featured-portfolio-highlights-004.jpg`,
    `${BASE}/09-pricing-photography-categories-need-10/goldenyears-taipei-portrait-pricing-categories-004.jpg`,
    `${BASE}/photo-inbox/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-013.jpg`,
    `${BASE}/02-taipei-homepage-service-cards-need-6/goldenyears-taipei-portrait-service-cards-002.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-010.jpg`,
    `${BASE}/photo-inbox/22-portfolio-family-taipei-need-15/taipei-family-portrait-photography-portfolio-002.jpg`,
    `${BASE}/02-taipei-homepage-service-cards-need-6/taipei-professional-headshot-studio-homepage-hero-001.jpg`,
    `${BASE}/09-pricing-photography-categories-need-10/goldenyears-taipei-portrait-pricing-categories-010.jpg`,
  ],
  idPhoto: range(
    "10-pricing-id-photo-categories-need-2",
    "taipei-id-photo-pricing-korean-passport-",
    2,
  ),
  makeup: [
    `${BASE}/photo-inbox/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-002.jpg`,
    `${BASE}/11-pricing-makeup-packages-need-5/taipei-studio-makeup-hair-pricing-packages-005.jpg`,
    `${BASE}/photo-inbox/personal-portrait-extra/taipei-personal-portrait-photoshoot-012.jpg`,
    `${BASE}/photo-inbox/28-hair-makeup-service-plans-need-5/taipei-studio-makeup-service-packages-005.jpg`,
    `${BASE}/11-pricing-makeup-packages-need-5/taipei-studio-makeup-hair-pricing-packages-004.jpg`,
  ],
  workshop: url(
    "12-pricing-photo-workshop-need-1",
    "goldenyears-photography-workshop-pricing-taipei-001.jpg",
  ),
};

/* ── 10. 攝影作品（12 個分類 × 15 張）── */
export const portfolio = {
  resume: [
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-012.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-013.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-014.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-015.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-008.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-002.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-012.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-016.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-021.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-010.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-011.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-012.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-013.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-014.jpg`,
    `${BASE}/15-portfolio-resume-headshot-taipei-need-15/taipei-resume-headshot-portfolio-job-hunting-015.jpg`,
  ],
  linkedin: [
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-020.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-018.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-015.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-011.jpg`,
    `${BASE}/campaign-portrait-election/taipei-campaign-election-portrait-photo-001.jpg`,
    `${BASE}/campaign-portrait-election/taipei-campaign-election-portrait-photo-004.jpg`,
    `${BASE}/campaign-portrait-election/taipei-campaign-election-portrait-photo-003.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-008.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-009.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-010.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-011.jpg`,
    `${BASE}/16-portfolio-linkedin-corporate-taipei-need-15/taipei-linkedin-corporate-headshot-portfolio-012.jpg`,
  ],
  corporate: range(
    "17-portfolio-corporate-group-taipei-need-15",
    "taipei-corporate-team-photography-portfolio-",
    15,
  ),
  graduation: range(
    "18-portfolio-graduation-taipei-need-15",
    "taipei-graduation-portrait-portfolio-studio-",
    15,
  ),
  doctor: [
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-012.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-009.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-001.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-002.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-005.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-006.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-007.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-008.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-010.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-011.jpg`,
    `${BASE}/19-portfolio-doctor-white-coat-taipei-need-15/taipei-doctor-white-coat-medical-headshot-portfolio-015.jpg`,
  ],
  couple: range(
    "20-portfolio-couple-taipei-need-15",
    "taipei-couple-photoshoot-portfolio-studio-",
    15,
  ),
  friends: range(
    "21-portfolio-friends-taipei-need-15",
    "taipei-friends-group-portrait-portfolio-",
    15,
  ),
  family: range(
    "22-portfolio-family-taipei-need-15",
    "taipei-family-portrait-photography-portfolio-",
    15,
  ),
  maternity: range(
    "23-portfolio-maternity-taipei-need-15",
    "taipei-maternity-photography-portfolio-studio-",
    15,
  ),
  pet: range(
    "24-portfolio-pet-taipei-need-15",
    "taipei-pet-portrait-photography-portfolio-",
    15,
  ),
  idFormal: range(
    "25-portfolio-formal-id-passport-taipei-need-15",
    "taipei-formal-id-passport-photo-portfolio-",
    15,
  ),
  idGraduation: range(
    "26-portfolio-graduation-id-taipei-need-15",
    "taipei-graduation-id-photo-portfolio-",
    15,
  ),
};