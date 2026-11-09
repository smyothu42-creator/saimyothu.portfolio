// Content for the portfolio. Edit these to update the site.
import { avifAll } from './avif'

// Page backdrop: 'calm' (blue mountains in evening mist, public/bg-calm.jpg),
// 'lofi' (drawn lo-fi room, night in dark mode / morning in
// light mode), 'city' (Yangon at night, public/bg-city.jpg),
// 'desk' (designer's desk at night, public/bg-desk.jpg),
// 'photo' (moonlit beach, public/bg.jpg), 'canvas' (your UI screens on a
// Figma-style board), or a scene drawn in code: 'sea', 'mountains', 'grass'.
export const BACKDROP = 'calm'

// Floating dock (right edge on desktop, bottom bar on phones). `icon` keys
// live in Dock.jsx.
export const RESUME_URL = 'https://drive.google.com/file/d/1ttu2gmFXslg1PrH6z5P8ztkYimWgyUum/view?usp=sharing'

export const NAV = [
  { label: 'Works', href: '/', icon: 'work' },
  { label: 'About', href: '/about', icon: 'about' },
  { label: 'Contact', href: '#contact', icon: 'contact', toBottom: true }, // scrolls to the contact card at the page's end
  { label: 'Resume', href: RESUME_URL, icon: 'resume', external: true },
]

// Home hero copy.
export const PROFILE = {
  name: 'Sai Myo Thu',
  role: 'Co-Founder & Product Designer',
  // Home page avatar: the bookshop photo, framed by `avatar`
  // (background-size and -position, zoomed onto the face).
  portrait: '/sai-profile-blue.jpg', // edited copy of sai-profile.jpg: navy shirt, mountain background
  avatar: { size: '229%', position: '40% 41%' },
  // About page: the big photo card at the top (the demo photo).
  hero: { src: '/sai-demo.jpg', aspect: '3 / 2', position: 'center 40%' },
  tagline: 'Product designer turning complex problems into simple, strategic experiences.',
  // Opens the home hero's paragraph, and is the footer's sign-off.
  signoff: 'Designed in Yangon, iced Americano nearby',
  // Plain strings render as text; { text, href } render as outbound links.
  note: [
    'Co-\u2060Founder at ',
    { text: 'OrderFlow', href: 'https://orderflowmm.com/' },
    ' & Product Designer at ',
    { text: 'Heizen', href: 'https://www.heizen.work/' },
  ],
}

