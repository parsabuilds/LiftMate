interface Props { className?: string }

// Doorway Chest Stretch: arms out to sides, chest forward
function DoorwayChestStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="18" r="8" />
      <line x1="60" y1="26" x2="60" y2="65" />
      <line x1="60" y1="65" x2="45" y2="95" />
      <line x1="60" y1="65" x2="75" y2="95" />
      <line x1="60" y1="38" x2="25" y2="35" />
      <line x1="60" y1="38" x2="95" y2="35" />
      {/* Door frame */}
      <line x1="20" y1="5" x2="20" y2="115" strokeWidth="2" opacity="0.3" />
      <line x1="100" y1="5" x2="100" y2="115" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

// Wall Chest Stretch: one arm against wall, body turned
function WallChestStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="55" cy="18" r="8" />
      <line x1="55" y1="26" x2="55" y2="65" />
      <line x1="55" y1="65" x2="40" y2="95" />
      <line x1="55" y1="65" x2="70" y2="95" />
      <line x1="55" y1="38" x2="90" y2="20" />
      <line x1="55" y1="38" x2="35" y2="50" />
      {/* Wall */}
      <line x1="95" y1="5" x2="95" y2="115" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

// Overhead Triceps Stretch: one arm behind head, other pulling elbow
function OverheadTricepsStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="18" r="8" />
      <line x1="60" y1="26" x2="60" y2="65" />
      <line x1="60" y1="65" x2="45" y2="95" />
      <line x1="60" y1="65" x2="75" y2="95" />
      {/* Right arm up and behind head */}
      <line x1="60" y1="38" x2="72" y2="15" />
      <line x1="72" y1="15" x2="65" y2="45" />
      {/* Left arm pulling elbow */}
      <line x1="60" y1="38" x2="78" y2="18" />
    </svg>
  );
}

// Triceps Towel Stretch: arms behind back with towel
function TricepsTowelStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="18" r="8" />
      <line x1="60" y1="26" x2="60" y2="65" />
      <line x1="60" y1="65" x2="45" y2="95" />
      <line x1="60" y1="65" x2="75" y2="95" />
      {/* Right arm up behind back */}
      <line x1="60" y1="38" x2="70" y2="12" />
      <line x1="70" y1="12" x2="68" y2="50" />
      {/* Left arm behind low back */}
      <line x1="60" y1="38" x2="50" y2="55" />
      <line x1="50" y1="55" x2="65" y2="50" />
      {/* Towel */}
      <line x1="68" y1="30" x2="65" y2="50" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  );
}

// Cross-Body Shoulder Stretch: one arm across body
function CrossBodyShoulderStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="18" r="8" />
      <line x1="60" y1="26" x2="60" y2="65" />
      <line x1="60" y1="65" x2="45" y2="95" />
      <line x1="60" y1="65" x2="75" y2="95" />
      {/* Right arm across body */}
      <line x1="60" y1="38" x2="30" y2="42" />
      {/* Left arm pulling right arm */}
      <line x1="60" y1="38" x2="40" y2="50" />
      <line x1="40" y1="50" x2="35" y2="38" />
    </svg>
  );
}

// Behind-Back Shoulder Stretch: hands clasped behind back
function BehindBackShoulderStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="18" r="8" />
      <line x1="60" y1="26" x2="60" y2="65" />
      <line x1="60" y1="65" x2="45" y2="95" />
      <line x1="60" y1="65" x2="75" y2="95" />
      {/* Arms behind back, clasped */}
      <line x1="60" y1="38" x2="48" y2="55" />
      <line x1="48" y1="55" x2="52" y2="72" />
      <line x1="60" y1="38" x2="72" y2="55" />
      <line x1="72" y1="55" x2="52" y2="72" />
    </svg>
  );
}

