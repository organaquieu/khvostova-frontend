import Image from "next/image";
import { Button } from "@/components/ui/button";
import AboutBrand from '@/components/shared/aboutbrand';
import ProductCatalog from '@/components/shared/productcatalog';
import Footer from '@/components/shared/footer'
import TestConnection from './test-connection';





export default function Home() {
  return (
    <main>
      <AboutBrand />
      <section id="catalog-section" className="scroll-mt-20">
        <ProductCatalog />
      </section>
      <TestConnection />
      <Footer />
      {/* Другие секции вашей главной страницы */}
    </main>
  );
}