// Each case: image (drop a file in /public and set `img`) OR a wordmark + bg.
// `thumb` (optional) is a square version of `img` for the home page's fanned cards;
// `card` (optional) replaces `img` on the Work page cards.
// `logo` (optional, e.g. '/logos/apple.svg') is the grey mark beside the card
// title; without it the card shows the title's first letter.
// `result` (optional) is the one line under a project's name on the home page.
// `slug` powers the /work/<slug> case-study route. `study` (optional) holds the
// full case-study content; cases without it fall back to a summary page.
// `featured: true` puts a case in the two large cards at the top of Work; the
// rest show as smaller cards under "Other Projects", labelled with `domain`
// (optional `thumbAspect`, e.g. '1.33', overrides the staggered thumb height).
// In a study, `summary` is the first section's lead line, comma-separated
// `tools` render one per line, and optional `scope` lists the products covered.
// Leave `duration` / `team` empty to hide those facts.
export const CASES = [
  {
    title: 'OrderFlow for\u00a0F&B\u00a0Business', // non-breaking, so the second line reads "for F&B Business",
    name: 'OrderFlow',
    coverTitle: 'OrderFlow', // the case cover's heading; cards keep the full title
    domain: 'F&B',
    slug: 'orderflow',
    result: '35.7M MMK in revenue through OrderFlow',
    logo: '/logos/orderflow.png',
    featured: true,
    tags: ['Product Design'],
    desc: 'QR table ordering for cafés in Myanmar: a guest app on the phone, and an admin that runs every order.',
    short: 'QR ordering and a café admin.', // one line for More Work
    art: { img: '/case/orderflow/cover.jpg?v=24', video: '/case/orderflow/hero.mp4?v=8', videoSm: '/case/orderflow/hero-sm.mp4?v=2', poster: '/case/orderflow/hero.jpg?v=3', thumb: '/case/orderflow/thumb-pos.jpg?v=10', card: '/case/orderflow/thumb.jpg', text: 'OrderFlow', color: '#1f3a5f', bg: 'linear-gradient(160deg,#cfe4f7,#dfe7fb 55%,#eef1fb)' },
    // One case for both products: the guest app (orderflow-client) and the admin
    // panel (orderflow-admin-panel). Told as a product manager's case: Impact,
    // Project Overview, The Opportunity, Problem Discovery, Product Vision &
    // Strategy, MVP & Prioritization, Product Architecture, Key Product Decisions,
    // Design Walkthrough, Takeaway (eyebrows number them; `group`
    // keeps one side-list entry per section). Numbers come from the Startup World Cup pitch deck (Oct
    // 2026); the deck's unconfirmed and [example] figures are left out on purpose.
    // The cover is a short motion loop of the real screens (art.video, tools/case-video/hero-of.html):
    // a guest's QR order reaching the staff board, its slips printing at the cashier and in the kitchen, then the owner's numbers.
    study: {
      navTop: false,
      overviewNav: 'Project Overview',
      overviewPart: 'About',
      layout: 'story',
      heading: 'F&B Operation Management Tool',
      summary: 'OrderFlow runs a café’s whole operation in one system: guests order from the table QR, staff manage orders, tables and kitchen slips, and owners run the menu, prices and reports.',
      accent: '#44403c',
      tags: ['Product Strategy', 'B2B SaaS', 'F&B'],
      role: 'Co-Founder, Product Manager',
      duration: 'Ongoing',
      team: ['2 engineers', '1 brand designer'],
      gallery: [],
      tools: 'Claude Code, Figma, Trello',
      sections: [
        {
          id: 'impact',
          nav: 'Impact',
          notitle: true,
          blocks: [
            // `fit`: columns as wide as their text, the same gap either side of every divider
            { kind: 'impact', fit: true, items: [
              { num: '4', label: 'Cafés in 6 months' },
              { num: '1,300+', label: 'Orders at one shop\nin its first 42 days' },
              { num: '60 / 60', label: 'Days straight a\ncustomer used it' },
              { num: '35.7M', label: 'MMK in revenue\nthrough OrderFlow' },
            ] },
          ],
        },
        {
          id: 'opportunity',
          nav: 'The Opportunity',
          part: 'We think',
          title: 'Big market, *one gap*',
          blocks: [
            { kind: 'lead', p: 'Most of Myanmar’s 23,741 cafés still take orders on paper, and none let the guest order.' },
            { kind: 'stats', h: 'Market size', items: [
              { num: '6.2T', label: 'MMK, Asia-Pacific market' },
              { num: '33.2B', label: 'MMK a year, Myanmar' },
              { num: '4.3B', label: 'MMK a year, Yangon first' },
            ] },
            { kind: 'stats', h: 'Digital adoption', items: [
              { logos: ['foodpanda', 'grab'], num: '39.8M', label: 'People online' },
              { logos: ['kbzpay'], num: '19M', label: 'Use KBZPay' },
              { logos: ['myanmar'], num: '25%', label: 'Inflation' },
            ] },
          ],
        },
        {
          id: 'discovery',
          nav: 'Problem Discovery',
          blocks: [
            { kind: 'lead', p: 'We watched cafés at busy hours and talked to the people on each side of an order.' },
            { kind: 'notes', items: [
              { t: 'Owners', illo: 'owner', p: 'Want to keep their POS and stop reprinting menus. With inflation near 25%, a printed price is soon wrong.' },
              { t: 'Floor staff', illo: 'staff', p: 'Too many tables at once, orders shouted across the room, and every order typed in again at the counter.' },
              { t: 'Guests', illo: 'guest', p: 'Wait to be noticed, get the wrong drink, and won’t install an app to order.' },
            ] },
          ],
        },
        {
          id: 'vision',
          nav: 'Product Vision',
          title: 'An *ecosystem*, starting with QR',
          blocks: [
            { kind: 'lead', p: 'Busy owner-run cafés in Yangon order from the table QR first. Then we grow the rest of the shop around it.' },
            { kind: 'hub', items: [
              { key: 'qr', t: 'QR ordering', tag: 'Live now', p: 'Guests scan the QR and order in Burmese or English, no app.', live: true },
              { key: 'pos', t: 'POS', tag: 'Pro plan', p: 'Counter orders, tables and bills in one system with the QR orders.' },
              { key: 'ai', t: 'Flowy AI', tag: 'Pro plan', p: 'Every order is data. Flowy AI turns it into answers for owners.' },
              { key: 'loyalty', t: 'Loyalty', tag: 'From Q3 2027', p: 'Points and rewards that bring guests back, an add-on to any plan.' },
              { key: 'inventory', t: 'Inventory', tag: 'Next', p: 'Stock counts down with each order, so owners know what to restock.' },
            ], outer: [
              { key: 'menu', t: 'Menu management', p: 'Items, prices and photos in English and Burmese, switched on or off.' },
              { key: 'tables', t: 'Tables', p: 'Floors and tables on one map, each with a printable QR code.' },
              { key: 'slips', t: 'Kitchen slips', p: 'Every accepted order prints a slip, so the kitchen knows what’s next.' },
              { key: 'staff', t: 'Staff', p: 'Accounts for the whole team, each with only the access they need.' },
              { key: 'reports', t: 'Reports', p: 'Sales, orders per hour and top items, ready for the owner anytime.' },
              { key: 'alerts', t: 'Notifications', p: 'New orders and updates all in one place, so nothing gets missed.' },
            ] },
          ],
        },
        {
          id: 'mvp',
          nav: 'The MVP',
          part: 'We execute',
          title: 'Start with *assumptions* (MVP)',
          blocks: [
            { kind: 'lead', p: 'Assumptions and limited information were all we had, so we built one small version to test them in the market.' },
            { kind: 'mockpair',
              phone: { label: 'Guest', alt: 'Guest flow: menu, options, order summary, waiting, preparing, ready', srcs: ['c-menu', 'c-item', 'c-summary', 'c-waiting', 'c-preparing', 'c-ready'].map((n) => `/case/orderflow/mvp/${n}.jpg`) },
              browser: { label: 'Shop', alt: 'Shop flow: add an item, table QR, QR stand, accept, ready, paid', srcs: ['a-item', 'a-table-qr', 'a-qr-stand', 'a-accept', 'a-ready', 'a-paid'].map((n) => `/case/orderflow/mvp/${n}.jpg`) },
            },
          ],
        },
        {
          id: 'validation',
          nav: 'Validation',
          title: 'Validated on *real usage*',
          blocks: [
            { kind: 'lead', p: 'We put the MVP in a real café, trained the staff on site, and improved the product from what we saw and heard.' },
            { kind: 'photos', items: [
              { src: '/case/orderflow/setup.jpg', alt: 'Our team training RAW’s staff on the OrderFlow admin at a café table' },
              { src: '/sai-demo.jpg', alt: 'Sai walking café staff through OrderFlow on a laptop, with QR stands on the table' },
            ] },
            { kind: 'loop', steps: [
              { icon: 'staff', t: 'Test with real users', p: 'Guests and staff use it during real shifts.' },
              { icon: 'alerts', t: 'Get feedback', p: 'We watch at the counter and ask staff what slows them down.' },
              { icon: 'reports', t: 'Improve', p: 'Fix it, ship it to the pilot cafés, and test again.' },
            ] },
          ],
        },
        {
          id: 'architecture',
          nav: 'Architecture',
          title: 'The product *architecture*',
          blocks: [
            { kind: 'lead', p: 'An order starts on a guest’s phone, lands on the staff board and ends up in the owner’s numbers.' },
            { kind: 'arch', items: [
              { key: 'guest', t: 'Guest', p: 'Orders from the table QR. No app.' },
              { key: 'staff', t: 'Staff', p: 'A live board by table, with printed slips.' },
              { key: 'owner', t: 'Owner', p: 'Reports, sales, menu and prices.' },
            ] },
          ],
        },
        {
          id: 'decisions',
          nav: 'Decisions',
          title: 'Three calls that *shaped it*',
          blocks: [
            { kind: 'decisions', items: [
              { key: 'pos', problem: 'Cafés didn’t want to give up their POS.', decision: 'OrderFlow takes the order. The POS keeps the bill.' },
              { key: 'offline', problem: 'Blackouts are common, and most café systems only work on one device.', decision: 'A responsive admin lets owners manage orders from a phone on mobile data.' },
              { key: 'eco', problem: 'Competitors started copying QR ordering.', decision: 'We grew it into one system: POS, AI, loyalty and inventory.' },
            ] },
          ],
        },
        {
          id: 'shipping',
          nav: 'Workflow',
          title: 'Shipping the *front end*',
          blocks: [
            { kind: 'lead', p: 'Every change went out the same way: its own branch, type check, lint and build, a changelog note on how it was checked, then staging before production.' },
            { kind: 'ship',
              stats: [
                { num: '53', label: 'Commits by me, Jun to Nov 2026' },
                { num: '2', label: 'Front-end repos: guest app and admin' },
                { num: '4', label: 'Pull requests by me, merged' },
              ],
              log: [
                ['055d995', 'admin', 'feat(admin): rework order flows, room checkout, and admin UI polish'],
                ['66814c1', 'guest', 'feat: guest sign-in UI, online-order updates and language hydration fix'],
                ['6a7b878', 'admin', 'feat(reports): add item sales and sales summary tabs'],
                ['1d7f7e0', 'guest', 'feat(loyalty): refresh loyalty/home UI, add rewards hub and zh/ko locales'],
                ['ef4a261', 'admin', 'design: rebuild the print prompt around what a cashier needs at the counter'],
                ['ef40d2f', 'guest', 'feat(menu): show out-of-stock items instead of hiding them'],
              ],
            },
          ],
        },
        {
          id: 'execution',
          nav: 'Client Side',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            { kind: 'flows', label: 'Guest app', items: [
              { tag: 'QR order', title: 'Normal Ordering Flow', p: 'Scan the table QR and order. No app, no sign-in.', desc: 'Scan the table QR and order in a few taps. No app, no sign-in.', src: '/case/orderflow/feat/g-order.mp4?v=3', poster: '/case/orderflow/feat/g-order.jpg?v=3', alt: 'Guest app: scanning the table QR, switching to Burmese, adding two items and placing the order', steps: [{ t: 0, text: 'Scan the table QR, no app' }, { t: 1.35, text: 'Burmese or English' }, { t: 9.45, text: 'Browse by category' }, { t: 13.81, text: 'Tap an item' }, { t: 18.55, text: 'Basket in thumb reach' }, { t: 23.66, text: 'Review and place' }, { t: 29.15, text: 'Track until ready' }] },
              { tag: 'Pickup', title: 'Online Order Flow', p: 'Order ahead from the shop’s link, then pick it up.', desc: 'Order ahead from the shop’s link, then collect at the counter.', src: '/case/orderflow/feat/g-pickup.mp4?v=3', poster: '/case/orderflow/feat/g-pickup.jpg?v=3', alt: 'Guest app: an online pickup order from the shop link, with name and phone, to the order number', steps: [{ t: 0, text: 'Order ahead from the shop’s link' }, { t: 1.52, text: 'Add what you want' }, { t: 9.83, text: 'Pickup or delivery, with a ready time' }, { t: 12.68, text: 'Name and phone, saved for next time' }, { t: 18.17, text: 'Place it, with a moment to cancel' }, { t: 23.7, text: 'An order number for the counter' }] },
              { tag: 'Loyalty', title: 'Loyalty Flow', p: 'Points, stamps and member perks in one tab.', desc: 'Points, stamps and member perks, all in one Rewards tab.', src: '/case/orderflow/feat/g-loyalty.mp4?v=3', poster: '/case/orderflow/feat/g-loyalty.jpg?v=3', alt: 'Guest app: the Rewards tab with points, the stamp card and the membership card', steps: [{ t: 0, text: 'Every perk in one tab' }, { t: 2.97, text: 'Points turn into free treats' }, { t: 8.44, text: 'A stamp with every order' }, { t: 13.77, text: 'A member level and its perks' }] },
              { tag: 'Sign in', title: 'Account Login Flow', p: 'Sign in with email or Google to earn rewards.', desc: 'Order without an account. Sign in only to earn points.', src: '/case/orderflow/feat/g-account.mp4?v=3', poster: '/case/orderflow/feat/g-account.jpg?v=3', alt: 'Guest app: signing in with email or Google, and creating an account', steps: [{ t: 0, text: 'Order without an account' }, { t: 2.51, text: 'Sign in to earn points' }, { t: 4.5, text: 'Email and password' }, { t: 7.69, text: 'Or one tap with Google' }, { t: 10.06, text: 'New here? Create an account' }] },
            ] },
          ],
        },
        {
          id: 'execution-admin',
          nav: 'Admin Side',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            { kind: 'flows', device: 'browser', label: 'Admin panel', items: [
              { tag: 'QR order', title: 'QR Order Flow', p: 'A guest’s QR order, from the board to payment.', src: '/case/orderflow/feat/a-qr.mp4?v=4', poster: '/case/orderflow/feat/a-qr.jpg?v=3', alt: 'Admin: a QR order on the board, opened, its kitchen slips printed and its payment recorded', steps: [{ t: 0, text: 'A QR order lands on its table' }, { t: 0.82, text: 'Open it to see what the guest ordered' }, { t: 2.96, text: 'Print slips for the kitchen' }, { t: 4.17, text: 'Payment done, the table clears' }] },
              { tag: 'Counter order', title: 'Manual Order Flow', p: 'A counter order, from table to kitchen to payment.', src: '/case/orderflow/feat/a-manual.mp4?v=4', poster: '/case/orderflow/feat/a-manual.jpg?v=3', alt: 'Admin: a counter order for table 6, three items, cash with change and printed slips', steps: [{ t: 0, text: 'Take an order at the counter' }, { t: 2.74, text: 'Pick the table' }, { t: 4.91, text: 'Tap items to add them' }, { t: 8.79, text: 'Send it to the kitchen' }, { t: 10.88, text: 'Take payment, with change' }, { t: 13.76, text: 'Print slips; table 6 is on the board' }] },
              { tag: 'Reports', title: 'Reports & Metrics', p: 'The day’s sales, busy hours and top items.', src: '/case/orderflow/feat/a-reports.mp4?v=4', poster: '/case/orderflow/feat/a-reports.jpg?v=3', alt: 'Admin: metrics for the day, the daily close, orders by channel and sales per item', steps: [{ t: 0, text: 'Today’s sales at a glance' }, { t: 0.43, text: 'Busy hours and top items' }, { t: 2.04, text: 'Daily close, ready to print' }, { t: 3.57, text: 'Every order, by channel' }, { t: 5.24, text: 'Sales per item' }] },
              { tag: 'New item', title: 'Add New Menu', p: 'A new item, from photo to price.', src: '/case/orderflow/feat/a-newmenu.mp4?v=4', poster: '/case/orderflow/feat/a-newmenu.jpg?v=3', alt: 'Admin: adding an espresso with a photo, English and Burmese names, a price and prep time', steps: [{ t: 0, text: 'Add an item from the menu list' }, { t: 2.64, text: 'Upload its photo' }, { t: 3.78, text: 'Name it in English and Burmese' }, { t: 5.52, text: 'Description, price and prep time' }, { t: 10.43, text: 'Count its stock, or skip it' }, { t: 13.72, text: 'It’s on the menu, ready to order' }] },
            ] },
          ],
        },
        {
          id: 'mvp-vs-now',
          nav: 'MVP vs Current',
          group: 'Design Walkthrough',
          title: 'MVP vs *current*',
          blocks: [
            { kind: 'compare2', ratio: '1600 / 1000', beforeLabel: 'MVP', afterLabel: 'Current', before: '/case/orderflow/mvp-compare.jpg', after: '/case/orderflow/orders-qr.jpg', alt: 'The café order board with an order open beside it, in the MVP and in the current product' },
          ],
        },
        {
          id: 'takeaway',
          nav: 'Takeaway',
          illo: 'idea',
          blocks: [
            { kind: 'lead', p: 'The hardest calls were about what not to build. Each feature we skipped was one less reason for an owner to say no. And the guest app and the admin are one product: a shortcut on one side usually turns into work for someone on the other.' },
          ],
        },
      ],
    },
  },
  {
    title: 'Corporate Meal Order',
    domain: 'F&B',
    slug: 'superfine-employee',
    result: '$173K in lunch orders in the first 6 weeks',
    logo: '/logos/superfine-kitchen.png',
    featured: true,
    tags: ['Product Design'],
    desc: 'Lunch ordering for employees on a company meal program, on the web and on a phone.',
    short: 'Lunch ordering for office teams.', // one line for More Work
    art: { video: '/case/superfine-employee/hero.mp4?v=3', videoSm: '/case/superfine-employee/hero-sm.mp4?v=2', poster: '/case/superfine-employee/hero.jpg?v=2', img: '/case/superfine-employee/cover.jpg?v=5', thumb: '/case/superfine-employee/thumb.jpg?v=3', card: '/case/superfine-employee/thumb.jpg?v=3', text: 'Superfine Kitchen', color: '#5a3a52', bg: 'linear-gradient(160deg,#f4d9ec,#efd6f3 50%,#f6dbe6)' },
    // Told as a product designer's case: Impact, Project Overview, Product Context,
    // The Problem, Understand the Business and User, How I ship (with AI), Design Walkthrough,
    // Usability, Takeaway. Facts come from the
    // superfine.corporate.employee repo: its README (IA, ordering flow,
    // interview findings) and ACCESSIBILITY-AUDIT.md (WCAG 2.2 AA, 23 Jul 2026).
    // Recordings: tools/case-video (web 1440 × 900 primary, phone 402 × 874 secondary).
    study: {
      navTop: false,
      overviewNav: 'Project Overview',
      layout: 'story',
      heading: 'Designing lunch ordering that says what it costs, before you ask',
      // TODO(Sai): confirm your part and the dates.
      summary: 'Superfine Kitchen cooks in San Francisco and delivers lunch to Bay Area offices. Employees on a company meal program order through this app. At Heizen I designed it web first, made it work on a phone, and tested it against WCAG 2.2 AA.',
      accent: '#44403c',
      tags: ['Web app', 'Responsive', 'Accessibility'],
      role: 'Product Designer',
      scope: ['Responsive Web Platform'],
      duration: 'Jun to Sep 2026',
      team: [],
      gallery: [],
      tools: 'Figma, Claude Code, axe-core',
      sections: [
        {
          id: 'impact',
          nav: 'Impact',
          notitle: true,
          blocks: [
            { kind: 'impact', fit: true, items: [
              // live results, 6 weeks after the first customer was onboarded (8 Nov 2026)
              { num: '$173K', label: 'In orders in the\nfirst 6 weeks' },
              { num: '1,738', label: 'Orders placed' },
              { num: '49', label: 'Companies ordering,\n334 employees' },
            ] },
          ],
        },
        {
          id: 'context',
          nav: 'Product Context',
          illo: 'lunch',
          blocks: [
            { kind: 'lead', p: 'Companies pay part of their employees’ lunch, like $15 a day at Neptune Corp. Cards are charged 24 hours before delivery.' },
            { kind: 'notes', items: [
              { t: 'Office employees', illo: 'employee', p: 'Order between meetings and want to see what’s covered.' },
              { t: 'Floor employees', illo: 'staff', p: 'Only have a phone, and need the cut-off and to know food is coming.' },
              { t: 'Company admins', illo: 'owner', p: 'Set the allowance, add people by email and watch the spend.' },
            ] },
          ],
        },
        {
          id: 'research',
          nav: 'Understand',
          title: 'Understand the Business and User',
          illo: 'research',
          blocks: [
            { kind: 'lead', p: 'I started with the business, then the people ordering. Three steps took us from Superfine’s side of the meal program to what the app had to do.' },
            { kind: 'steps', items: [
              { spot: 'store', t: 'Interview the team', p: 'Two rounds with the Superfine Kitchen team on how company meal programs, allowances, cut-offs and delivery days work.' },
              { spot: 'map', t: 'Map the problems', p: 'What goes wrong for Superfine, and what goes wrong for the employees who order.' },
              { spot: 'target', t: 'Solve the top ones', p: 'Rank the problems by how often they happen and how much they hurt, and solve the top ones first.' },
            ] },
          ],
        },
        {
          id: 'problem',
          nav: 'The Problem',
          blocks: [
            { kind: 'lead', p: 'Employees ordered on a third-party catering platform, a shop built for one-off party orders. It knew nothing about a company lunch: no allowance, no cut-offs and no order status.' },
            { kind: 'compare2', ratio: '1600 / 1000', beforeLabel: 'Before · Third-party platform', afterLabel: 'After · Superfine Web-app', before: '/case/superfine-employee/platform-before.jpg', after: '/case/superfine-employee/platform-after.jpg', alt: 'the third-party catering platform employees used before, and the new Superfine menu with the allowance in the header' },
            { kind: 'iconlist', items: [
              { spot: 'wallet', h: 'Hidden allowance', p: 'People found out what was covered at checkout, if at all.' },
              { spot: 'clock', h: 'Missed cut-offs', p: 'Each order type closes at a different time before delivery.' },
              { spot: 'box', h: 'No status', p: 'Nothing said whether lunch was actually coming.' },
              { spot: 'card', h: 'Surprise charges', p: 'Unclear when the card is charged, and by how much.' },
            ] },
          ],
        },
        {
          id: 'journey',
          nav: 'User Journey',
          title: 'Ordering lunch, *before the app*',
          blocks: [
            { kind: 'lead', p: 'One lunch order on the third-party platform, for the two kinds of employee we talked to. The lowest points are what the app had to fix.' },
            // Built from the interview findings above. TODO(Sai): check the moods against what employees told you.
            { kind: 'journeymap', rows: ['emotion', 'pain'],
              stages: ['Find the menu', 'Pick a meal', 'Check the allowance', 'Beat the cut-off', 'Get charged', 'Wait for lunch'],
              users: [
                { name: 'Office employee', illo: 'employee', cells: [
                  { emotion: -1, mood: 'Lost', pain: 'Which link is our company’s?' },
                  { emotion: 0, mood: 'Fine', pain: 'A menu built for party trays' },
                  { emotion: -2, mood: 'Unsure', pain: 'What does the company cover?' },
                  { emotion: -1, mood: 'Rushed', pain: 'When does today close?' },
                  { emotion: -2, mood: 'Surprised', pain: 'Charged more, and when?' },
                  { emotion: -1, mood: 'Worried', pain: 'Is lunch actually coming?' },
                ] },
                { name: 'Floor employee', illo: 'staff', cells: [
                  { emotion: -2, mood: 'Stuck', pain: 'Hard to use on a phone' },
                  { emotion: -1, mood: 'Squinting', pain: 'Small text, small buttons' },
                  { emotion: -1, mood: 'Unsure', pain: 'Covered or not?' },
                  { emotion: -2, mood: 'Missed it', pain: 'Shift ran past the cut-off' },
                  { emotion: -1, mood: 'Unsure', pain: 'No idea what was charged' },
                  { emotion: -1, mood: 'Worried', pain: 'No status on the floor' },
                ] },
              ] },
          ],
        },
        {
          id: 'ai',
          nav: 'How I ship (with AI)',
          illo: 'idea',
          blocks: [
            { kind: 'lead', p: 'Instead of static frames, I shipped a clickable prototype built with AI (Claude Code). It was fast enough to run 10 rounds of feedback in 6 weeks, and still leave time to test it with customers.' },
            { kind: 'impact', items: [
              { num: '10', label: 'Feedback rounds in 6 weeks' },
              { num: 'GitHub', label: 'Developers built from the prototype’s code as their UI reference' },
              { num: 'Tested', label: 'With customers before launch, in the time saved' },
            ] },
          ],
        },
        {
          id: 'final',
          nav: 'Web',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            // web first; recorded from the app (tools/case-video/sf-f-*.json, cfg-sf-f-*.json)
            { kind: 'flows', device: 'browser', label: 'Employee web app', items: [
              { tag: 'Ordering', title: 'Ordering Flow', p: 'Lunch with the allowance in view, from the menu to confirmed.', src: '/case/superfine-employee/flows/order.mp4', poster: '/case/superfine-employee/flows/order.jpg', alt: 'Employee web app: the allowance in the header, a meal with options, the over-budget header, the cart split, company invoice and the confirmation', steps: [{ t: 0, text: 'The allowance, in the header' }, { t: 2.27, text: 'Pick a meal and its options' }, { t: 6.7, text: 'See what you’ll pay' }, { t: 10.58, text: 'The cart splits who pays' }, { t: 12.33, text: 'Pay by company invoice' }, { t: 17.18, text: 'Placed and confirmed' }] },
              { tag: 'Past orders', title: 'Previous Orders', p: 'Every order’s status, past orders, re-order and rating.', src: '/case/superfine-employee/flows/orders.mp4', poster: '/case/superfine-employee/flows/orders.jpg', alt: 'Employee web app: My Orders with live status, the Past tab, re-order and rating a meal', steps: [{ t: 0, text: 'Every order and its status' }, { t: 2.7, text: 'Past orders, in one tab' }, { t: 4.23, text: 'Re-order in one tap' }, { t: 6.67, text: 'Rate a meal' }] },
              { tag: 'Edit order', title: 'Edit Order', p: 'Change a placed order before the cut-off, and save.', src: '/case/superfine-employee/flows/edit.mp4', poster: '/case/superfine-employee/flows/edit.jpg', alt: 'Employee web app: editing a placed order from My Orders, swapping the meal, reviewing the changes and saving them', steps: [{ t: 0, text: 'Edit before the cut-off' }, { t: 1.64, text: 'Swap the meal' }, { t: 8.98, text: 'Review the changes' }, { t: 13.62, text: 'Save, and the order updates' }] },
              { tag: 'Auto-order', title: 'Auto-Ordering', p: 'Pick meals once, choose the days, and lunch orders itself.', src: '/case/superfine-employee/flows/auto.mp4', poster: '/case/superfine-employee/flows/auto.jpg', alt: 'Employee web app: setting up Auto-Order, picking a meal with its options, choosing days and turning it on', steps: [{ t: 0, text: 'Set it and forget it' }, { t: 1.94, text: 'Pick the meals to repeat' }, { t: 7.89, text: 'Choose the days' }, { t: 9.51, text: 'Turn it on' }] },
              { tag: 'Allergens', title: 'Allergens', p: 'Filter out allergens and keep only what fits your diet.', src: '/case/superfine-employee/flows/diet.mp4', poster: '/case/superfine-employee/flows/diet.jpg', alt: 'Employee web app: filtering out tree nuts and dairy, then keeping vegan meals only', steps: [{ t: 0, text: 'Filter out allergens' }, { t: 5.22, text: 'Only what fits your diet' }, { t: 9.06, text: 'The menu updates' }] },
            ] },
          ],
        },
        {
          id: 'final-mobile',
          nav: 'Mobile',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            // the same flows on a phone (tools/case-video/sf-m-*.json, cfg-sf-m-*.json)
            { kind: 'flows', label: 'Employee mobile web', items: [
              { tag: 'Ordering', title: 'Ordering Flow', desc: 'See your allowance, pick lunch, and pay by company invoice.', src: '/case/superfine-employee/flows/m-order.mp4', poster: '/case/superfine-employee/flows/m-order.jpg', alt: 'Employee app on a phone: the allowance in the header, a meal with options, the cart split, company invoice and the confirmation' },
              { tag: 'Past orders', title: 'Previous Orders', desc: 'See each order’s status, re-order in a tap, and rate a meal.', src: '/case/superfine-employee/flows/m-orders.mp4', poster: '/case/superfine-employee/flows/m-orders.jpg', alt: 'Employee app on a phone: My Orders with status, the Past tab, re-order and rating a meal' },
              { tag: 'Edit order', title: 'Edit Order', desc: 'Change a placed order any time before the cut-off.', src: '/case/superfine-employee/flows/m-edit.mp4', poster: '/case/superfine-employee/flows/m-edit.jpg', alt: 'Employee app on a phone: editing a placed order, swapping the meal, reviewing and saving the changes' },
              { tag: 'Auto-order', title: 'Auto-Ordering', desc: 'Pick meals and days once, and lunch orders itself.', src: '/case/superfine-employee/flows/m-auto.mp4', poster: '/case/superfine-employee/flows/m-auto.jpg', alt: 'Employee app on a phone: setting up Auto-Order, picking a meal, choosing days and turning it on' },
              { tag: 'Allergens', title: 'Allergens', desc: 'Filter out allergens, and every meal left is one you can eat.', src: '/case/superfine-employee/flows/m-diet.mp4', poster: '/case/superfine-employee/flows/m-diet.jpg', alt: 'Employee app on a phone: filtering out tree nuts and dairy, then keeping vegan meals only' },
            ] },
          ],
        },
        {
          id: 'usability',
          nav: 'Usability',
          title: 'Can everyone use it?',
          blocks: [
            { kind: 'lead', p: 'Tested against WCAG 2.2 AA, by hand with a keyboard and screen reader, then with an automated checker.' },
            { kind: 'impact', items: [
              { num: '16', label: 'Problems found and fixed' },
              { num: '0', label: 'Violations in 36 automated runs' },
              { num: '17', label: 'Screens checked, desktop and phone' },
            ] },
          ],
        },
        {
          id: 'takeaway',
          nav: 'Takeaway',
          illo: 'reading',
          blocks: [
            { kind: 'lead', p: 'Picking a meal was rarely the hard part of ordering lunch. People wanted to know what’s covered, when ordering closes and whether lunch is coming, so the app had to answer those before anyone asked.' },
            { kind: 'notes', items: [
              { t: 'Show the money early', p: 'The allowance sits in the header and the cart splits who pays, so nobody has to wait until checkout to find out.' },
              { t: 'Design for the floor too', p: 'Floor employees only have a phone and can miss a cut-off mid-shift, so every flow had to work just as well there.' },
              { t: 'Prototype in real code', p: 'A clickable prototype got us through 10 feedback rounds in 6 weeks, and developers built from its code.' },
            ] },
          ],
        },
      ],
    },
  },
  {
    title: 'SFK Driver App',
    domain: 'F&B',
    slug: 'sfk-driver-app',
    result: 'Prototyped in three sprints',
    logo: '/logos/superfine-kitchen.png',
    tags: ['Product Design'],
    desc: 'The driver app for a Bay Area office meal service, from the kitchen to the door.',
    short: 'A delivery driver app.', // one line for More Work
    art: { img: '/case/superfine/cover.jpg?v=7', thumb: '/case/superfine/thumb.jpg?v=4', card: '/case/superfine/thumb.jpg?v=4', text: 'Superfine Kitchen', color: '#5a3a52', bg: 'linear-gradient(160deg,#f4d9ec,#efd6f3 50%,#f6dbe6)' },
    // Same structure as Heizen Studio Meetings: why, flows, where it leads. Facts
    // come from the driver prototype (sfk-driver-app: its README, review notes and
    // commit history). The flows are cut from one real recording of that prototype,
    // made with tools/case-video. The longer six-phase version is in git (83b7696).
    study: {
      layout: 'story',
      heading: 'Designing the driver app that gets lunch from one kitchen to every office',
      // TODO(Sai): confirm "I designed and prototyped" matches your part.
      summary: 'Superfine Kitchen cooks in San Francisco and delivers lunch to offices around the Bay Area with its own drivers. At Heizen I designed and prototyped their driver app: the shift from the kitchen to the door, and the hand-offs with dispatch.',
      accent: '#44403c',
      tags: ['Mobile', 'Logistics', 'AI prototyping'],
      role: 'Product Designer',
      scope: ['Driver app'],
      // TODO(Sai): confirm the dates (driver sprints ran Oct 13–30 2026, updates into Nov).
      duration: 'Oct to Nov 2026',
      team: [],
      gallery: [],
      tools: 'Figma, Claude Code',
      sections: [
        {
          id: 'problem',
          nav: 'Why we built it',
          title: 'Hot food and one free hand',
          blocks: [
            { kind: 'lead', p: 'Superfine’s drivers run one to three stops from the kitchen, with bags in their hands and parking, access and setup that change at every office. Hot food has 60 minutes from loading, and dispatch needs to know who is where.' },
            { kind: 'notes', items: [
              { t: 'The job', p: 'See the orders, follow the instructions, navigate, prove the delivery, and let Superfine track them.' },
              { t: 'What we wanted', p: 'One app for the shift, from the kitchen to the door, that dispatch can follow live.' },
            ] },
          ],
        },
        {
          id: 'run',
          nav: 'One delivery',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            // cut from one recording of the prototype, see tools/case-video/cfg-drv-*-raw.json
            { kind: 'flows', label: 'Driver app', items: [
              { tag: 'Kitchen', title: 'Kitchen Pickup', desc: 'Go on duty, scan each packing slip, then slide to confirm the load.', src: '/case/superfine/flows/kitchen.mp4?v=2', poster: '/case/superfine/flows/kitchen.jpg?v=2', alt: 'Driver app: going on duty, scanning packing slips at the kitchen, ticking each order and sliding to confirm' },
              { tag: 'Drive', title: 'Hot Order First', desc: 'The hot order is the first stop, with Google Maps for the way there.', src: '/case/superfine/flows/drive.mp4?v=2', poster: '/case/superfine/flows/drive.jpg?v=2', alt: 'Driver app: the hot order as the first stop, handing off to Google Maps' },
              { tag: 'Door', title: 'At the Door', desc: 'Slide on arrival, then follow the setup steps one at a time.', src: '/case/superfine/flows/door.mp4?v=2', poster: '/case/superfine/flows/door.jpg?v=2', alt: 'Driver app: sliding to arrive, then the setup instructions in order' },
              { tag: 'Proof', title: 'Proof of Delivery', desc: 'Collect the totes, take the proof photo, and the stop is delivered.', src: '/case/superfine/flows/proof.mp4?v=2', poster: '/case/superfine/flows/proof.jpg?v=2', alt: 'Driver app: collecting reusable totes, taking the proof photo and the delivered screen' },
            ] },
          ],
        },
        {
          id: 'leads-to',
          nav: 'Where it leads',
          title: 'From prototype to the real build',
          blocks: [
            { kind: 'lead', p: 'Superfine reviewed a working prototype after each of three sprints, and it’s now the reference for the real build. Still open: texting customers, crew roles on a stop, and what happens after the last stop.' },
          ],
        },
      ],
    },
  },
  {
    title: 'MTB Pay Merchant',
    slug: 'mtb-pay-merchant',
    domain: 'Fintech',
    tags: ['Product Design', 'Payments'],
    desc: 'A merchant wallet for small businesses in Myanmar, built to be fast and clear for shopkeepers who aren’t tech-savvy.',
    short: 'A wallet for small shops.', // one line for More Work
    result: 'A merchant wallet used by 100+ merchants',
    art: { img: '/case/mtb-pay-merchant/cover.jpg', video: '/case/mtb-pay-merchant/hero.mp4?v=5', videoSm: '/case/mtb-pay-merchant/hero-sm.mp4?v=2', poster: '/case/mtb-pay-merchant/hero.jpg?v=4', thumb: '/case/mtb-pay-merchant/thumb.jpg?v=6', card: '/case/mtb-pay-merchant/thumb.jpg?v=6', text: 'MTB Pay', color: '#fff', bg: '#c8121a' },
    // Told as a UI/UX designer's case: Impact, Project Overview, Product Context, UX
    // Challenges, Visual Direction, Design System, Final Interface, Interaction &
    // Takeaway (Edge Cases removed at Sai's request; its screens are still in public/case/mtb-pay-merchant/edge). Visual Direction describes what the real screens show.
    // Facts come from Sai's own case page (smyothu.framer.website/work/spark);
    // screens are from the Figma flows (tools/case-video/out-mtb).
    // TODO(Sai): add the dates and where the app is now.
    study: {
      navTop: false,
      overviewNav: 'Project Overview',
      layout: 'story',
      heading: 'A merchant wallet for shopkeepers, not tech people',
      summary: 'MTB Bank partnered with us to support small businesses in Myanmar by improving its merchant app. The goal was a faster, more intuitive system for people with limited tech skills, one that reinforced trust in MTB’s digital ecosystem.',
      accent: '#44403c',
      tags: ['Fintech', 'Mobile', 'Payments'],
      role: 'UI/UX Designer',
      scope: ['Merchant App'],
      duration: '',
      team: ['3 designers', '11 developers', '2 PMs'],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'impact',
          nav: 'Impact',
          notitle: true,
          blocks: [
            // Merchant app only, not MTB Pay, agents or the bank. 100+ from Sai (Google Play also
            // shows 100+ downloads).
            { kind: 'impact', items: [
              { num: '100+', label: 'Merchants taking payments' },
            ], links: [
              { store: 'play', over: 'Get it on', label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.mtb.merchant' },
              { store: 'apple', over: 'Download on the', label: 'App Store', href: 'https://apps.apple.com/us/app/mtb-pay-merchant/id6756643448' },
            ] },
          ],
        },
        {
          id: 'context',
          nav: 'Product Context',
          illo: 'research',
          blocks: [
            { kind: 'lead', p: 'MTB Bank wanted to support small businesses in Myanmar and build trust in its digital services. Its merchants are SME owners who make transactions every day, and most aren’t tech-savvy.' },
            { kind: 'notes', items: [
              { t: 'What they do in it', p: 'Take payments by QR, top up phones, pay bills, give refunds, and check the balance.' },
              { t: 'What they asked for', p: 'Faster top-ups, clear transaction statuses, and navigation that suits people new to digital tools.' },
            ] },
          ],
        },
        {
          id: 'challenges',
          nav: 'UX Challenges',
          blocks: [
            { kind: 'iconlist', items: [
              { spot: 'hourglass', h: 'Slow transactions', p: 'Outdated systems made everyday payments and top-ups slow.' },
              { spot: 'receipt', h: 'Frequent errors', p: 'Mistakes were common in daily transactions.' },
              { spot: 'money', h: 'Unclear statuses', p: 'Merchants couldn’t always tell what had happened to their money.' },
              { spot: 'phone', h: 'New to digital tools', p: 'Many shopkeepers had little experience with apps, and no time to learn one.' },
            ] },
          ],
        },
        {
          id: 'visual',
          nav: 'Visual Direction',
          blocks: [
            { kind: 'lead', p: 'Built for the counter: one strong colour, big numbers and plain words.' },
            { kind: 'loop', steps: [
              { icon: 'palette', t: 'Colour', p: 'MTB red for actions and the balance, white everywhere else, green for money in and red for money out.' },
              { icon: 'type', t: 'Typography', p: 'One clear typeface, and the amount is the biggest text on every money screen.' },
              { icon: 'layers', t: 'Hierarchy', p: 'The balance first, then money in and out, the four services, and the latest transactions.' },
            ] },
          ],
        },
        {
          id: 'system',
          nav: 'Design System',
          illo: 'juggle',
          blocks: [
            { kind: 'lead', p: 'We built the app on a Figma design system: colour and type styles, components with their states as variants, and a page of documentation for each, made for small screens and busy shops.' },
            { kind: 'shot', src: '/case/mtb-pay-merchant/design-system.avif', alt: 'Design system documentation in Figma: style, usage and properties pages for the components' },
          ],
        },
        {
          id: 'motion',
          nav: 'Design Walkthrough',
          notitle: true,
          blocks: [
            // played from Sai's Figma section "Merchant Scan Consumer QR to Receive Payment"
            // (Section 1.pdf; tools/case-video/mtb-flows.py, cfg-mtb-receive.json, cfg-mtb-pay.json)
            { kind: 'flows', label: 'Merchant app', items: [
              { tag: 'Scan QR', title: 'Scan to Get Paid', desc: 'Scan their QR, set the amount, and wait while they confirm.', src: '/case/mtb-pay-merchant/flows/receive.mp4?v=2', poster: '/case/mtb-pay-merchant/flows/receive.jpg?v=2', alt: 'Merchant app: scanning a customer’s QR, picking 50,000 MMK, adding a remark, confirming the summary, waiting for the customer, the successful payment and sharing the receipt', steps: [{ t: 0, text: 'Scan the customer’s QR' }, { t: 2.77, text: 'The sender and their balance come up' }, { t: 4.07, text: 'Tap an amount' }, { t: 5.42, text: 'Add a remark' }, { t: 8.59, text: 'Check the summary, then confirm' }, { t: 11.16, text: 'Wait while the customer confirms on their phone' }, { t: 13.96, text: 'The customer paid, and it says so' }, { t: 16.53, text: 'Save or share the receipt' }] },
              { tag: 'Pay with QR', title: 'Customer Pays by QR', desc: 'The customer confirms with a PIN, and both phones show it.', src: '/case/mtb-pay-merchant/flows/pay.mp4', poster: '/case/mtb-pay-merchant/flows/pay.jpg', alt: 'MTB Pay wallet: the customer’s Pay With QR, the shop’s payment request, the summary, entering the PIN, Payment Successful and the payment in History', steps: [{ t: 0, text: 'Show your QR at the counter' }, { t: 2.4, text: 'The shop’s request comes in' }, { t: 4.42, text: 'Check who you’re paying, and how much' }, { t: 7.07, text: 'Confirm with your PIN' }, { t: 9.07, text: 'Paid, and the shop sees it' }, { t: 11.84, text: 'Every detail in History' }] },
              { tag: 'Set amount', title: 'Set a QR Amount', desc: 'Type an amount, and the shop’s QR shows it, ready to scan.', src: '/case/mtb-pay-merchant/flows/dyn.mp4', poster: '/case/mtb-pay-merchant/flows/dyn.jpg', alt: 'Merchant app: the shop’s QR, Specify Amount, typing 100,000 and the QR showing 100,000 MMK', steps: [{ t: 0, text: 'Open the shop’s QR' }, { t: 2.85, text: 'Add an amount to it' }, { t: 4.75, text: 'Type the amount' }, { t: 7.25, text: 'Confirm, and the QR asks for it' }] },
              { tag: 'Fund out', title: 'Fund Out to an Agent', desc: 'Move money to a Super Agent, with a PIN and an SMS code.', src: '/case/mtb-pay-merchant/flows/fund.mp4', poster: '/case/mtb-pay-merchant/flows/fund.jpg', alt: 'Merchant app: eMoney, scanning a Super Agent’s QR, choosing 500,000, the summary, PIN, SMS code, success and sharing the receipt', steps: [{ t: 0, text: 'Open eMoney' }, { t: 1.57, text: 'Fund out to a Super Agent' }, { t: 4.41, text: 'Scan the agent’s QR' }, { t: 6.63, text: 'Pick an amount, add a remark' }, { t: 11.6, text: 'Check the summary' }, { t: 14.1, text: 'Confirm with your PIN' }, { t: 16.42, text: 'Then the code sent by SMS' }, { t: 18.82, text: 'Done, with a receipt' }, { t: 22.29, text: 'Share it' }] },
              { tag: 'Refund', title: 'Refund a Payment', desc: 'Find the payment, give a reason, and confirm with a PIN.', src: '/case/mtb-pay-merchant/flows/refund.mp4', poster: '/case/mtb-pay-merchant/flows/refund.jpg', alt: 'Merchant app: Refund, searching a transaction number, the payment, typing a reason, the summary, PIN, success and sharing the receipt', steps: [{ t: 0, text: 'Open Refund' }, { t: 1.57, text: 'Find the payment by its number' }, { t: 5.64, text: 'Check the payment, then refund' }, { t: 8.04, text: 'Give a reason' }, { t: 11.61, text: 'Check the summary' }, { t: 13.91, text: 'Confirm with your PIN' }, { t: 16.21, text: 'Refunded, with a receipt' }, { t: 19.68, text: 'Share it' }] },
              { tag: 'Pay bill', title: 'Pay a YESC Bill', desc: 'Enter the barcode, check the bill, and pay with a PIN.', src: '/case/mtb-pay-merchant/flows/bill.mp4', poster: '/case/mtb-pay-merchant/flows/bill.jpg', alt: 'Merchant app: Pay Bill, Electricity Bill, YESC and barcode, the full bill summary, PIN, success and the bill in History', steps: [{ t: 0, text: 'Pick the bill' }, { t: 1.77, text: 'Choose YESC, enter the barcode' }, { t: 6.24, text: 'Check the whole bill' }, { t: 9.94, text: 'Confirm with your PIN' }, { t: 12.24, text: 'Paid' }, { t: 14.41, text: 'Every detail in History' }] },
              { tag: 'Top up', title: 'Phone Top Up', desc: 'Type the number, pick an amount, and confirm with a PIN.', src: '/case/mtb-pay-merchant/flows/topup.mp4', poster: '/case/mtb-pay-merchant/flows/topup.jpg', alt: 'Merchant app: typing a phone number, choosing 1,000, the summary, PIN, success, saving the receipt and History', steps: [{ t: 0, text: 'Type the number' }, { t: 2.6, text: 'Pick an amount' }, { t: 4.92, text: 'Check the summary' }, { t: 7.22, text: 'Confirm with your PIN' }, { t: 9.52, text: 'Topped up' }, { t: 10.82, text: 'Save the receipt' }, { t: 12.52, text: 'Every detail in History' }] },
            ] },
          ],
        },
        {
          id: 'takeaway',
          nav: 'Takeaway',
          illo: 'idea',
          blocks: [
            { kind: 'lead', p: 'Empathy-driven design starts by listening. When we build for real needs, we create tools that improve lives, not just technology that works.' },
          ],
        },
      ],
    },
  },
  {
    title: 'Retina AI',
    slug: 'retina-ai',
    domain: 'AI',
    tags: ['Product Design', 'Food Data'],
    desc: 'End to end product design for Compass Group: the review workspaces where nutritionists and article experts turn AI label data into profiles they can stand behind.',
    short: 'Reviewing AI food label data.', // one line for More Work
    art: { img: '/case/retina-ai/cover.jpg', thumb: '/case/retina-ai/thumb.jpg', card: '/case/retina-ai/card.jpg', text: 'Retina AI', color: '#fff', bg: '#b67d17' },
    // Facts come from the prototype in compass-ui-ux-designs/retina: its screens,
    // routes and mock data. No research, results or team roles are claimed
    // because the repo doesn't record them.
    // TODO(Sai): add the dates, the team, where it is now and What I learned.
    study: {
      layout: 'story',
      heading: 'Designing how a food label becomes a profile people can trust',
      summary: 'Retina.AI is Compass Group’s food article intelligence platform. AI reads the label on each product, then a nutritionist and an Article SME check the allergens, ingredients and nutrition before the profile goes to Cookbook.',
      accent: '#44403c',
      tags: ['B2B', 'AI review', 'Food data'],
      role: 'Product Designer, end to end',
      scope: ['Nutritionist review', 'Article SME workspace'],
      duration: '',
      team: [],
      gallery: [],
      tools: 'Figma, Magic Patterns',
      sections: [
        {
          id: 'product',
          eyebrow: 'Overview',
          nav: 'The product',
          title: 'One article, two kinds of expert',
          blocks: [
            { kind: 'lead', p: 'AI can read a food label in moments, but someone has to be able to stand behind what it found. I designed the two workspaces where that happens: one for the nutritionist and one for the Article SME.' },
            { kind: 'shot', wide: true, src: '/case/retina-ai/dashboard.jpg', alt: 'Nutritionist dashboard with a banner for articles pending review, a note about articles updated by the Article SME, and summary counts', caption: 'The nutritionist’s dashboard opens on what needs attention.' },
          ],
        },
        {
          id: 'role',
          eyebrow: 'Overview',
          nav: 'My role',
          illo: 'shipping',
          blocks: [
            { kind: 'role', items: [
              { h: 'Product', items: ['The flow from AI extraction to approval', 'How the two roles hand work over'] },
              { h: 'Design', items: ['Dashboards and review queues', 'The article review screen', 'Catalog and audit log'] },
              { h: 'Prototype', items: ['A working prototype of both workspaces', 'Real packaging photos in the mock data'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'users',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Who it serves',
          blocks: [
            { kind: 'segments', items: [
              { h: 'Nutritionist', sub: 'Clinical review', items: ['Checks what the AI extracted', 'Validates ingredients and allergens', 'Approves the profile'] },
              { h: 'Article SME', sub: 'Catalog and audit', items: ['Triages the review queue', 'Manages the catalog', 'Audits changes across sites'] },
            ] },
          ],
        },

        // ---- Define -----------------------------------------------------
        {
          id: 'problems',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'What it had to handle',
          illo: 'juggle',
          blocks: [
            { kind: 'iconlist', items: [
              { h: 'Allergens leave no room for a guess', p: 'AI can read a label quickly, but a person has to stand behind the result before it goes anywhere.' },
              { h: 'Not every article needs the same attention', p: 'Some are ready to go, some need a closer look and some need fixing. A single long list hides that.' },
              { h: 'The answer is on the pack', p: 'Checking means comparing the extracted data with the label itself, again and again, for every article.' },
              { h: 'One article, several hands', p: 'An article can move between the nutritionist and the SME and back again, and each of them needs to see what changed.' },
            ] },
          ],
        },

        // ---- Explore ----------------------------------------------------
        {
          id: 'review',
          eyebrow: 'Explore',
          group: 'Design',
          nav: 'Clinical review',
          title: 'Put the data next to the label',
          blocks: [
            { kind: 'lead', p: 'A nutritionist’s job is to compare what the AI extracted with what the pack actually says, so the screen puts both side by side.' },
            { kind: 'shot', wide: true, src: '/case/retina-ai/review.jpg', alt: 'Review screen with the task list on the left, allergens and nutrients in the middle, and a photo of the pack with thumbnails on the right', caption: 'The queue, the extracted data and the pack in one view.' },
            { kind: 'notes', items: [
              { t: 'Queues by what’s needed', p: 'Work is split into Ready To Cookbook, To Review, To Fix and From SME, so the nutritionist knows what kind of attention each article needs.' },
              { t: 'Confidence up front', p: 'The AI’s confidence sits beside the article name, before any of the data.' },
              { t: 'Contains and may contain', p: 'Allergens definitely on the label and possible traces from the factory line are two separate lists.' },
              { t: 'Every side of the pack', p: 'Front, back, side and barcode photos stay one click away.' },
              { t: 'A way out', p: 'When a label can’t be trusted, Request Re-scan sits right beside Approve & Push.' },
            ] },
          ],
        },
        {
          id: 'catalog',
          eyebrow: 'Explore',
          group: 'Design',
          nav: 'Catalog and audit',
          title: 'Keep everyone working from the same list',
          blocks: [
            { kind: 'lead', p: 'The Article SME works across sites. The review screen matches the nutritionist’s, so an article looks the same whoever opens it.' },
            { kind: 'shot', wide: true, src: '/case/retina-ai/sme.jpg', alt: 'Article SME task screen with the article list, the ingredients table with allergen flags, and a pack photo', caption: 'The Article SME’s review, with ingredients and their allergen flags.' },
            { kind: 'shot', wide: true, src: '/case/retina-ai/sme-dashboard.jpg', alt: 'Article SME dashboard with totals, a weekly chart of articles reviewed and a note about articles needing attention', caption: 'The SME’s dashboard shows the week’s reviews and what needs attention.' },
            { kind: 'notes', items: [
              { t: 'A fixed vocabulary', p: 'A read-only catalog holds 18 allergens and 22 nutrients, each with a code.' },
              { t: 'Changes show up', p: 'When the SME edits an article, it reaches the nutritionist tagged SME Updated, with its own From SME queue.' },
              { t: 'A record of edits', p: 'The audit log covers ingredients, nutrition, allergens and claims: what changed, who changed it and when.' },
            ] },
          ],
        },
      ],
    },
  },
  {
    title: 'Merchant Experience',
    slug: 'merchant-experience',
    domain: 'Fintech',
    tags: ['Product Design', 'Fintech'],
    desc: 'A secure portal for one large MTB Bank partner: live transactions, refunds, settlements and API access in one place.',
    short: 'A bank partner’s merchant portal.', // one line for More Work
    art: { img: '/case/merchant-experience/cover.jpg?v=2', thumb: '/case/merchant-experience/thumb.jpg?v=12', card: '/case/merchant-experience/card.jpg?v=3', text: 'Merchant Experience', color: '#fff', bg: '#7c0a10' },
    // Facts come from Sai's page (smyothu.framer.website/work/merchant-portal-copy-copy);
    // screens are from the Figma boards in Merchant Portal.zip (tools/case-video/out-portal).
    // Same structure as the driver app: why, flows, where it leads. The longer version is in git (83b7696).
    // TODO(Sai): add the dates.
    study: {
      layout: 'story',
      heading: 'Secure merchant management',
      summary: 'MTB Bank developed a Merchant Portal for a single large-scale partner. It gives them live transaction monitoring, refund handling, API access and reporting, and full control over digital payments without relying on manual communication.',
      accent: '#44403c',
      tags: ['B2B', 'Web portal', 'Payments'],
      role: 'UX/UI Designer',
      scope: ['Merchant Portal'],
      duration: '',
      team: ['3 designers', '11 developers', '2 PMs'],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'problem',
          nav: 'Why we built it',
          title: 'Spreadsheets and email threads',
          blocks: [
            { kind: 'lead', p: 'The merchant tracked transactions and processed refunds through spreadsheets and email, which caused delays and confusion. We worked closely with MTB’s partner team and the merchant, and they asked for three things: real-time data, exportable reports and smooth refund handling.' },
            { kind: 'notes', items: [
              { t: 'Before', p: 'Spreadsheets for tracking, email for refunds.' },
              { t: 'What we wanted', p: 'One secure place with better visibility, and less back and forth.' },
            ] },
          ],
        },
        {
          id: 'run',
          nav: 'The portal',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            // the Figma screens from Merchant Portal.zip, see tools/case-video/portal-flows.py
            { kind: 'flows', device: 'browser', label: 'Merchant portal', items: [
              { tag: 'Sign in', title: 'Sign In', p: 'Sign in with a user ID and PIN, then confirm with a code sent by SMS.', src: '/case/merchant-experience/flows/login.mp4?v=2', poster: '/case/merchant-experience/flows/login.jpg?v=2', alt: 'Sign in with user ID and PIN, the SMS verification code, the welcome screen and the dashboard' },
              { tag: 'Dashboard', title: 'Dashboard', p: 'Open the balance and growth charts, by day, month or year.', src: '/case/merchant-experience/flows/dash.mp4?v=3', poster: '/case/merchant-experience/flows/dash.jpg?v=3', alt: 'The dashboard opening its charts, then switching from daily to monthly and yearly' },
              { tag: 'Transactions', title: 'Transactions', p: 'Scroll across every column, then filter the table.', src: '/case/merchant-experience/flows/tx.mp4?v=2', poster: '/case/merchant-experience/flows/tx.jpg?v=2', alt: 'Scrolling across the Transaction History table and opening the filter panel' },
              { tag: 'Refunds', title: 'Refunds', p: 'Open a payment, give a reason, and confirm the refund with a PIN.', src: '/case/merchant-experience/flows/refund.mp4?v=2', poster: '/case/merchant-experience/flows/refund.jpg?v=2', alt: 'Refund list, a payment’s detail, typing a reason, the PIN dialog and the updated list' },
              { tag: 'Settlement', title: 'Settlement', p: 'Enter an amount, confirm with a PIN, and see the balances update.', src: '/case/merchant-experience/flows/fund.mp4?v=3', poster: '/case/merchant-experience/flows/fund.jpg?v=3', alt: 'From the dashboard to Fund Settlement, entering an amount, the PIN dialog and Successfully Transferred' },
              { tag: 'API keys', title: 'API Keys', p: 'Generate a key, then save and copy it.', src: '/case/merchant-experience/flows/api.mp4?v=2', poster: '/case/merchant-experience/flows/api.jpg?v=2', alt: 'No API keys yet, generating one, saving and copying it, and the key in the list' },
            ] },
          ],
        },
        {
          id: 'leads-to',
          nav: 'Where it leads',
          title: 'Less waiting, more control',
          blocks: [
            { kind: 'lead', p: 'The portal reduced communication delays and improved refund processing time. Live tracking and API tools streamlined both support and integration work for the merchant.' },
          ],
        },
      ],
    },
  },
  {
    title: 'Heizen Studio',
    name: 'Heizen Studio Meetings',
    slug: 'heizen-studio',
    domain: 'AI',
    tags: ['Product Design', 'AI', 'SaaS'],
    desc: 'Bringing meetings into Heizen’s delivery platform, so calls stop living in a separate tool.',
    short: 'Meetings inside a delivery platform.', // one line for More Work
    art: { img: '/case/heizen-studio/cover.jpg?v=3', thumb: '/case/heizen-studio/thumb.jpg?v=3', card: '/case/heizen-studio/card.jpg', text: 'Heizen Studio', color: '#fff', bg: '#3a4196' },
    // Screens are Sai's Figma designs (~/Downloads/Meeting.pdf). TODO(Sai): check
    // this copy, add dates, team and real results.
    study: {
      layout: 'story',
      heading: 'Bringing meetings into the platform where the work happens',
      summary: 'Heizen Studio is the workspace Heizen uses to deliver client software, from the first meeting to the last test case. It had no meetings feature, so we ran our calls through Granola, outside the platform. I designed Meetings to bring them in.',
      accent: '#44403c',
      tags: ['B2B', 'Internal tool', 'AI'],
      role: 'Product Designer',
      scope: ['Meetings'],
      duration: '',
      team: [],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'problem',
          nav: 'Why we built it',
          title: 'Our calls lived in another tool',
          blocks: [
            { kind: 'lead', p: 'Projects in Heizen Studio start with a conversation. But the platform had nowhere to put one, so we used Granola, and what was decided stayed outside, away from the requirements and sprints it belonged to.' },
            { kind: 'notes', items: [
              { t: 'Before', p: 'Calls in Granola, delivery work in Heizen Studio.' },
              { t: 'What we wanted', p: 'Meetings in the same workspace as everything they lead to.' },
            ] },
          ],
        },
        {
          id: 'run',
          nav: 'Running a call',
          group: 'Design Execution',
          notitle: true,
          blocks: [
            // screens from Sai's Figma file (Meeting.pdf), see tools/case-video/meet-flows.py
            { kind: 'flows', device: 'browser', label: 'Running a call', items: [
              { tag: 'Overview', title: 'Overview', p: 'Step through today, yesterday and tomorrow from the Meeting List.', src: '/case/heizen-studio/flows/dash.mp4', poster: '/case/heizen-studio/flows/dash.jpg', alt: 'The projects dashboard with the Meeting List open, moving from today to yesterday and tomorrow' },
              { tag: 'Start', title: 'Start Meeting', p: 'The bot joins, you keep private notes, and AI writes the notes.', src: '/case/heizen-studio/flows/start.mp4', poster: '/case/heizen-studio/flows/start.jpg', alt: 'Starting a meeting from the dashboard, recording it, generating insights and the AI notes' },
              { tag: 'Review', title: 'Past Meeting', p: 'Open a meeting record for its notes, the full transcript and the recording.', src: '/case/heizen-studio/flows/review.mp4', poster: '/case/heizen-studio/flows/review.jpg', alt: 'Opening a completed meeting from the Meeting List, its notes, then its transcript and recording' },
              { tag: 'From a link', title: 'From a Link', p: 'Paste a link, then send the bot, record audio, or upload later.', src: '/case/heizen-studio/flows/anywhere.mp4', poster: '/case/heizen-studio/flows/anywhere.jpg', alt: 'Starting a new meeting from a pasted link, recording it and getting the notes and transcript' },
            ] },
          ],
        },
        {
          id: 'projects',
          nav: 'Inside projects',
          group: 'Design Execution',
          notitle: true,
          blocks: [
            { kind: 'flows', device: 'browser', label: 'Meetings inside projects', items: [
              { tag: 'From a project', title: 'From a Project', p: 'A call started in a project is filed there, with a live transcript.', src: '/case/heizen-studio/flows/project.mp4', poster: '/case/heizen-studio/flows/project.jpg', alt: 'A project’s Meetings page, starting a call with a live transcript, then the notes and recording' },
              { tag: 'Auto-assign', title: 'Auto-Assign', p: 'Add a client’s email once, and every meeting with them lands in the project.', src: '/case/heizen-studio/flows/assign.mp4', poster: '/case/heizen-studio/flows/assign.jpg', alt: 'Adding a client email on a project’s Meetings page and confirming it' },
              { tag: 'Move', title: 'Move Meeting', p: 'Filed in the wrong place? Move it to another project from its menu.', src: '/case/heizen-studio/flows/move.mp4', poster: '/case/heizen-studio/flows/move.jpg', alt: 'Moving a meeting to another project from its menu' },
              { tag: 'Wiki', title: 'Save to Wiki', p: 'Turn a meeting’s notes into a wiki page in one click.', src: '/case/heizen-studio/flows/wiki.mp4', poster: '/case/heizen-studio/flows/wiki.jpg', alt: 'Saving a meeting’s notes as a wiki page' },
              { tag: 'Tag', title: 'Tag Meeting', p: 'Tag a call by type, and give each tag its own colour.', src: '/case/heizen-studio/flows/tag.mp4', poster: '/case/heizen-studio/flows/tag.jpg', alt: 'Adding and editing tags on a meeting, with a colour for each' },
            ] },
          ],
        },
        {
          id: 'leads-to',
          nav: 'Where it leads',
          title: 'From meeting to requirement',
          blocks: [
            { kind: 'lead', p: 'Heizen Studio’s promise is from meeting to test case, in one workspace. Meetings is the first step of that: calls are recorded, and their decisions turn into requirement documents, which become stories, then test cases.' },
          ],
        },
      ],
    },
  },
  {
    title: 'OrderFlow Landing Page',
    slug: 'orderflow-landing',
    domain: 'F&B',
    tags: ['Web Design', 'Landing Page'],
    desc: 'The site that explains OrderFlow to café and restaurant owners, and asks them to try it.',
    short: 'A landing page for café owners.', // one line for More Work
    art: { img: '/case/orderflow-landing/cover.jpg?v=3', thumb: '/case/orderflow-landing/thumb.jpg?v=3', card: '/case/orderflow-landing/thumb.jpg?v=3', text: 'OrderFlow', color: '#fff', bg: '#f28a1c' },
    // The copy describes what the live site says (orderflowmm.com/en, 8 Nov 2026). The clips are
    // recordings of it, see tools/case-video/lp-record.mjs; the pilot request is never sent. TODO(Sai): confirm the role, add the
    // dates, team, tools, and any real results.
    study: {
      layout: 'story',
      heading: 'One page, one ask: try it at one outlet',
      summary: 'OrderFlow is QR ordering for cafés and restaurants in Myanmar. This is the site that explains it to owners, in English and Burmese, and asks them to join a free pilot at one of their outlets.',
      accent: '#44403c',
      tags: ['Web', 'Landing page', 'F&B'],
      role: 'Designer',
      scope: ['Landing page'],
      duration: '',
      team: [],
      gallery: [],
      tools: '',
      sections: [
        {
          id: 'problem',
          nav: 'Why we built it',
          title: 'A low-risk first step',
          blocks: [
            { kind: 'lead', p: 'Owners need to see how QR ordering works, and know it won’t disrupt their shop, before they’ll try it. So the page leads with a pilot: OrderFlow sets up the menu, tables and QR codes for free at one outlet and trains the team.' },
            { kind: 'notes', items: [
              { t: 'The audience', p: 'Café and F&B owners, who have no time to configure new software.' },
              { t: 'What we wanted', p: 'Clear answers on how it works and what it takes, then one thing to do: apply for the pilot.' },
            ] },
          ],
        },
        {
          id: 'run',
          nav: 'The page',
          group: 'Design Walkthrough',
          notitle: true,
          blocks: [
            { kind: 'flows', device: 'browser', label: 'OrderFlow website', items: [
              { tag: 'Pilot request', title: 'Pilot Request', p: 'Apply in three steps: about you, your venue, and the pilot.', src: '/case/orderflow-landing/flows/pilot.mp4?v=4', poster: '/case/orderflow-landing/flows/pilot.jpg?v=4', alt: 'Opening Apply for the Pilot and filling in the three-step form, up to Send application' },
              { tag: 'Home', title: 'Home', p: 'The whole page, from the offer to the final call to action.', src: '/case/orderflow-landing/flows/home.mp4?v=3', poster: '/case/orderflow-landing/flows/home.jpg?v=3', alt: 'Scrolling the OrderFlow home page from top to bottom' },
              { tag: 'Partnership', title: 'Partnership', p: 'What the pilot includes, and how it runs in five steps.', src: '/case/orderflow-landing/flows/partner.mp4?v=3', poster: '/case/orderflow-landing/flows/partner.jpg?v=3', alt: 'Scrolling the Pilot Partnership page from top to bottom' },
              { tag: 'Pricing', title: 'Pricing', p: 'OrderFlow’s plans and pricing.', src: '/case/orderflow-landing/flows/pricing.mp4?v=3', poster: '/case/orderflow-landing/flows/pricing.jpg?v=3', alt: 'Scrolling the pricing page from top to bottom' },
              { tag: 'About', title: 'About', p: 'The story behind OrderFlow, and its mission and vision.', src: '/case/orderflow-landing/flows/about.mp4?v=3', poster: '/case/orderflow-landing/flows/about.jpg?v=3', alt: 'Scrolling the About page from top to bottom' },
              { tag: 'FAQs', title: 'FAQs', p: 'Questions owners ask before they try it.', src: '/case/orderflow-landing/flows/faqs.mp4?v=3', poster: '/case/orderflow-landing/flows/faqs.jpg?v=3', alt: 'Scrolling the FAQs page from top to bottom' },
            ] },
          ],
        },
        {
          id: 'leads-to',
          nav: 'Where it leads',
          title: 'From the page to a pilot',
          blocks: [
            { kind: 'lead', p: 'The page is live at orderflowmm.com. Each pilot ends with the owner and OrderFlow reviewing the results together, using feedback from staff and customers.' },
          ],
        },
      ],
    },
  },
  {
    title: 'Heizen Supply Chain',
    name: 'Heizen Discovery Tool',
    slug: 'heizen-supply-chain',
    domain: 'Supply Chain',
    tags: ['Product Design', 'Supply Chain'],
    desc: 'A discovery tool that gets a Heizen consultant ready for a first client call, in minutes.',
    short: 'Prep for a first client call.', // one line for More Work
    art: { img: '/case/heizen-supply-chain/cover.jpg', thumb: '/case/heizen-supply-chain/thumb.jpg', card: '/case/heizen-supply-chain/card.jpg', text: 'Heizen Discovery Tool', color: '#2A2A2A', bg: 'linear-gradient(160deg,#f8f6ef,#efebe2)' },
    // Same six-phase structure as the Superfine cases. Facts come from the
    // heizen-supply-chain repo: CLAUDE.md, DECISIONS.md, REDESIGN.md (17 Aug
    // 2026), AUDIT.md (8 Aug 2026) and the Suvarna mock data. The intro film
    // uses the product's own Brand theme (cream, graphite, dusty teal).
    study: {
      layout: 'story',
      heading: 'Designing a discovery tool for the minutes before a client call',
      summary: 'Heizen sells supply chain software to Indian manufacturers. Before a first call, a consultant has a company name and very little time. The Heizen Discovery Tool turns research into what we would build, a thirty-second brief, an operation map, gaps and the questions to ask. I designed it, and Jeet built it.',
      accent: '#44403c',
      tags: ['B2B', 'Sales tool', 'Supply Chain'],
      role: 'Product Designer',
      scope: ['What to build', 'Research brief', 'Operations map', 'Gaps, Questions, Atlas'],
      // TODO(Sai): confirm the start date (audit 8 Aug, redesign 17 Aug, target end of Aug 2026).
      duration: 'Jul to Aug 2026',
      team: ['Sai, design', 'Aman, Abhilasha, Jeet, feedback', 'Jeet, build'],
      gallery: [],
      tools: 'Figma, Claude Code',
      sections: [
        {
          id: 'impact',
          eyebrow: 'Overview',
          nav: 'Impact',
          title: 'Four discovery calls, compressed into one',
          blocks: [
            { kind: 'lead', p: 'The tool opens on what Heizen would build for the client, and everything that argues for it is one click away.' },
            { kind: 'notes', items: [
              { t: 'Honest numbers', p: 'After a practitioner audit, the headline fell 38%, from ₹14.7 Cr to ₹9.1 Cr a year. It has the advantage of being true.' },
              { t: 'Less to read', p: 'Words on screen cut from 9,244 to about 5,200. Gaps went from 830 words to 263.' },
              { t: 'Readable', p: 'A 7:1 contrast floor, for a reader who is not twenty-five.' },
            ] },
          ],
        },
        {
          id: 'role',
          eyebrow: 'Overview',
          nav: 'My role',
          illo: 'shipping',
          blocks: [
            { kind: 'role', items: [
              { h: 'Execution', items: ['Every screen and flow', 'The Heizen Brand theme', 'Coded prototype with Claude'] },
              { h: 'Collaboration', items: ['Feedback from Aman, Abhilasha, Jeet', 'Jeet on the build'] },
              { h: 'Research', items: ['The consultant’s day before a call', 'A supply chain practitioner audit'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'background',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Why this tool',
          illo: 'research',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Overview', p: 'Heizen’s internal supply chain discovery platform, and a sales tool that happens to be built out of research.' },
              { t: 'How it starts', p: 'A consultant enters a company, its sector and anyone they know there.' },
              { t: 'What comes out', p: 'What we would build, a research dossier, an operation map, ranked gaps and call questions.' },
              { t: 'Objective', p: 'Compress four discovery calls into one.' },
            ] },
          ],
        },
        {
          id: 'users',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Target users',
          blocks: [
            { kind: 'segments', items: [
              { h: 'Consultants', illo: 'employee', sub: 'Like Aryan, the archetype', items: ['Minutes before a call', 'Sometimes on a phone', 'Not a supply chain expert'] },
              { h: 'Investors and clients', illo: 'owner', sub: 'At demos', items: ['Want the point fast', 'Need numbers they can trust', 'Look for proof it worked before'] },
            ] },
          ],
        },

        // ---- Define -----------------------------------------------------
        {
          id: 'problems',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'Problem spaces',
          illo: 'juggle',
          blocks: [
            { kind: 'iconlist', items: [
              { h: 'Overwhelm', p: 'There was a lot of information shown everywhere.' },
              { h: 'Numbers without a base', p: 'Savings appeared with nothing to compare them to.' },
              { h: 'Green by default', p: 'Parts of the operation nobody had looked at still looked healthy.' },
              { h: 'The answer was buried', p: 'What Heizen would actually sell sat somewhere inside a map and a dossier.' },
            ] },
          ],
        },
        {
          id: 'audit',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'Practitioner audit',
          title: 'An audit that cut our own headline',
          blocks: [
            { kind: 'lead', p: 'On 8 August a supply chain practitioner went through the numbers. Most of what they found made the tool look less impressive, and more believable.' },
            { kind: 'table', cols: ['What the audit found', 'What we changed'], rows: [
              ['The top gap was priced at ₹3.2 Cr, against an AP function of about ₹0.6 Cr', 'Re-priced from the size of the function'],
              ['Overlapping savings were added together', 'Show gross and net, because savings do not add'],
              ['Cash, margin and balance sheet money were mixed', 'Name each kind: cost avoided, margin gained, carrying cost released'],
              ['Unresearched stages showed as green', 'Not looked at gets its own mark'],
            ] },
          ],
        },

        // ---- Explore ----------------------------------------------------
        {
          id: 'choices',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Design choices',
          title: 'Lead with the answer',
          blocks: [
            { kind: 'lead', p: 'The first thing a consultant needs from a new client is what we would sell them. Everything else argues for it.' },
            { kind: 'choices', device: 'browser', items: [
              { h: 'What to build, first', p: 'Opening a project lands on three ranked builds, each with its value and effort.', src: '/case/heizen-supply-chain/choice-build.jpg', alt: 'What to build: 3 builds worth ₹5.3 Cr a year, ranked, each with effort and past projects' },
              { h: 'Health and evidence apart', p: 'Colour says how a stage is running. Fill and outline say how much we know.', src: '/case/heizen-supply-chain/choice-map.jpg', alt: 'Operations map, processes under Source, with health colours and evidence marks' },
              { h: 'Proof it worked before', p: 'Atlas shows which past Heizen project already proves the fix.', src: '/case/heizen-supply-chain/choice-atlas.jpg', alt: 'Atlas: supply chain domains with how many sub-processes Heizen has proven, and the past projects behind them' },
            ] },
          ],
        },
        {
          id: 'rules',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Rules on every screen',
          blocks: [
            { kind: 'notes', items: [
              { t: 'A comparator', p: 'Every number comes with something to compare it to.' },
              { t: 'A base', p: 'Every price shows what it was worked out from.' },
              { t: 'Empty is normal', p: 'A blank stage says it hasn’t been looked at, not that it’s fine.' },
              { t: 'Correct by asking', p: '“Needs correction” opens a prompt to the AI. There is no manual editing.' },
            ] },
          ],
        },
        {
          id: 'ai',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Designing with AI',
          illo: 'idea',
          blocks: [
            { kind: 'lead', p: 'I built the prototype with Claude Code, so every review ran on a working tool, and a script checked density, contrast and data after each change.' },
            { kind: 'notes', items: [
              { t: 'Ask Helix', p: 'The AI assistant sits in a side panel. Select any text and ask about it.' },
              { t: 'Checks in the repo', p: 'Scripts count the words on each screen and verify the data still adds up.' },
              { t: 'These demos', p: 'Recorded from the prototype by a script, not mocked up.' },
            ] },
          ],
        },

        // ---- Test -------------------------------------------------------
        {
          id: 'redesign',
          eyebrow: 'Test',
          group: 'Test',
          nav: 'Redesign',
          title: 'Discovery is three jobs, not one screen',
          blocks: [
            { kind: 'lead', p: 'After feedback from Aman, Abhilasha and Jeet, I split discovery into the three moments a consultant actually lives through.' },
            { kind: 'table', cols: ['Stage', 'What the tool gives them'], rows: [
              ['First call', 'An intro agenda and the questions to open with'],
              ['Second call', 'Follow-ups by stakeholder, and data requests'],
              ['Expansion', 'Built before: the closest past projects, side by side'],
            ] },
          ],
        },

        // ---- Ship -------------------------------------------------------
        {
          id: 'walkthrough',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Design walkthrough',
          blocks: [
            { kind: 'demo', device: 'browser', src: '/case/heizen-supply-chain/web.mp4', poster: '/case/heizen-supply-chain/web.jpg', alt: 'Screen recording of the Heizen Discovery Tool for Suvarna Agro Foods: what to build, research, operations, gaps, questions, Atlas, compare and Ask Helix', steps: [
              { t: 0.26, text: 'What we’d build' },
              { t: 5.39, text: 'Research brief' },
              { t: 10.61, text: 'Operation map' },
              { t: 19.06, text: 'Gaps and effort' },
              { t: 27.18, text: 'Questions for the call' },
              { t: 32.21, text: 'Proven fixes in Atlas' },
              { t: 37.43, text: 'Built before' },
              { t: 42.65, text: 'Ask Helix anything' },
            ] },
          ],
        },

        // ---- Improve ----------------------------------------------------
        {
          id: 'next',
          eyebrow: 'Improve',
          group: 'Improve',
          nav: 'What’s next',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Make', p: 'The audit found no coverage for manufacturing. That research comes next.' },
              { t: 'Stable by end of August', p: 'The target for a version the team can take into real calls.' },
            ] },
          ],
        },
        {
          id: 'learned',
          eyebrow: 'Improve',
          group: 'Improve',
          nav: 'What I learned',
          illo: 'reading',
          blocks: [
            { kind: 'lead', p: 'The best change I made was taking a third of our headline away. A smaller number someone believes sells more than a big one they don’t.' },
          ],
        },
      ],
    },
  },
]

