import { Layout } from '@/components/layout/Layout';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

const SafetyPage = () => {
  const { settings, getWhatsAppLink } = useSiteSettingsContext();

  // If custom safety content exists, render it
  if (settings.safety_content) {
    return (
      <Layout>
        <div className="gradient-warm py-12">
          <div className="container">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Babywearing Safety Tips</h1>
          </div>
        </div>
        <div className="container py-12 max-w-3xl">
          <div 
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: settings.safety_content }}
          />
        </div>
      </Layout>
    );
  }

  const ticks = [
    { letter: 'T', title: 'Tight', desc: 'Carrier should be snug so baby is held close' },
    { letter: 'I', title: 'In view at all times', desc: "Baby's face should be visible at a glance" },
    { letter: 'C', title: 'Close enough to kiss', desc: "Baby's head should be as close to your chin as possible" },
    { letter: 'K', title: 'Keep chin off chest', desc: "Baby should have at least a finger's width under chin" },
    { letter: 'S', title: 'Supported back', desc: "Baby's back should be supported in natural position" },
  ];

  return (
    <Layout>
      <div className="gradient-warm py-12">
        <div className="container">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Babywearing Safety Tips</h1>
        </div>
      </div>
      <div className="container py-12 max-w-3xl">
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-6">The T.I.C.K.S. Checklist</h2>
          <div className="space-y-4">
            {ticks.map((item) => (
              <div key={item.letter} className="flex items-start gap-4 p-4 bg-accent/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-serif text-xl font-bold">{item.letter}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4">M-Shape Positioning</h2>
          <p className="text-muted-foreground mb-4">
            Baby's legs should form an "M" shape with knees higher than bottom. This supports healthy hip development and is the recommended position by pediatric orthopedists.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-muted-foreground">
            We offer free fit checks via WhatsApp video call! Don't hesitate to{' '}
            <a 
              href={getWhatsAppLink('Hi! I need help with my carrier fit.')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              reach out
            </a>{' '}
            if you need help adjusting your carrier for optimal comfort and safety.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default SafetyPage;