// Pelvic Tilts: lying on floor, knees bent
function PelvicTilts({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      {/* Head */}
      <circle cx="22" cy="78" r="7" />
      {/* Torso lying flat */}
      <line x1="29" y1="80" x2="65" y2="82" />
      {/* Legs bent at knees */}
      <line x1="65" y1="82" x2="80" y2="60" />
      <line x1="80" y1="60" x2="82" y2="88" />
      {/* Arms at sides */}
      <line x1="35" y1="80" x2="32" y2="88" />
      <line x1="50" y1="81" x2="48" y2="88" />
      {/* Arrow showing pelvic tilt */}
      <path d="M60 75 Q62 68 65 75" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

// Lying Knee-to-Chest: on back, pulling one knee to chest
function LyingKneeToChest({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      <circle cx="22" cy="78" r="7" />
      <line x1="29" y1="80" x2="65" y2="82" />
      {/* One leg flat */}
      <line x1="65" y1="82" x2="100" y2="88" />
      {/* Other knee pulled to chest */}
      <line x1="65" y1="82" x2="55" y2="60" />
      <line x1="55" y1="60" x2="50" y2="75" />
      {/* Hands on knee */}
      <line x1="40" y1="80" x2="55" y2="62" />
      <line x1="50" y1="81" x2="55" y2="62" />
    </svg>
  );
}

// Standing Biceps Wall Stretch: arm on wall, body turned
function StandingBicepsWallStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="55" cy="18" r="8" />
      <line x1="55" y1="26" x2="55" y2="65" />
      <line x1="55" y1="65" x2="40" y2="95" />
      <line x1="55" y1="65" x2="70" y2="95" />
      {/* Arm flat against wall */}
      <line x1="55" y1="38" x2="95" y2="38" />
      {/* Other arm relaxed */}
      <line x1="55" y1="38" x2="40" y2="55" />
      {/* Wall */}
      <line x1="98" y1="5" x2="98" y2="115" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

// Seated Biceps Stretch: seated, arms behind, palms down
function SeatedBicepsStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="95" x2="115" y2="95" strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="30" r="8" />
      {/* Torso slightly forward */}
      <line x1="50" y1="38" x2="50" y2="70" />
      {/* Legs extended */}
      <line x1="50" y1="70" x2="50" y2="90" />
      <line x1="50" y1="90" x2="85" y2="93" />
      {/* Arms behind, palms on floor */}
      <line x1="50" y1="48" x2="75" y2="65" />
      <line x1="75" y1="65" x2="80" y2="90" />
    </svg>
  );
}

// Child's Pose: kneeling, arms forward on ground
function ChildsPose({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      {/* Head down near ground */}
      <circle cx="35" cy="75" r="7" />
      {/* Curved back */}
      <path d="M42 75 Q60 55 80 78" />
      {/* Knees tucked */}
      <line x1="80" y1="78" x2="85" y2="88" />
      <line x1="85" y1="88" x2="75" y2="88" />
      {/* Arms extended forward */}
      <line x1="35" y1="78" x2="12" y2="85" />
      <line x1="35" y1="75" x2="10" y2="80" />
    </svg>
  );
}

// Thread the Needle: on hands and knees, one arm threading under
function ThreadTheNeedle({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="95" x2="115" y2="95" strokeWidth="2" opacity="0.3" />
      {/* Head turned */}
      <circle cx="38" cy="62" r="7" />
      {/* Torso */}
      <line x1="45" y1="64" x2="75" y2="60" />
      {/* Knees on ground */}
      <line x1="75" y1="60" x2="80" y2="80" />
      <line x1="80" y1="80" x2="85" y2="93" />
      {/* One arm supporting */}
      <line x1="60" y1="60" x2="55" y2="93" />
      {/* Threading arm under */}
      <line x1="45" y1="65" x2="70" y2="78" />
    </svg>
  );
}

// Standing Quad Stretch: standing on one leg, holding foot behind
function StandingQuadStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="15" r="8" />
      <line x1="60" y1="23" x2="60" y2="60" />
      {/* Standing leg */}
      <line x1="60" y1="60" x2="55" y2="95" />
      {/* Bent leg behind */}
      <line x1="60" y1="60" x2="75" y2="50" />
      <line x1="75" y1="50" x2="78" y2="65" />
      {/* Hand holding foot */}
      <line x1="60" y1="40" x2="78" y2="65" />
      {/* Other arm out for balance */}
      <line x1="60" y1="40" x2="35" y2="35" />
    </svg>
  );
}

// Lying Quad Stretch: lying face down, pulling foot to glute
function LyingQuadStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      <circle cx="20" cy="80" r="7" />
      {/* Torso lying flat */}
      <line x1="27" y1="82" x2="65" y2="84" />
      {/* One leg straight */}
      <line x1="65" y1="84" x2="105" y2="86" />
      {/* Other leg bent back */}
      <line x1="65" y1="84" x2="80" y2="70" />
      <line x1="80" y1="70" x2="72" y2="60" />
      {/* Hand reaching back to foot */}
      <line x1="50" y1="82" x2="55" y2="68" />
      <line x1="55" y1="68" x2="72" y2="60" />
    </svg>
  );
}

// Seated Hamstring Stretch: seated, reaching for toes
function SeatedHamstringStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="95" x2="115" y2="95" strokeWidth="2" opacity="0.3" />
      <circle cx="35" cy="35" r="8" />
      {/* Torso bending forward */}
      <line x1="35" y1="43" x2="45" y2="75" />
      {/* Legs extended on ground */}
      <line x1="45" y1="75" x2="45" y2="90" />
      <line x1="45" y1="90" x2="95" y2="90" />
      {/* Arms reaching to toes */}
      <line x1="35" y1="48" x2="80" y2="82" />
      <line x1="35" y1="50" x2="82" y2="85" />
    </svg>
  );
}