// The three main projects, shown as large cards at the top of the home page.
export const HOME_WORK = ['orderflow', 'superfine-employee', 'mtb-pay-merchant']
// The fan of cards in the home page's More Work card; the middle one sits in front.
export const MORE_WORK = ['orderflow-landing', 'sfk-driver-app', 'merchant-experience']

// Testimonials on the home page. Use real quotes only, with the person's
// permission. `photo` is optional (initials show otherwise), e.g.
// '/people/aung.jpg' in /public. `placeholder: true` marks entries that are
// still samples; they are never shown on the site.
// The `placeholder` entries are fictional, for layout only, and never show.
export const TESTIMONIALS = [
  {
    quote: 'You have a strong work ethic. You always follow through on your word, and you take full accountability for what you do.',
    name: 'Aman Arora',
    role: 'Co-founder & CEO, Heizen',
    photo: '/people/aman-arora.jpg',
  },
  {
    quote: 'Your designs really impress me, and you work extremely fast. On several occasions, you’ve been the one who saved the team.',
    name: 'Pedrom Rejai',
    role: 'Founder & Principal, Elevate Growth Partner',
    photo: '/people/pedrom-rejai.jpg',
  },
  {
    quote: 'You’re an absolute powerhouse. Superfine’s success on the admin and customer sides is a direct result of you going above and beyond.',
    name: 'Haard Shah',
    role: 'Senior Software Engineer, Heizen',
    photo: '/people/haard-shah.jpg',
  },
  {
    quote: 'I had the best time working with you. I could fully trust your decision making and design, knowing you’d always produce the best.',
    name: 'Sheldon Dcosta',
    role: 'Senior Product Manager, Heizen',
    photo: '/people/sheldon-dcosta.jpg',
  },
  {
    quote: 'Sai turned a messy ordering process into something our staff understood on day one. He spent time on the floor with us before he designed a single screen, and it shows.',
    name: 'May Thandar',
    role: 'Café owner, Yangon',
    photo: null,
    placeholder: true,
  },
  {
    quote: 'He asks the questions nobody else thinks to ask. Our meal-ordering flow went from three confusing steps to one clear screen, and support tickets dropped right after launch.',
    name: 'Daniel Reyes',
    role: 'Operations Lead, food-service company',
    photo: null,
    placeholder: true,
  },
  {
    quote: 'Clear thinking, fast iterations and honest feedback. Sai is the kind of designer engineers actually enjoy working with, because every decision comes with a reason.',
    name: 'Htet Aung',
    role: 'Senior Frontend Engineer',
    photo: null,
    placeholder: true,
  },
  {
    quote: 'Working with Sai felt like having a product partner, not just a designer. He kept the business goal in view the whole time and pushed back when it mattered.',
    name: 'Priya Nair',
    role: 'Product Manager, fintech startup',
    photo: null,
    placeholder: true,
  },
]

