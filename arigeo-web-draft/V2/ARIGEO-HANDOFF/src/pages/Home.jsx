import Hero from '@/components/Hero';
import ContentSplit from '@/components/ContentSplit';
import ValueProps from '@/components/ValueProps';
import NewsStories from '@/components/NewsStories';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <ContentSplit />
      <ValueProps />
      <NewsStories />
      <Newsletter />
    </>
  );
}