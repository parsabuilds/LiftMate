import { useAuthContext } from '../contexts/AuthContext';

const stats = [
  { value: '10K+', label: 'Active Lifters' },
  { value: '1.2M', label: 'Workouts Logged' },
  { value: '50K+', label: 'PRs Smashed' },
  { value: '4.9', label: 'App Rating', icon: 'fa-star' },
];

const features = [
  {
    icon: 'fa-dumbbell',
    title: 'Smart Workout Logging',
    description:
      'Log sets, reps, and weight in seconds. Built-in rest timers and exercise history keep you focused on what matters — the next set.',
  },
  {
    icon: 'fa-chart-line',
    title: 'Progress Analytics',
    description:
      'Visualize your strength gains with detailed charts. Track volume, PRs, and trends across every exercise over weeks and months.',
  },
  {
    icon: 'fa-bullseye',
    title: 'Goal Tracking',
    description:
      'Set strength targets and watch your progress rings fill up. Milestone badges and streaks keep you accountable and motivated.',
  },
  {
    icon: 'fa-calendar-check',
    title: 'Routine Management',
    description:
      'Choose from proven routines like PPL, Upper/Lower, and Full Body — or build your own. Your schedule, your way.',
  },
  {
    icon: 'fa-bolt',
    title: 'Progressive Overload',
    description:
      'Automatic suggestions for your next session based on past performance. Never guess your working weight again.',
  },
  {
    icon: 'fa-mobile-screen',
    title: 'Works Offline',
    description:
      'No signal in the gym basement? No problem. LiftMate is a PWA that works offline and syncs when you reconnect.',
  },
];

const testimonials = [
  {
    name: 'Marcus T.',
    role: 'Powerlifter, 2 years',
    avatar: 'M',
    quote:
      "I've tried every tracking app out there. LiftMate is the first one that actually feels like it was built by someone who lifts. The progressive overload suggestions alone are worth it.",
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'CrossFit Athlete',
    avatar: 'S',
    quote:
      'The analytics page is incredible. Being able to see my strength curve over months keeps me pushing. Hit a 100kg deadlift PR last week thanks to staying consistent.',
    rating: 5,
  },
  {
    name: 'James R.',
    role: 'Beginner Lifter',
    avatar: 'J',
    quote:
      "As someone new to the gym, the built-in routines and exercise guides gave me the confidence to start. Six months in and I haven't missed a session.",
    rating: 5,
  },
];

const howItWorks = [
  {
    step: '01',
    icon: 'fa-user-plus',
    title: 'Sign Up in Seconds',
    description: 'One-tap Google sign-in. No forms, no friction. You\'re in the gym to lift, not to fill out paperwork.',
  },
  {
    step: '02',
    icon: 'fa-list-check',
    title: 'Pick Your Routine',
    description: 'Choose a proven program or create a custom split. LiftMate loads your exercises for each training day automatically.',
  },
  {
    step: '03',
    icon: 'fa-pen-to-square',
    title: 'Log Your Lifts',
    description: 'Tap through your sets as you train. Weight, reps, and RPE — all captured in a clean interface built for sweaty hands.',
  },
  {
    step: '04',
    icon: 'fa-rocket',
    title: 'Watch Yourself Grow',
    description: 'Check your analytics dashboard to see PRs, volume trends, and streak milestones. Real data that drives real progress.',
  },
];

const faqs = [
  {
    q: 'Is LiftMate really free?',
    a: 'Yes. LiftMate is completely free to use. Track unlimited workouts, access all analytics features, and set as many goals as you want — no paywall, no premium tier.',
  },
  {
    q: 'Does it work without internet?',
    a: 'Absolutely. LiftMate is a Progressive Web App (PWA) that works fully offline. Your data syncs automatically when you reconnect to the internet.',
  },
  {
    q: 'What routines are included?',
    a: 'LiftMate comes with popular programs including Push/Pull/Legs (PPL), Upper/Lower splits, and Full Body routines. You can also build completely custom routines from scratch.',
  },
  {
    q: 'Can I use it on iPhone and Android?',
    a: 'Yes. LiftMate runs in your browser and can be installed as an app on any device — iPhone, Android, tablet, or desktop. No app store download required.',
  },
  {
    q: 'How is my data stored?',
    a: 'Your workout data is securely stored in Google Firebase with real-time sync across all your devices. Sign in with Google keeps your account secure with industry-standard authentication.',
  },
];