// Intro under the "Projects" heading; `question` renders a shade darker.
export const OTHERS_INTRO = {
  text: 'Fintech, Supply Chain, AI,',
  question: 'different domains, same approach.',
}

// About page.
export const ABOUT = {
  // One entry per line.
  headline: ['I design with a founder’s mindset:', 'understand the people and the business first,', 'then make it simple to use.'],
  bio: [
    'I’m 23, co-founder of OrderFlow, helping F&B businesses run ordering end to end, and product designer at Heizen. I care about clear systems, honest interfaces and design that earns its place in the business.',
    'I started in 2023 making social, print and campaign visuals, and got curious about the screens behind the brands. In 2024 I moved into product UI and learned to design flows, not just screens. In 2025 I co-founded OrderFlow, and started seeing design as part of the business.',
  ],
  // One entry per line.
  experienceLead: ['My Journey by Age'],
  // Experience is shown as one chapter per year, labelled by age: 20 in 2023.
  birthYear: 2003,
  // A few lines of text for each year.
  years: {
    // Placeholder copy; replace with your own.
    2023: { text: 'Started as a graphic designer at YER Myanmar, making social, print and campaign visuals. Learned layout, type and real deadlines, and got curious about the screens behind brands.' },
    2024: { text: 'Moved into product as a UI designer at Ultimate Solutions, then joined Dinger. Learned to design flows, not just screens, and why clear structure matters.' },
    2025: { text: 'A busy year: Prime Ace Limousine, more work at Dinger, then joining Heizen and co-founding OrderFlow. Started seeing design as part of the business.' },
    2026: { text: 'Leading product design at Heizen while building OrderFlow for F&B businesses. Most days sit between strategy, systems and shipping.' },
  },
  // Roles (any order). `start`/`end` are 'YYYY-MM'; `end: null` means present.
  // `logo` is optional (falls back to the company initial on a tile).
  // `note` (optional) shows when the row is opened.
  experience: [
    { co: 'OrderFlow', role: 'Co-Founder', start: '2025-11', end: null, logo: '/logos/orderflow-icon.png', note: 'Building QR table ordering for cafés, restaurants and tea houses in Myanmar. I lead product and design.' },
    { co: 'Heizen', role: 'Product Designer', start: '2025-11', end: '2026-11', logo: '/logos/heizen.png', note: 'Leading product design. Most days sit between strategy, systems and shipping.' },
    { co: 'Prime Ace Limousine', role: 'UI/UX Designer', start: '2025-09', end: '2025-11', logo: '/logos/prime-ace.png' },
    { co: 'Dinger', role: 'UX/UI Designer', start: '2024-12', end: '2025-12', logo: '/logos/dinger-logo.png', note: 'Learned to design flows, not just screens, and why clear structure matters.' },
    { co: 'Ultimate Solutions', role: 'UI Designer', start: '2024-02', end: '2024-07', logo: '/logos/ultimate-solutions.png', note: 'My move from graphics into product UI.' },
    { co: 'YER Myanmar', role: 'Graphic Designer', start: '2023-01', end: '2024-01', logo: '/logos/yer-myanmar.png', note: 'Social, print and campaign visuals. Learned layout, type and real deadlines.' },
  ],
  // takes: a handwritten note opened from "My take" (side dock, About photo).
  // One per line, from my own words; the note's up/down arrows flip through them.
  takes: [
    'Putting aside what’s possible or impossible, I think without boxing in my ideas, and I take the risk.',
    'I strive for clarity and conviction. I don’t label things right or wrong; I live by my own rules.',
    'I’m not a formal learner. I learn from my mistakes.',
    'Life is short, so I walk only the journey I enjoy. It’s not just about reaching the destination.',
    'My favourite line, from Green Book: “Whatever you do, do it 100%. When you work, work. When you laugh, laugh.”',
    'I keep my ego in check as much as I can. Ego is a double-edged sword.',
  ],
  takeSign: 'Sai', // signed in the script font

  // "What a product designer does": my view, then two tabs, each a short path
  // of steps (`word` is shown big, `line` under it when picked).
  craft: {
    show: false, // the whole How I work box (Designer / Founder tabs) is hidden; set true to bring it back
    showIntro: false, // hides title, statement and body for now; set true to bring them back
    label: 'How I work',
    title: 'What a product designer does',
    statement: 'Make things look good, easy to understand, attractive and easy to use, so they fill what people need and want.',
    body: 'To get there, I first understand two things: the user and the business. That is my real job.',
    tabs: [
      {
        id: 'designer',
        label: 'Sai the Designer',
        steps: [
          { word: 'Understand', line: 'Talk to users and learn what the business needs.' },
          { word: 'Define', line: 'Agree on the problem before drawing anything.' },
          { word: 'Explore', line: 'Many directions, flows first, screens later.' },
          { word: 'Test', line: 'Put a prototype in real hands and cut what confuses.' },
          { word: 'Ship', line: 'Build it side by side with engineering.' },
          { word: 'Improve', line: 'Measure what people really do, then go again.' },
        ],
      },
      {
        id: 'entrepreneur',
        label: 'Sai the Founder',
        steps: [
          { word: 'Think freely', line: 'No boundaries at the start. Every idea is allowed.' },
          { word: 'Find the problem', line: 'Pick one that is truly worth solving.' },
          { word: 'Research', line: 'Go to the market and listen before building.' },
          { word: 'Prototype', line: 'Make it real fast and test it with people.' },
          { word: 'Prove it small', line: 'Win the smallest thing before the big bet.' },
        ],
      },
    ],
  },
  // Core values on the About page are hidden for now (the home page strip
  // still uses them); set true to show them again.
  showValues: false,
  values: [
    'Make the complex feel simple.',
    'Design for the business, not just the screen.',
    'Stay curious and keep learning.',
  ],
  // Photos shown under the core values (`caption` optional).
  photos: [
    { src: '/sai-stage.jpg', alt: 'Sai speaking on stage with a microphone', caption: 'Startup World Cup Myanmar 2026, regional final' },
    { src: '/sai-talk.jpg', alt: 'Sai presenting Flowy, the OrderFlow AI assistant, to an audience with the slide on a projector screen', caption: 'Presenting OrderFlow’s AI assistant', position: '0% 0%', phonePosition: '0% 60%' },
    { src: '/sai-raw-setup-clean.jpg', alt: 'Sai and a teammate working on laptops at a table at RAW Coffee Lounge', caption: 'Setting up OrderFlow at RAW Coffee Lounge' },
  ],
}

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sai-myo-thu-7399b6227/' },
  { label: 'WhatsApp', href: 'https://wa.me/959952871461' },
  { label: 'Facebook', href: 'https://www.facebook.com/sai.myo.thu.733675/' },
  { label: 'Behance', href: '#' },
]
export const EMAIL = 'smyothu319@gmail.com'
// The line under the icons in the connect card: `rest` until an icon is hovered.
export const CONTACT_HINTS = {
  rest: 'Hover to say hi',
  restTouch: 'Tap to say hi', // touch screens can't hover
  LinkedIn: 'The serious me',
  WhatsApp: 'Fastest reply',
  Facebook: 'The off-duty me',
  Email: EMAIL,
}

// Keep writing .jpg and .png paths above; these swap to the AVIF where there is one.
;[PROFILE, CASES, TESTIMONIALS, OTHERS_INTRO, ABOUT].forEach(avifAll)
