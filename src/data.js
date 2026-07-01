// Content for the portfolio. Edit these to update the site.

export const NAV = [
  { n: '01', label: 'Home', href: '#top' },
  { n: '02', label: 'Work', href: '#work' },
  { n: '03', label: 'About', href: '/about' },
]

// Each case: image (drop a file in /public and set `img`) OR a wordmark + bg.
// `slug` powers the /work/<slug> case-study route. `study` (optional) holds the
// full case-study content; cases without it fall back to a summary page.
export const CASES = [
  {
    title: 'Retina AI',
    slug: 'retina-ai',
    tags: ['Product Design', 'Full Process', '2024'],
    desc: 'Led a team to create an AI-powered nutrition platform that turns a photo of a meal into instant, accurate dietary insight.',
    art: { text: 'Retina AI', color: '#1f3a5f', bg: 'linear-gradient(160deg,#cfe4f7,#dfe7fb 55%,#eef1fb)' },
    study: {
      heading: 'Rebuilding Nutrition Tracking with Retina AI',
      summary: 'Redesigning food logging around computer vision so anyone can capture a meal and trust the numbers — with clearer review for nutritionists.',
      tags: ['Web', 'Design Systems', 'Health Tech'],
      role: 'Product Designer & Engineer',
      duration: 'June — August 2024 (8 weeks)',
      tools: 'Figma, React, TypeScript, Node.js, Python',
      sections: [
        {
          id: 'context',
          nav: 'Context',
          blocks: [
            { kind: 'split', items: [
              { h: 'What is Retina AI?', p: 'Retina AI is a health-tech platform that recognises food from a single photo and returns calories, macros, and micronutrients in seconds. It removes the tedious manual search-and-log step that makes most nutrition apps fall apart after a week.' },
              { h: 'My Role', p: 'As the only designer on the team, I led the end-to-end redesign while also building the front-end. I ran research with dietitians and everyday users, mapped the system, and shipped the production interface alongside two engineers.' },
            ] },
          ],
        },
        {
          id: 'problem',
          nav: 'Problem',
          blocks: [
            { kind: 'lead', p: 'Logging a meal took too long and trusted too little. Users abandoned tracking because manual entry was slow, and nutritionists could not verify what the AI guessed.' },
            { kind: 'body', p: 'The original flow asked people to search a database, pick a portion size, and repeat it for every ingredient. Accuracy depended entirely on the user, and there was no way for a professional to correct a bad estimate before it skewed someone’s plan.' },
          ],
        },
        {
          id: 'research',
          nav: 'Research',
          blocks: [
            { kind: 'body', p: 'I interviewed 14 people across two groups — people actively dieting and the nutritionists who review their logs. Three patterns came up again and again: tracking dies on the friction of data entry, users distrust round numbers they did not enter themselves, and reviewers need context (the original photo) to trust a value.' },
            { kind: 'stats', items: [
              { num: '14', label: 'Interviews' },
              { num: '72%', label: 'Dropped off in week one' },
              { num: '3x', label: 'Faster to log by photo' },
            ] },
          ],
        },
        {
          id: 'design-approach',
          nav: 'Design Approach',
          blocks: [
            { kind: 'body', p: 'I designed around one principle: the photo is the source of truth. Every estimate stays attached to the image it came from, so users and reviewers always see the evidence. I built a confidence model into the UI — high-confidence items confirm silently, low-confidence ones prompt a quick tap to correct.' },
            { kind: 'body', p: 'For nutritionists, I designed a dedicated review panel that puts the meal photo, the AI’s breakdown, and an inline edit control side by side, so a correction is a single gesture rather than a context switch.' },
          ],
        },
        {
          id: 'solution',
          nav: 'Solution',
          blocks: [
            { kind: 'lead', p: 'A photo-first logging flow with a confidence-aware review layer — fast for users, verifiable for professionals.' },
            { kind: 'body', p: 'Snap a meal, and Retina AI returns an itemised breakdown in under two seconds. Anything the model is unsure about is flagged for a one-tap fix. On the professional side, the review panel lets a nutritionist approve or adjust an entry without ever leaving the meal in question.' },
          ],
        },
        {
          id: 'reflection',
          nav: 'Reflection',
          blocks: [
            { kind: 'body', p: 'Designing for an AI product meant designing for uncertainty. The biggest unlock was making confidence visible instead of hiding it — trust went up the moment users could see what the model was unsure about. If I revisited this, I’d invest earlier in the reviewer tools; they turned out to be the feature that made the data trustworthy enough to act on.' },
          ],
        },
      ],
    },
  },
  {
    title: 'Apple Services',
    slug: 'apple-services',
    tags: ['Product Design', 'Design Systems', '2025'],
    desc: 'Established design efficiency through spec tools and revitalized components.',
    art: { text: 'Apple Services', color: '#5a3a52', bg: 'linear-gradient(160deg,#f4d9ec,#efd6f3 50%,#f6dbe6)' },
  },
  {
    title: 'Verdant — Sustainability Dashboard',
    slug: 'verdant',
    tags: ['Data Viz', 'Dashboard', '2024'],
    desc: 'Turned complex emissions data into a clear, actionable analytics dashboard.',
    art: { text: 'verdant', color: '#F4F1EA', bg: '#2b3327' },
  },
  {
    title: 'Corner — Mobile Payments',
    slug: 'corner',
    tags: ['Mobile', 'Payments', '2023'],
    desc: 'Reimagined a peer-to-peer payments flow around speed and trust.',
    art: { text: 'corner', color: '#fff', bg: '#3D7BFF' },
  },
]