export function Landing() {
  const { signIn } = useAuthContext();

  return (
    <div className="min-h-screen bg-bg text-text font-['Inter',sans-serif] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-white/5" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-dumbbell text-primary text-sm"></i>
            </div>
            <span className="text-lg font-bold tracking-tight">LiftMate</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-text transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-text transition-colors">FAQ</a>
          </div>
          <button
            onClick={signIn}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6" style={{ paddingTop: 'calc(8rem + env(safe-area-inset-top))' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px]"></div>
          <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-8">
              <i className="fa-solid fa-fire text-xs"></i>
              Free forever. No credit card required.
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Track Lifts.<br />
              <span className="text-primary">Break Records.</span><br />
              Get Stronger.
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-xl mx-auto mb-10 leading-relaxed">
              The workout tracker built for lifters who care about progress.
              Log your sets, visualize your gains, and never miss a PR again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={signIn}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-dumbbell"></i>
                Start Tracking — It's Free
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto border border-border hover:border-muted text-muted hover:text-text font-semibold px-8 py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-3"
              >
                See Features
                <i className="fa-solid fa-arrow-down text-sm"></i>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 md:mt-24 relative">
            <div className="absolute -inset-4 bg-gradient-to-t from-bg via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10">
              <img
                src="/images/landing/hero.jpg"
                alt="Athlete performing a deadlift in a modern gym with dramatic blue lighting"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 border-y border-white/5 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-text flex items-center justify-center gap-2">
                  {stat.value}
                  {stat.icon && <i className={`fa-solid ${stat.icon} text-yellow-400 text-xl`}></i>}
                </div>
                <div className="text-sm text-muted mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase — Dashboard */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
                <i className="fa-solid fa-mobile-screen"></i>
                Your Daily Dashboard
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
                Every session,<br />planned and ready
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                Open LiftMate and your today's workout is already loaded. Check off exercises as you go,
                track rest periods, and log your sets — all from one clean screen that's built for the gym floor.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: 'fa-check-circle', text: 'Auto-loaded daily routine based on your program' },
                  { icon: 'fa-check-circle', text: 'Tap-to-complete exercise checklist' },
                  { icon: 'fa-check-circle', text: 'Set-by-set weight and rep logging' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-muted">
                    <i className={`fa-solid ${item.icon} text-success mt-1`}></i>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px]"></div>
              <img
                src="/images/landing/mockup-dashboard.svg"
                alt="LiftMate workout tracking dashboard showing today's Push Day routine with exercise checklist and progress bar"
                className="relative w-72 md:w-80 rounded-3xl shadow-2xl shadow-black/50 border border-white/10"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-32 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
              <i className="fa-solid fa-grid-2"></i>
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to level up
            </h2>
            <p className="text-muted text-lg">
              No bloat. No gimmicks. Just the tools serious lifters actually use, designed to help you get stronger every session.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card/60 border border-white/5 rounded-2xl p-7 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <i className={`fa-solid ${feature.icon} text-primary text-lg`}></i>
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Showcase */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1 relative flex justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px]"></div>
              <img
                src="/images/landing/mockup-analytics.svg"
                alt="LiftMate analytics page showing strength progress charts, weekly volume graphs, and performance stats"
                className="relative w-72 md:w-80 rounded-3xl shadow-2xl shadow-black/50 border border-white/10"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
                <i className="fa-solid fa-chart-line"></i>
                Analytics
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
                See your gains<br />in real numbers
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                Charts that actually mean something. Track your estimated 1RM, total weekly volume,
                exercise frequency, and personal records over time. Know exactly where you're progressing — and where to push harder.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: 'fa-check-circle', text: 'Strength curves for every exercise' },
                  { icon: 'fa-check-circle', text: 'Weekly and monthly volume trends' },
                  { icon: 'fa-check-circle', text: 'Personal record tracking with history' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-muted">
                    <i className={`fa-solid ${item.icon} text-success mt-1`}></i>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Break Image */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src="/images/landing/lifestyle.jpg"
            alt="Person checking their LiftMate app between sets at the gym"
            className="w-full h-64 md:h-96 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/50 to-transparent flex items-center">
            <div className="px-8 md:px-16 max-w-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Built for the gym floor</h3>
              <p className="text-muted text-sm md:text-base">
                Minimal taps. Maximum clarity. LiftMate's interface is designed to be used between sets — with sweaty hands and a racing heart rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
              <i className="fa-solid fa-route"></i>
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              From sign-up to PR in four steps
            </h2>
            <p className="text-muted text-lg">
              No setup marathon. No configuration hell. Start tracking your first workout in under a minute.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
                )}
                <div className="text-5xl font-black text-white/5 mb-4">{step.step}</div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <i className={`fa-solid ${step.icon} text-primary text-lg`}></i>
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Showcase */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
                <i className="fa-solid fa-bullseye"></i>
                Goals & Milestones
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
                Set targets.<br />Crush them. Repeat.
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                Whether it's a 2-plate bench, a 30-day streak, or hitting the gym 4x a week —
                LiftMate turns your ambitions into trackable goals with visual progress and celebrations when you hit them.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: 'fa-trophy', color: 'text-yellow-400', text: 'Achievement badges for major milestones' },
                  { icon: 'fa-fire', color: 'text-orange-400', text: 'Streak tracking to build consistency' },
                  { icon: 'fa-circle-check', color: 'text-success', text: 'Visual progress rings for every goal' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-muted">
                    <i className={`fa-solid ${item.icon} ${item.color} mt-1`}></i>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-success/5 rounded-full blur-[80px]"></div>
              <img
                src="/images/landing/mockup-goals.svg"
                alt="LiftMate goal tracking interface with progress rings, achievement badges, and milestone cards"
                className="relative w-72 md:w-80 rounded-3xl shadow-2xl shadow-black/50 border border-white/10"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
              <i className="fa-solid fa-quote-left"></i>
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Lifters love LiftMate
            </h2>
            <p className="text-muted text-lg">
              Don't take our word for it. Here's what the community has to say.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-card/60 border border-white/5 rounded-2xl p-7"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-yellow-400 text-sm"></i>
                  ))}
                </div>
                <p className="text-text/90 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-muted text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flat-lay Image Break */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src="/images/landing/flatlay.jpg"
            alt="Flat-lay arrangement of gym essentials with blue-tinted lighting"
            className="w-full h-48 md:h-72 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent flex items-end">
            <div className="px-8 pb-8 flex flex-wrap gap-6 text-sm text-text/80">
              <span className="flex items-center gap-2"><i className="fa-solid fa-bolt text-primary"></i> Instant Setup</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-wifi-slash text-primary"></i> Works Offline</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-lock text-primary"></i> Secure Data</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-dollar-sign text-primary"></i> 100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
              <i className="fa-solid fa-circle-question"></i>
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-card/40 border border-white/5 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold hover:text-primary transition-colors">
                  {faq.q}
                  <i className="fa-solid fa-chevron-down text-muted text-xs group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-6 pb-5 text-muted text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Grip Feature Image + CTA */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/landing/feature-grip.jpg"
            alt="Close-up of hands gripping a barbell with chalk dust"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm"></div>
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Your next PR is waiting
          </h2>
          <p className="text-muted text-lg mb-10 max-w-lg mx-auto">
            Join thousands of lifters who track smarter, train harder, and get results they can see.
            Start for free — no strings attached.
          </p>
          <button
            onClick={signIn}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 inline-flex items-center gap-3"
          >
            <i className="fa-solid fa-dumbbell"></i>
            Start Tracking Free
          </button>
          <p className="text-muted/60 text-sm mt-6 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-check text-success text-xs"></i> Free forever</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-check text-success text-xs"></i> No credit card</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-check text-success text-xs"></i> No spam</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-dumbbell text-primary text-xs"></i>
              </div>
              <span className="font-bold tracking-tight">LiftMate</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted">
              <a href="#features" className="hover:text-text transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-text transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-text transition-colors">Reviews</a>
              <a href="#faq" className="hover:text-text transition-colors">FAQ</a>
            </div>
            <div className="text-sm text-muted/60">
              &copy; {new Date().getFullYear()} LiftMate. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
