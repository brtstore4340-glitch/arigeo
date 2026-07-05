import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Our Work - MARCUZ',
  description: 'See how we transformed our clients\' businesses.',
};

export default function Work() {
  const caseStudies = [
    {
      name: 'ORRY Thailand',
      industry: 'E-commerce & Beauty',
      headline: 'Transforming E-commerce Operations',
      results: ['40% reduction in processing time', '60% inventory improvement', '3x faster response']
    },
    {
      name: 'Arigeo',
      industry: 'Geographic Data',
      headline: 'Building Intelligent Analytics',
      results: ['80% reduction in reporting time', 'Real-time visibility', 'Better decisions']
    },
    {
      name: 'Cation Maid',
      industry: 'Cleaning Services',
      headline: 'Scaling Operations Nationwide',
      results: ['50% scheduling efficiency', 'Reduced overhead', 'Rapid expansion enabled']
    }
  ];

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1>Our Work</h1>
        <p>Case studies of successful transformations</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {caseStudies.map((study) => (
            <div key={study.name} style={{ padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h2>{study.name}</h2>
              <p style={{ color: '#666' }}>{study.industry}</p>
              <h3>{study.headline}</h3>
              <ul>
                {study.results.map((result, idx) => (
                  <li key={idx}>{result}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
