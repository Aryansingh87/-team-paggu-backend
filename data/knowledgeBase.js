/**
 * knowledgeBase — the source documents for the RAG chatbot.
 * Each entry gets embedded once (via the embed-kb script) and stored in
 * MongoDB. At query time, the user's question is embedded and compared
 * against these to find the most relevant chunks, which get passed to
 * Gemini as context so its answer stays grounded in real content instead
 * of just improvising.
 */
const knowledgeBase = [
  {
    id: "squat-setup",
    title: "Squat Setup & Bar Position",
    text: "For a high-bar squat, the bar sits on top of the traps; for low-bar, it sits lower across the rear delts, just below the spine of the scapula. Feet should be roughly shoulder-width apart, toes turned out 15-30 degrees. Brace the core by taking a deep breath into your belly (not your chest) before unracking, and keep that brace throughout the entire rep.",
  },
  {
    id: "squat-depth",
    title: "Squat Depth",
    text: "In competitive powerlifting, a squat is only valid if the hip crease drops below the top of the knee — this is called 'below parallel.' Depth should come from hip and knee flexion together, not just leaning forward. Ankle mobility often limits depth more than people expect; if you can't hit depth without your heels lifting, that's usually the first thing to address.",
  },
  {
    id: "squat-bracing",
    title: "Squat Bracing & the Valsalva Maneuver",
    text: "Bracing means creating 360-degree pressure around your torso before descending — imagine bracing for a punch to the stomach. The Valsalva maneuver (holding your breath against a closed airway) stabilizes the spine under heavy load. Release the breath only after standing back up to full lockout, not partway through the rep.",
  },
  {
    id: "bench-setup",
    title: "Bench Press Setup",
    text: "Set your arch by pulling your shoulder blades down and together, creating a stable shelf for the bar. Feet should be planted firmly, driving leg power up through the bench (leg drive). Grip width affects range of motion — a wider grip shortens the bar path but stresses the shoulders more.",
  },
  {
    id: "bench-bar-path",
    title: "Bench Press Bar Path",
    text: "The bar shouldn't travel straight up and down — it should move in a slight J-curve, coming down toward the lower chest/upper abdomen and pressing back up and slightly toward the shoulders. Flaring the elbows out to 90 degrees stresses the shoulder joint; tucking them slightly (60-75 degrees) is generally safer and more efficient for strength.",
  },
  {
    id: "deadlift-setup",
    title: "Deadlift Setup",
    text: "Bar should be over the middle of the foot before you even bend down. Grip just outside the legs, hips set so your shins are close to (or touching) the bar. The back should be flat/neutral, not rounded, with your chest up and lats engaged ('protect your armpits') before you break the floor.",
  },
  {
    id: "deadlift-hip-hinge",
    title: "Deadlift Hip Hinge & Lockout",
    text: "The deadlift is primarily a hip hinge, not a squat — hips and shoulders should rise at roughly the same rate off the floor. At lockout, stand fully upright with hips through, without leaning back excessively. The bar should stay in contact with or very close to your legs the entire pull.",
  },
  {
    id: "rpe-explained",
    title: "What is RPE?",
    text: "RPE (Rate of Perceived Exertion) is a 1-10 scale describing how hard a set felt, based on how many more reps you could have done. RPE 10 means a true maximal effort with zero reps left in the tank. RPE 8 means you could have done about 2 more reps. Coaches use RPE to auto-regulate training — adjusting weight based on how you're actually performing that day, not just a fixed number on paper.",
  },
  {
    id: "progressive-overload",
    title: "Progressive Overload",
    text: "Progressive overload means gradually increasing the demand placed on your body over time — through more weight, more reps, more sets, or better technique efficiency at the same load. Without it, strength gains plateau. It doesn't have to mean adding weight every single session; the standard powerlifting approach is small increases week over week within a training block.",
  },
  {
    id: "deload-weeks",
    title: "Deload Weeks",
    text: "A deload is a planned, temporary reduction in training volume and/or intensity, typically every 4-8 weeks depending on the program. It allows the body to recover from accumulated fatigue before it becomes an overuse injury or a performance plateau. A deload isn't a sign of weakness — it's a planned part of long-term progress.",
  },
  {
    id: "warmup-protocol",
    title: "Warming Up for Heavy Lifts",
    text: "A good warm-up gradually ramps intensity: start with light cardio or mobility work, then work up in weight on the specific lift with decreasing reps as the weight increases (e.g. bar x10, 40% x5, 60% x3, 75% x2, 85% x1) before hitting your top working sets. This primes the nervous system and reduces injury risk compared to jumping straight to heavy weight.",
  },
  {
    id: "training-terms",
    title: "Common Powerlifting Terms",
    text: "1RM = one-rep max, the heaviest weight you can lift once with proper form. AMRAP = as many reps as possible at a given weight. Total = the sum of your best squat, bench, and deadlift in a competition. Wilks/DOTS score = a formula that normalizes total across bodyweights to compare lifters of different sizes fairly.",
  },
  {
    id: "meet-day-peaking",
    title: "Meet Day & Peaking",
    text: "A peaking block is the final weeks before a competition where volume drops significantly while intensity stays high, allowing accumulated fatigue to fade while strength is preserved — the goal is walking onto the platform as fresh and strong as possible. Meet day itself typically involves 3 attempts per lift, with each successful attempt locking in that weight toward your total.",
  },
  {
    id: "nutrition-basics",
    title: "Nutrition Basics for Strength Training",
    text: "Adequate protein intake (commonly cited around 1.6-2.2g per kg of bodyweight) supports muscle repair and growth. Being in a slight caloric surplus generally supports strength and muscle gain, while a deficit can still allow strength maintenance if protein and training intensity are kept high. These are general guidelines — individual needs vary, and a coach or nutritionist can tailor this further.",
  },
  {
    id: "recovery-sleep",
    title: "Recovery & Sleep",
    text: "Sleep is when the majority of muscle repair and nervous system recovery happens. Most strength athletes benefit from 7-9 hours per night. Chronic under-recovery (poor sleep, high stress, insufficient food) is one of the most common reasons for stalled progress even when the training program itself is well designed.",
  },
  {
    id: "injury-safety",
    title: "Pain, Injury & When to Stop",
    text: "Sharp, sudden, or joint-specific pain during a lift is different from normal training fatigue and is a signal to stop the set immediately. This assistant can only give general information — it cannot diagnose an injury or replace medical advice. If you're experiencing pain, please message your coach directly and consider seeing a medical professional before continuing to train through it.",
  },
];

export default knowledgeBase;