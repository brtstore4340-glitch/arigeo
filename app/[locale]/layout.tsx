import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