// Standing Hamstring Stretch: standing, one foot on ledge, bending forward
function StandingHamstringStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="55" cy="15" r="8" />
      {/* Torso bending forward */}
      <line x1="55" y1="23" x2="50" y2="55" />
      {/* Standing leg */}
      <line x1="50" y1="55" x2="40" y2="95" />
      {/* Extended leg on ledge */}
      <line x1="50" y1="55" x2="90" y2="60" />
      {/* Ledge */}
      <line x1="85" y1="55" x2="95" y2="65" strokeWidth="2" opacity="0.3" />
      {/* Arms reaching to extended foot */}
      <line x1="52" y1="35" x2="85" y2="55" />
    </svg>
  );
}

// Pigeon Stretch: one leg forward bent, other extended behind
function PigeonStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="95" x2="115" y2="95" strokeWidth="2" opacity="0.3" />
      <circle cx="40" cy="35" r="7" />
      {/* Torso upright */}
      <line x1="40" y1="42" x2="45" y2="70" />
      {/* Front leg bent on ground */}
      <line x1="45" y1="70" x2="30" y2="85" />
      <line x1="30" y1="85" x2="55" y2="92" />
      {/* Back leg extended */}
      <line x1="45" y1="70" x2="100" y2="88" />
      {/* Hands on ground */}
      <line x1="40" y1="50" x2="25" y2="70" />
      <line x1="40" y1="50" x2="55" y2="65" />
    </svg>
  );
}

// Seated Figure-4 Stretch: seated, ankle on opposite knee
function SeatedFigure4Stretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="15" r="8" />
      <line x1="60" y1="23" x2="60" y2="58" />
      {/* Seated on chair */}
      <rect x="40" y="70" width="40" height="5" rx="2" opacity="0.3" />
      <line x1="60" y1="58" x2="60" y2="72" />
      {/* One leg down */}
      <line x1="55" y1="72" x2="48" y2="100" />
      {/* Other leg crossed (figure 4) */}
      <line x1="65" y1="72" x2="80" y2="65" />
      <line x1="80" y1="65" x2="82" y2="78" />
      {/* Arms */}
      <line x1="60" y1="38" x2="45" y2="50" />
      <line x1="60" y1="38" x2="75" y2="50" />
    </svg>
  );
}

// Lying Hamstring Stretch: on back, one leg raised
function LyingHamstringStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      <circle cx="18" cy="78" r="7" />
      <line x1="25" y1="80" x2="60" y2="82" />
      {/* One leg flat */}
      <line x1="60" y1="82" x2="100" y2="88" />
      {/* Other leg raised straight up */}
      <line x1="60" y1="82" x2="55" y2="30" />
      {/* Hands pulling raised leg */}
      <line x1="38" y1="80" x2="55" y2="50" />
      <line x1="45" y1="81" x2="57" y2="52" />
    </svg>
  );
}

// Figure-4 Stretch: lying on back, ankle crossed over knee
function Figure4Stretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      <circle cx="18" cy="78" r="7" />
      <line x1="25" y1="80" x2="60" y2="82" />
      {/* Bottom leg bent, foot on floor */}
      <line x1="60" y1="82" x2="75" y2="60" />
      <line x1="75" y1="60" x2="78" y2="88" />
      {/* Top leg crossed in figure 4 */}
      <line x1="60" y1="82" x2="70" y2="70" />
      <line x1="70" y1="70" x2="82" y2="65" />
      {/* Hands pulling through */}
      <line x1="40" y1="80" x2="72" y2="62" />
    </svg>
  );
}

// Knee-to-Chest Stretch: lying, both knees pulled to chest
function KneeToChestStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="90" x2="115" y2="90" strokeWidth="2" opacity="0.3" />
      <circle cx="20" cy="78" r="7" />
      <line x1="27" y1="80" x2="60" y2="82" />
      {/* Both knees pulled to chest */}
      <line x1="60" y1="82" x2="55" y2="60" />
      <line x1="55" y1="60" x2="48" y2="72" />
      <line x1="60" y1="82" x2="52" y2="58" />
      <line x1="52" y1="58" x2="45" y2="68" />
      {/* Arms hugging knees */}
      <line x1="38" y1="80" x2="50" y2="62" />
      <line x1="45" y1="81" x2="53" y2="65" />
    </svg>
  );
}

