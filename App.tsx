import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { SceneCanvas } from '@/components/scene/SceneCanvas';
import { AtmosphereFallback } from '@/components/scene/AtmosphereFallback';
import { OpeningChapter, StoryChapter, CommunicationChapter, QuestionChapter } from '@/components/chapters/IntroChapters';
import { WorkplaceChapter, CreditsChapter, EndingChapter } from '@/components/chapters/ExperienceChapters';
import { SiteNav } from '@/components/nav/SiteNav';
import { JourneyProgress } from '@/components/nav/JourneyProgress';
import { useCinematicScroll } from '@/lib/useCinematicScroll';
import { useDeviceProfile } from '@/lib/useDeviceProfile';
import { startAmbientSound } from '@/lib/visualHelpers';
import { PRINCIPLES } from '@/content/burntSugar';

/** Mix-blend colour grade per chapter (soft-light over the 3D render). */
const GRADE_TINTS = [
  'rgba(255,170,80,0.34)',
  'rgba(255,150,70,0.3)',
  'rgba(120,150,190,0.26)',
  'rgba(120,70,40,0.32)',
  'rgba(255,215,160,0.26)',
  'rgba(170,40,60,0.3)',
  'rgba(255,190,100,0.38)',
];

const CENTERED_CHAPTERS = new Set([0, 5, 6]);

function App() {
  const profile = useDeviceProfile();
  const scroll = useCinematicScroll(profile.reducedMotion);
  const [soundOn, setSoundOn] = useState(false);
  const [principle, setPrinciple] = useState<string | null>(null);
  const [sceneFailed, setSceneFailed] = useState(false);

  useEffect(() => {
    if (!soundOn) return;
    return startAmbientSound();
  }, [soundOn]);

  const active = (chapter: number) => scroll.activeChapter === chapter;
  const introSkipped = scroll.introSkipped || profile.reducedMotion;
  const principleIndex = PRINCIPLES.findIndex((item) => item.id === principle);
  const centered = CENTERED_CHAPTERS.has(scroll.activeChapter);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-svh overflow-x-hidden bg-ink text-ivory">
        {profile.webgl && !sceneFailed ? (
          <SceneCanvas
            progress={scroll.progress}
            introSkipped={introSkipped}
            profile={profile}
            selectedPrinciple={principleIndex}
            onFail={() => setSceneFailed(true)}
          />
        ) : (
          <AtmosphereFallback chapter={scroll.activeChapter} />
        )}

        {/* colour grade, reading shade, vignette and film grain */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[4] mix-blend-soft-light transition-colors duration-[1800ms]"
          style={{ backgroundColor: GRADE_TINTS[scroll.activeChapter] }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[5] transition-opacity duration-1000"
          style={{
            background: centered
              ? 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(10,6,4,0.42), transparent 100%)'
              : 'linear-gradient(90deg, rgba(10,6,4,0.72) 0%, rgba(10,6,4,0.42) 42%, transparent 78%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[6] bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(8,4,3,0.72)_100%)]"
        />
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-50 opacity-[0.07] mix-blend-overlay" />

        <SiteNav
          activeChapter={scroll.activeChapter}
          soundOn={soundOn}
          onNavigate={scroll.goToChapter}
          onToggleSound={() => setSoundOn((on) => !on)}
        />
        <JourneyProgress progress={scroll.progress} activeChapter={scroll.activeChapter} onNavigate={scroll.goToChapter} />

        <div className="relative z-10">
          <OpeningChapter
            active={active(0)}
            introSkipped={introSkipped}
            onSkip={scroll.skipIntro}
            onEnter={() => scroll.goToChapter(1)}
          />
          <StoryChapter active={active(1)} />
          <CommunicationChapter active={active(2)} />
          <QuestionChapter active={active(3)} selected={principle} onSelect={setPrinciple} />
          <WorkplaceChapter active={active(4)} />
          <CreditsChapter active={active(5)} />
          <EndingChapter active={active(6)} onReturn={() => scroll.goToChapter(0)} />
        </div>
      </main>
    </MotionConfig>
  );
}

export default App;