// Design Lab list. Each item shows as a row on the right; hovering it reveals
// the matching preview tile on the left. `blurb` is the muted description line,
// `year` sits at the end of the row, `label` is the wordmark on the preview.
export const PLAYGROUND = [
  { idx: '01', title: 'Northwind Banking App', label: 'Northwind', year: '2025', color: '#2F6BED', blurb: 'Rethinking everyday banking around clarity and calm.' },
  { idx: '02', title: 'Atlas Design System', label: 'Atlas', year: '2025', color: '#2C4A7E', blurb: 'A scalable component library that keeps teams in sync.' },
  { idx: '03', title: 'Verdant Sustainability Dashboard', label: 'Verdant', year: '2024', color: '#3F7A52', blurb: 'Turning dense emissions data into clear, actionable views.' },
  { idx: '04', title: 'Lumen Music Platform', label: 'Lumen', year: '2024', color: '#7A4FA3', blurb: 'A bold listening experience built around discovery.' },
  { idx: '05', title: 'Corner Store E-commerce', label: 'Corner', year: '2023', color: '#B8862F', blurb: 'A fast, friendly checkout for independent shops.' },
  { idx: '06', title: 'Pulse Fitness Tracker', label: 'Pulse', year: '2025', color: '#D34F6A', blurb: 'Daily health habits made motivating and effortless.' },
  { idx: '07', title: 'Ferns & Forage Identity', label: 'Ferns', year: '2024', color: '#4F7A3F', blurb: 'A warm visual identity for a neighbourhood kitchen.' },
  { idx: '08', title: 'Orbit Analytics Platform', label: 'Orbit', year: '2023', color: '#3A5BC7', blurb: 'Making product metrics legible at a glance.' },
]

export const SKILLS = [
  'Figma', 'Design Systems', 'Prototyping', 'User Research',
  'Motion', 'UX Writing', 'Wireframing', 'Usability Testing',
]

export const STATS = [
  { num: '6', suffix: '+', label: 'Years experience' },
  { num: '40', suffix: '+', label: 'Products shipped' },
  { num: '12', suffix: '', label: 'Happy teams' },
]

export const SOCIALS = ['LinkedIn', 'Whatsapp', 'Behance']
export const EMAIL = 'hello@saimyothu.com'