// Calf Wall Stretch: hands on wall, one leg back
function CalfWallStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Wall */}
      <line x1="25" y1="5" x2="25" y2="115" strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="18" r="8" />
      {/* Torso leaning forward */}
      <line x1="50" y1="26" x2="42" y2="60" />
      {/* Front leg bent */}
      <line x1="42" y1="60" x2="35" y2="95" />
      {/* Back leg extended, heel pressing */}
      <line x1="42" y1="60" x2="85" y2="95" />
      {/* Arms on wall */}
      <line x1="46" y1="38" x2="27" y2="32" />
      <line x1="46" y1="42" x2="27" y2="40" />
    </svg>
  );
}

// Step Calf Stretch: standing on step edge, heel dropping
function StepCalfStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <circle cx="60" cy="15" r="8" />
      <line x1="60" y1="23" x2="60" y2="60" />
      {/* Step */}
      <rect x="35" y="80" width="50" height="8" rx="2" opacity="0.3" />
      {/* Front foot on step */}
      <line x1="55" y1="60" x2="50" y2="78" />
      {/* Back foot hanging off edge, heel dropping */}
      <line x1="65" y1="60" x2="70" y2="78" />
      <line x1="70" y1="78" x2="72" y2="95" />
      {/* Arms relaxed */}
      <line x1="60" y1="38" x2="45" y2="50" />
      <line x1="60" y1="38" x2="75" y2="50" />
    </svg>
  );
}

// Hip Flexor Stretch: kneeling lunge
function HipFlexorStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="95" x2="115" y2="95" strokeWidth="2" opacity="0.3" />
      <circle cx="55" cy="18" r="8" />
      {/* Torso upright */}
      <line x1="55" y1="26" x2="55" y2="60" />
      {/* Front leg stepped forward, bent 90 */}
      <line x1="55" y1="60" x2="35" y2="75" />
      <line x1="35" y1="75" x2="30" y2="93" />
      {/* Back leg kneeling */}
      <line x1="55" y1="60" x2="80" y2="78" />
      <line x1="80" y1="78" x2="90" y2="93" />
      {/* Arms on hips */}
      <line x1="55" y1="40" x2="48" y2="55" />
      <line x1="55" y1="40" x2="62" y2="55" />
    </svg>
  );
}

// Butterfly Stretch: seated, soles of feet together
function ButterflyStretch({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      {/* Floor */}
      <line x1="5" y1="100" x2="115" y2="100" strokeWidth="2" opacity="0.3" />
      <circle cx="60" cy="20" r="8" />
      {/* Torso */}
      <line x1="60" y1="28" x2="60" y2="65" />
      {/* Legs out to sides, knees dropped */}
      <line x1="60" y1="65" x2="30" y2="75" />
      <line x1="30" y1="75" x2="50" y2="90" />
      <line x1="60" y1="65" x2="90" y2="75" />
      <line x1="90" y1="75" x2="70" y2="90" />
      {/* Feet together */}
      <circle cx="60" cy="92" r="3" fill="currentColor" opacity="0.3" />
      {/* Hands on feet */}
      <line x1="60" y1="45" x2="55" y2="88" />
      <line x1="60" y1="45" x2="65" y2="88" />
    </svg>
  );
}

export const stretchIllustrations: Record<string, React.FC<{ className?: string }>> = {
  'doorway-chest-stretch': DoorwayChestStretch,
  'wall-chest-stretch': WallChestStretch,
  'overhead-triceps-stretch': OverheadTricepsStretch,
  'triceps-towel-stretch': TricepsTowelStretch,
  'cross-body-shoulder-stretch': CrossBodyShoulderStretch,
  'behind-back-shoulder-stretch': BehindBackShoulderStretch,
  'pelvic-tilts': PelvicTilts,
  'lying-knee-to-chest': LyingKneeToChest,
  'standing-biceps-wall-stretch': StandingBicepsWallStretch,
  'seated-biceps-stretch': SeatedBicepsStretch,
  'childs-pose': ChildsPose,
  'thread-the-needle': ThreadTheNeedle,
  'standing-quad-stretch': StandingQuadStretch,
  'lying-quad-stretch': LyingQuadStretch,
  'seated-hamstring-stretch': SeatedHamstringStretch,
  'standing-hamstring-stretch': StandingHamstringStretch,
  'pigeon-stretch': PigeonStretch,
  'seated-figure-4-stretch': SeatedFigure4Stretch,
  'lying-hamstring-stretch': LyingHamstringStretch,
  'figure-4-stretch': Figure4Stretch,
  'knee-to-chest-stretch': KneeToChestStretch,
  'calf-wall-stretch': CalfWallStretch,
  'step-calf-stretch': StepCalfStretch,
  'hip-flexor-stretch': HipFlexorStretch,
  'butterfly-stretch': ButterflyStretch,
};
