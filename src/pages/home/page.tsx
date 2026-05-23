import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import HeroSection from "./components/HeroSection";
import PortfolioSection from "./components/PortfolioSection";
import MakeupServicesHome from "./components/MakeupServicesHome";
import BrandStory from "./components/BrandStory";
import TrustSection from "./components/TrustSection";
import CoursesCTA from "./components/CoursesCTA";
import CtaSection from "./components/CtaSection";

export default function Home() {
  return (
    <>
      <PageSEO
        title="好時有影 Golden Years Studio | 台北專業形象照攝影 | 韓式證件照、履歷照、白袍照、畢業寫真"
        description="好時有影 — 台北專業形象照攝影工作室。提供韓式證件照、履歷照、白袍照、畢業寫真、全家福、婚紗攝影等服務。專業妝髮造型與精修圖交付，為頂尖學府與百大企業打造最佳形象。立即線上預約！"
        keywords="台北形象照,韓式證件照,畢業寫真,全家福,婚紗攝影,台北攝影工作室,履歷照,白袍照,職涯形象照,台北證件照"
      />
      <Header />
      <main>
        <HeroSection />
        <PortfolioSection />
        <MakeupServicesHome />
        <BrandStory />
        <TrustSection />
        <CoursesCTA />
        <CtaSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}