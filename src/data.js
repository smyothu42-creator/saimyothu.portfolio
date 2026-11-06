// Content for the portfolio. Edit these to update the site.

// Page backdrop: 'calm' (blue mountains in evening mist, public/bg-calm.jpg),
// 'lofi' (drawn lo-fi room, night in dark mode / morning in
// light mode), 'city' (Yangon at night, public/bg-city.jpg),
// 'desk' (designer's desk at night, public/bg-desk.jpg),
// 'photo' (moonlit beach, public/bg.jpg), 'canvas' (your UI screens on a
// Figma-style board), or a scene drawn in code: 'sea', 'mountains', 'grass'.
export const BACKDROP = 'calm'

// Floating dock (right edge on desktop, bottom bar on phones). `icon` keys
// live in Dock.jsx.
export const NAV = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'About', href: '/about', icon: 'about' },
  { label: 'Contact', href: '/contact', icon: 'contact' },
  { label: 'Resume', href: '/Sai-Myo-Thu-Resume.pdf', icon: 'resume', external: true },
]

// Home hero copy.
export const PROFILE = {
  name: 'Sai Myo Thu',
  // The name splits onto two lines in the home card.
  nameLines: ['Sai Myo', 'Thu'],
  role: 'Co-Founder & Product Designer',
  // Home page avatar: the bookshop photo, framed by `avatar`
  // (background-size and -position, zoomed onto the face).
  portrait: '/sai-profile-blue.jpg', // edited copy of sai-profile.jpg: navy shirt, mountain background
  avatar: { size: '229%', position: '40% 41%' },
  // About page: the big photo card at the top (the demo photo).
  hero: { src: '/sai-demo.jpg', aspect: '3 / 2', position: 'center 40%' },
  tagline: 'Product designer turning complex problems into simple, strategic experiences.',
  // Plain strings render as text; { text, href } render as outbound links.
  note: [
    'Currently Co-Founder at ',
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
    title: 'Operation Management for\u00a0F&B\u00a0Business', // non-breaking, so the second line reads "for F&B Business",
    name: 'OrderFlow',
    domain: 'F&B',
    slug: 'orderflow',
    result: '4 cafés live, 1,000+ orders at RAW',
    logo: '/logos/orderflow.png',
    featured: true,
    tags: ['Product Design'],
    desc: 'QR table ordering for cafés in Myanmar: a guest app on the phone, and an admin that runs every order.',
    art: { img: '/case/orderflow/cover.jpg', thumb: '/case/orderflow/thumb.jpg', card: '/case/orderflow/thumb.jpg', text: 'OrderFlow', color: '#1f3a5f', bg: 'linear-gradient(160deg,#cfe4f7,#dfe7fb 55%,#eef1fb)' },
    // One case for both products: the guest app (orderflow-client) and the admin
    // panel (orderflow-admin-panel). Same six-phase structure as the Superfine
    // and Heizen cases. Numbers come from the Startup World Cup pitch deck (Oct
    // 2026); the deck's unconfirmed and [example] figures are left out on purpose.
    // The intro is a re-cut of the Pilot Launch film in the product's own theme
    // (tools/case-video/film-of.html).
    study: {
      layout: 'story',
      heading: 'Designing QR table ordering for cafés in Myanmar',
      summary: 'Guests scan a QR on the table and order on their own phone, and staff run every order from one admin panel. I co-founded OrderFlow and work on both sides of it.',
      accent: '#44403c',
      tags: ['Product Strategy', 'B2B SaaS', 'F&B'],
      role: 'Co-Founder, Product & Design Lead',
      scope: ['Guest app', 'Admin panel', 'Order and POS flows', 'Café onboarding'],
      duration: 'Nov 2025 to Present',
      team: ['Sai, product and design', 'Khant Lin Nyan, vision', 'Thaw Zin Tun, tech', 'Hein Htet Kyaw, brand'],
      gallery: [],
      tools: 'Figma, FigJam, Notion',
      sections: [
        {
          id: 'hello',
          nav: 'Intro',
          bare: true,
          immersive: true,
          blocks: [
            { kind: 'reel', src: '/case/orderflow/intro.mp4', audio: '/case/orderflow/intro.m4a', poster: '/case/orderflow/intro.jpg', alt: 'Intro: rush hour in a Yangon café, then OrderFlow: guests scan the table QR and order on their phone, staff see every order live, owners run the menu. Four cafés live by October 2026.' },
          ],
        },
        {
          id: 'impact',
          eyebrow: 'Overview',
          nav: 'Impact',
          blocks: [
            { kind: 'impact', headline: 'Seven months in, four cafés use OrderFlow every day, and every pilot is still running.', items: [
              { num: '4', label: 'Cafés live, October 2026' },
              { num: '1,000+', label: 'Orders at RAW in its first 42 days' },
              { num: '42 / 42', label: 'Days RAW used it' },
              { num: '1 day', label: 'To put a new café live' },
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
              { h: 'Execution', items: ['Guest app and admin panel', 'Order and POS flows', 'Café onboarding'] },
              { h: 'Collaboration', items: ['Product direction with Khant', 'Build with Thaw and Khant', 'Brand with Hein'] },
              { h: 'Research', items: ['Watched cafés at busy hours', 'Tested with staff in pilots'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'background',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Why OrderFlow',
          illo: 'table',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Overview', p: 'At rush hour, most cafés here still run on pen and paper. Guests wait, orders get shouted across the room, and drinks get remade.' },
              { t: 'Initial focus', p: 'Owner-run cafés in Yangon, about 3,000 of Myanmar’s 23,741 cafés and restaurants.' },
              { t: 'Objective', p: 'Get an order from the table to the kitchen without anyone writing it down or typing it twice.' },
              { t: 'Constraint', p: 'No app for guests and no new hardware. It had to run on the phones and printer a café already has.' },
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
              { h: 'Guests', illo: 'guest', sub: 'Use the guest app', items: ['Won’t install an app', 'Burmese or English', 'Hate waiting'] },
              { h: 'Floor staff', illo: 'staff', sub: 'Use the admin, all shift', items: ['Many tables at once', 'One shared device', 'No time to train'] },
              { h: 'Owners', illo: 'owner', sub: 'Use the admin, and pay for it', items: ['Already own a POS', 'Change prices often', 'Want a daily overview'] },
            ] },
          ],
        },
        {
          id: 'secondary',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Secondary research',
          title: 'Nothing let the guest order',
          illo: 'research',
          blocks: [
            { kind: 'lead', p: 'Every option a café had kept a member of staff between the guest and the kitchen, and the ones that cost the most changed that the least.' },
            { kind: 'table', cols: ['Option', 'Cost to start', 'Guests order themselves', 'Reaches the kitchen'], rows: [
              ['Pen and paper', 'Free', 'No', 'Someone carries it'],
              ['Traditional POS', 'About 3.5M MMK', 'No', 'Staff type it in'],
              ['Cloud POS', 'About 880K MMK a year', 'No', 'Staff type it in'],
              ['OrderFlow', 'Two months free', 'Yes', 'Straight away'],
            ] },
          ],
        },
        {
          id: 'interviews',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'User interviews',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Owners', illo: 'owner', p: 'Want to keep their POS and stop reprinting menus.' },
              { t: 'Floor staff', illo: 'staff', p: 'Hate re-typing orders at the counter.' },
              { t: 'Guests', illo: 'guest', p: 'Hate waiting for a waiter. Won’t install an app.' },
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
              { h: 'Wrong orders', p: 'Shouted orders get lost, and drinks get remade.' },
              { h: 'Slow service', p: 'One server, too many tables, and guests wait.' },
              { h: 'Old menus', p: 'With inflation near 25%, a printed price is soon wrong.' },
              { h: 'Tools that stop at the counter', p: 'A POS can cost 3.5M MMK and still can’t let a guest order.' },
            ] },
          ],
        },
        {
          id: 'journey',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'User journey',
          blocks: [
            { kind: 'journeymap', rows: ['emotion', 'pain'], caption: 'One busy-hour order, before OrderFlow.',
              stages: ['Arrive', 'Order', 'Hand-off', 'Serve', 'Pay', 'After service'],
              users: [
                { name: 'Guest', illo: 'guest', cells: [
                  { emotion: 0, mood: 'Neutral', pain: 'Waits to be noticed' },
                  { emotion: -1, mood: 'Unsure', pain: 'Old prices, misheard' },
                  { emotion: -2, mood: 'Anxious', pain: 'Did the kitchen get it?' },
                  { emotion: -1, mood: 'Annoyed', pain: 'Wrong items' },
                  { emotion: 1, mood: 'Fine', pain: 'Works today' },
                  null,
                ] },
                { name: 'Floor staff', illo: 'staff', cells: [
                  { emotion: 0, mood: 'Busy', pain: 'Too many tables' },
                  { emotion: -1, mood: 'Rushed', pain: 'Messy notes' },
                  { emotion: -2, mood: 'Stressed', pain: 'Re-typing, lost tickets' },
                  { emotion: -1, mood: 'Unsure', pain: 'Which table?' },
                  { emotion: 0, mood: 'OK', pain: 'Bill must match' },
                  null,
                ] },
                { name: 'Owner', illo: 'owner', cells: [
                  null, null, null, null,
                  { emotion: -1, mood: 'Unsure', pain: 'Sales split up' },
                  { emotion: -2, mood: 'Frustrated', pain: 'Spreadsheets, reprints' },
                ] },
              ] },
          ],
        },
        {
          id: 'understanding',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'Product understanding',
          blocks: [
            { kind: 'lead', p: 'We put the problem, solutions, value proposition, market size and revenue model on one board.' },
            { kind: 'shot', src: '/case/orderflow/product-understanding.png', alt: 'FigJam board with sticky notes in five columns: Problem, Solutions, Value Proposition, Market Size, Revenue Model', caption: 'The board we worked from.' },
          ],
        },

        // ---- Explore ----------------------------------------------------
        {
          id: 'guest',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Guest app',
          title: 'The guest app gets one visit',
          blocks: [
            { kind: 'lead', p: 'A guest has no reason to learn anything here, so I designed for a thumb, on a 360 to 430 pixel phone, with the main action always at the bottom.' },
            { kind: 'choices', items: [
              { h: 'The table is already known', p: 'Each QR belongs to one table, so the menu opens with no typing and no sign-in.', src: '/case/orderflow/choice-menu.jpg', alt: 'Guest menu for Table 1, with item photos, prices and Add buttons' },
              { h: 'Burmese in one tap', p: 'The menu, the item names and the buttons all change in place.', src: '/case/orderflow/choice-burmese.jpg', alt: 'The same menu with its text in Burmese' },
              { h: 'Dine in or takeaway', p: 'One basket can hold both, and the charges stay visible before the order goes.', src: '/case/orderflow/choice-basket.jpg', alt: 'Basket with two items, a dine in or takeaway switch on each, and the charge breakdown' },
              { h: 'Status instead of waving', p: 'After sending, each item shows where it is, so nobody has to catch a waiter’s eye.', src: '/case/orderflow/choice-status.jpg', alt: 'Your Order screen: Preparing Your Orders, with each item marked Preparing' },
            ] },
          ],
        },
        {
          id: 'admin',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Admin panel',
          title: 'The admin gets used all day',
          blocks: [
            { kind: 'lead', p: 'The admin is the opposite job: the same people on the same screen for a whole shift. It should feel like a work surface, dense and easy to scan.' },
            { kind: 'notes', items: [
              { t: 'Two views of one board', p: 'A card per order for the rush, or a map of the floor for seeing which table needs what.' },
              { t: 'State you can read at a glance', p: 'Ordering, preparing, urgent and not paid yet each look different, on a card and on a table.' },
              { t: 'Two languages per item', p: 'Every menu item is written in English and Burmese, so the guest app can switch.' },
              { t: 'One design system', p: 'Both apps share the ODF design system in Figma: one orange, one typeface, and different density.' },
            ] },
          ],
        },

        // ---- Test -------------------------------------------------------
        {
          id: 'pilots',
          eyebrow: 'Test',
          group: 'Test',
          nav: 'In the café',
          title: 'We set up every café ourselves',
          blocks: [
            { kind: 'lead', p: 'Every pilot starts with a visit. We put QR stands on the tables and set the café up in person, usually in a day.' },
            { kind: 'shot', src: '/case/orderflow/setup.jpg', alt: 'Two of the team at a café table with a laptop, going through the admin with café staff in aprons', caption: 'Going through the admin with café staff.' },
          ],
        },
        {
          id: 'flows',
          eyebrow: 'Test',
          group: 'Test',
          nav: 'Ordering flows',
          title: 'Staff were entering every order twice',
          blocks: [
            { kind: 'lead', p: 'Running beside a POS got us into cafés quickly. Then I watched what it cost: every QR order got typed into the POS again, then ticked off in OrderFlow. So we started moving the POS steps into the admin.' },
            { kind: 'shottabs', items: [
              { name: 'Before', lead: 'With QR orders, staff typed every order into the POS again, then ticked it off in OrderFlow.', src: '/case/orderflow/ordering-flows.png', crop: 'top', ratio: 3.67, alt: 'FigJam board: current manual ordering and POS + OrderFlow ordering flows' },
              { name: 'Proposed', lead: 'Bring the POS steps into OrderFlow: one place to take, print and track every order.', src: '/case/orderflow/ordering-flows.png', crop: 'bottom', ratio: 3.67, alt: 'FigJam board: proposed manual and QR ordering flows with the POS integrated into OrderFlow' },
            ] },
          ],
        },

        // ---- Ship -------------------------------------------------------
        {
          id: 'walkthrough',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Guest walkthrough',
          title: 'From the table QR to the kitchen',
          blocks: [
            { kind: 'demo', src: '/case/orderflow/guest.mp4', poster: '/case/orderflow/guest.jpg', alt: 'Screen recording of the guest app: the menu, switching to Burmese, browsing, adding two items, the basket, placing the order and following it', steps: [
              { t: 0, text: 'Scan the QR, no app' },
              { t: 0.77, text: 'Burmese or English' },
              { t: 7.91, text: 'Browse by category' },
              { t: 12.06, text: 'Tap an item' },
              { t: 16.81, text: 'Basket in thumb reach' },
              { t: 21.92, text: 'Review and place' },
              { t: 28.38, text: 'Track until ready' },
            ] },
          ],
        },
        {
          id: 'board',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Admin walkthrough',
          title: 'Every order, then the menu behind it',
          blocks: [
            { kind: 'reel', ratio: '7 / 5', src: '/case/orderflow/admin.mp4', poster: '/case/orderflow/admin.jpg', alt: 'The admin panel: the live order board, the table map, adding a menu item in English and Burmese, and the menu list', caption: 'The order board, the table map and the menu, from our launch film.' },
          ],
        },
        {
          id: 'orders',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Order flows',
          title: 'One Orders page for every kind of order',
          blocks: [
            { kind: 'lead', p: 'In November I reworked the Orders page around what really happens at the counter. Open orders sit here until they’re paid, then move to Reports, and the big button at the bottom always shows the next step.' },
            { kind: 'shottabs', items: [
              { name: 'Orders', lead: 'Open orders from every channel, with manual orders one button away.', src: '/case/orderflow/orders-board.jpg', alt: 'The real Orders board: filters, a search box, a Manual Order button and a card for every open table and room, each listing its items' },
              { name: 'Manual', lead: 'For the guest at the counter: pick a table, make the order, print the slips.', src: '/case/orderflow/orders-manual.jpg', alt: 'The real manual order screen for table 6: menu categories and items on the left, the cart with three items and its total on the right' },
              { name: 'QR', lead: 'A QR order arrives as a card. Staff print the slips, then mark it paid.', src: '/case/orderflow/orders-qr.jpg', alt: 'An open order on table 5: the board stays behind while a side panel lists the items, the total and a Print Slips button' },
              { name: 'Rooms', lead: 'Room fee and all items end up on one bill.', src: '/case/orderflow/orders-room.jpg', alt: 'Room R-03 in a side panel: order items, room usage and one total, with a Payment Done button' },
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
              { t: 'Loyalty', p: 'Points, stamp cards and membership levels in the guest app, managed from the admin.' },
              { t: 'QR-only cafés', p: 'For cafés keeping their own POS, a single “all added to POS” step. It’s still planned.' },
              { t: 'Paying in the app', p: 'Wallet payments, after a security review. Today guests still pay the way they always have.' },
            ] },
          ],
        },
        {
          id: 'learned',
          nav: 'What I learned',
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
    result: '16 accessibility problems found and fixed',
    logo: '/logos/superfine-kitchen.png',
    featured: true,
    tags: ['Product Design'],
    desc: 'Lunch ordering for employees on a company meal program, on the web and on a phone.',
    art: { img: '/case/superfine-employee/cover.jpg', thumb: '/case/superfine-employee/thumb.jpg?v=3', card: '/case/superfine-employee/thumb.jpg?v=3', text: 'Superfine Kitchen', color: '#5a3a52', bg: 'linear-gradient(160deg,#f4d9ec,#efd6f3 50%,#f6dbe6)' },
    // Same six-phase structure as the SFK Driver App. Facts come from the
    // superfine.corporate.employee repo: its README (IA, ordering flow,
    // interview findings) and ACCESSIBILITY-AUDIT.md (WCAG 2.2 AA, 23 Jul 2026).
    // Recordings: tools/case-video (web 1440 × 900 primary, phone 402 × 874 secondary).
    study: {
      layout: 'story',
      heading: 'Designing lunch ordering that says what it costs, before you ask',
      // TODO(Sai): confirm your part and the dates.
      summary: 'Superfine Kitchen cooks in San Francisco and delivers lunch to Bay Area offices. Employees on a company meal program order through this app. At Heizen I designed it web first, made it work on a phone, and tested it against WCAG 2.2 AA.',
      accent: '#44403c',
      tags: ['Web app', 'Responsive', 'Accessibility'],
      role: 'Product Designer, Heizen',
      scope: ['Web app', 'Mobile responsive', 'Checkout & payments', 'Accessibility audit'],
      duration: 'Jun to Sep 2026',
      team: [],
      gallery: [],
      tools: 'Figma, Claude Code, axe-core',
      sections: [
        {
          id: 'hello',
          nav: 'Intro',
          bare: true,
          immersive: true,
          blocks: [
            { kind: 'reel', src: '/case/superfine-employee/intro.mp4', audio: '/case/superfine-employee/intro.m4a', poster: '/case/superfine-employee/intro.jpg', alt: 'Intro: employees could not see their allowance, the cut-off or their lunch. Then the app: sign in, allowance in view, choices first, a cart that splits the cost, and the same flow on a phone.' },
          ],
        },
        {
          id: 'impact',
          eyebrow: 'Overview',
          nav: 'Impact',
          title: 'What it costs, when it closes, where it is',
          blocks: [
            { kind: 'lead', p: 'A web app for employees on a company meal program, built from five interview findings and tested against WCAG 2.2 AA.' },
            { kind: 'notes', items: [
              { t: 'Employees', p: 'See the allowance, the cut-off and the order status at every step.' },
              { t: 'Companies', p: 'One front door: sign in with the work email and land on the right menu and subsidy.' },
              { t: 'Accessibility', p: '16 problems found and fixed. Zero automated violations across 36 screen runs.' },
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
              { h: 'Execution', items: ['Web flows and screens', 'Mobile responsive layouts', 'Coded prototype with Claude'] },
              { h: 'Collaboration', items: ['Reviews with Superfine', 'Notes for Heizen engineers'] },
              { h: 'Research', items: ['Employee interviews', 'WCAG 2.2 AA audit'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'background',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Why this app',
          illo: 'lunch',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Overview', p: 'Superfine Kitchen cooks in San Francisco and delivers lunch to Bay Area offices.' },
              { t: 'Who orders', p: 'Employees whose company pays part of lunch, like $15 a day at Neptune Corp.' },
              { t: 'Objective', p: 'Order lunch without wondering what’s covered, when ordering closes, or whether it’s coming.' },
              { t: 'Constraint', p: 'Cards are charged 24 hours before delivery, and some employees only have a phone.' },
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
              { h: 'Office employees', illo: 'employee', sub: 'At a desk', items: ['Order between meetings', 'Plan the week ahead', 'Want to see what’s covered'] },
              { h: 'Floor employees', illo: 'staff', sub: 'On site, not at a desk', items: ['Phone only', 'Need the cut-off time', 'Need to know food is coming'] },
              { h: 'Company admins', illo: 'owner', sub: 'Run the program', items: ['Set the allowance', 'Add people by email', 'Watch the spend'] },
            ] },
          ],
        },
        {
          id: 'research',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Interviews',
          illo: 'research',
          blocks: [
            { kind: 'lead', p: 'We talked to employees about how they order lunch today. Five findings shaped the app.' },
            { kind: 'notes', items: [
              { t: 'One front door', illo: 'employee', p: 'Sign in with the company email and land on the right menu, with the right allowance.' },
              { t: 'Phone first', p: 'Some employees only have a phone, so the app has to work fully on one.' },
              { t: 'Is food coming?', p: 'A clear status: Draft, Placed, Confirmed, Delivered.' },
              { t: 'No false promises', p: 'Say plainly when an order locks. No “confirmed” after the cut-off.' },
              { t: 'Easy feedback', p: 'One tap on a smiley, tied to the order. Not a survey.' },
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
              { h: 'Hidden allowance', p: 'People found out what was covered at checkout, if at all.' },
              { h: 'Missed cut-offs', p: 'Each order type closes at a different time before delivery.' },
              { h: 'No status', p: 'Nothing said whether lunch was actually coming.' },
              { h: 'Too many doors', p: 'Different links and detours before reaching the right menu.' },
              { h: 'Surprise charges', p: 'Unclear when the card is charged, and by how much.' },
            ] },
          ],
        },
        {
          id: 'journey',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'User journey',
          blocks: [
            // TODO(Sai): check the moods against your interview notes.
            { kind: 'journeymap', rows: ['emotion', 'pain'], caption: 'One lunch order, before the app.',
              stages: ['Sign in', 'Browse', 'Choose', 'Check out', 'Wait'],
              users: [
                { name: 'Employee', illo: 'employee', cells: [
                  { emotion: -1, mood: 'Unsure', pain: 'Which link is mine?' },
                  { emotion: 0, mood: 'Curious', pain: 'Dietary info hidden' },
                  { emotion: -2, mood: 'Unsure', pain: 'Is this covered?' },
                  { emotion: -2, mood: 'Anxious', pain: 'When am I charged?' },
                  { emotion: -1, mood: 'Unsure', pain: 'Is it coming?' },
                ] },
              ] },
          ],
        },

        // ---- Explore ----------------------------------------------------
        {
          id: 'money',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Show the money',
          title: 'Show the money before the menu',
          blocks: [
            { kind: 'lead', p: 'The allowance sits in the header, the cart splits who pays what, and checkout says when the card is charged.' },
            { kind: 'choices', device: 'browser', items: [
              { h: 'Allowance in view', p: '“$15.00 left today” stays in the header while you browse.', src: '/case/superfine-employee/money-menu.jpg', alt: 'Employee web app menu with “$15.00 left today” in the header' },
              { h: 'The cart splits it', p: 'Company pays, you pay, line by line.', src: '/case/superfine-employee/money-cart.jpg', alt: 'Cart drawer: Paneer Tikka Bowl, company pays $15.00, you pay $1.63' },
              { h: 'No surprise charge', p: 'The cut-off, and “charged 24 hours before delivery, never before”.', src: '/case/superfine-employee/money-checkout.jpg', alt: 'Checkout with the cut-off check, delivery details and payment charged 24 hours before delivery' },
            ] },
          ],
        },
        {
          id: 'responsive',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Web first, then phone',
          blocks: [
            { kind: 'lead', p: 'The web app came first. The phone gets the same flow, rebuilt for one hand.' },
            { kind: 'notes', items: [
              { t: 'Web', p: 'Sidebar navigation, the cart in a drawer beside the menu, checkout with its summary on one page.' },
              { t: 'Phone', p: 'A menu button, bottom sheets for choices, and a sticky bar with the total.' },
            ] },
          ],
        },
        {
          id: 'ai',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Prototyping with AI',
          illo: 'idea',
          blocks: [
            { kind: 'lead', p: 'I built the app as a working prototype with Claude Code, so reviews and the accessibility audit ran on a real app, not on frames.' },
            { kind: 'notes', items: [
              { t: 'Real, not drawn', p: 'Real menu data, real allowance maths, the Superfine design system.' },
              { t: 'Testable', p: 'A working app could be driven by keyboard, screen reader and an automated checker.' },
              { t: 'These demos', p: 'Recorded from the prototype by a script, not mocked up.' },
            ] },
          ],
        },

        // ---- Test -------------------------------------------------------
        {
          id: 'a11y',
          eyebrow: 'Test',
          group: 'Test',
          nav: 'Accessibility testing',
          title: 'Can everyone use it?',
          blocks: [
            { kind: 'lead', p: 'We tested against WCAG 2.2 AA: first by hand with a keyboard and a screen reader, then with an automated checker on every screen.' },
            { kind: 'table', cols: ['What we found', 'What it meant for a person'], rows: [
              ['The delivery-area box held the keyboard', 'Anyone outside the area was stuck, with no way out but closing the tab.'],
              ['Password errors were only on screen', 'A blind person couldn’t learn why sign-up failed.'],
              ['Meal photos were the only link label', 'When a photo failed, a screen reader said “link, link, link”.'],
              ['Faint outlines on 99 buttons', 'With poor eyesight, the buttons had no visible shape.'],
            ] },
            { kind: 'notes', items: [
              { t: 'By hand', p: '15 problems found by driving the app with a keyboard and a screen reader. All fixed.' },
              { t: 'By machine', p: 'axe-core on all 17 routes and 11 states, at desktop and phone width. Zero violations in 36 runs.' },
              { t: 'Checking the checker', p: 'Five broken elements were planted first. All five were caught.' },
              { t: 'One more', p: 'The checker found a 16th problem, caused by one of our own fixes. Fixed too.' },
            ] },
          ],
        },

        // ---- Ship -------------------------------------------------------
        {
          id: 'walkthrough',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Web app',
          title: 'Design walkthrough: web',
          blocks: [
            { kind: 'demo', device: 'browser', src: '/case/superfine-employee/web.mp4', poster: '/case/superfine-employee/web.jpg', alt: 'Screen recording of the employee web app, one lunch order from sign-in to tracking', steps: [
              { t: 0, text: 'Sign in with work email' },
              { t: 5.17, text: 'Allowance in the header' },
              { t: 6.91, text: 'Required choices first' },
              { t: 11.33, text: 'Header shows $1.50 over' },
              { t: 14.71, text: 'Cut-off at checkout' },
              { t: 19.2, text: 'One confirmation email' },
              { t: 20.71, text: 'Track every order' },
            ] },
          ],
        },
        {
          id: 'mobile',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Mobile responsive',
          title: 'Mobile responsive',
          blocks: [
            { kind: 'demo', src: '/case/superfine-employee/mobile.mp4', poster: '/case/superfine-employee/mobile.jpg', alt: 'Screen recording of the employee app on a phone, the same lunch order', steps: [
              { t: 0, text: 'Same email sign in' },
              { t: 5.26, text: 'Allowance in a pill' },
              { t: 7.09, text: 'Choices in a bottom sheet' },
              { t: 11.42, text: 'Cart splits who pays' },
              { t: 14.68, text: 'Total above the thumb' },
              { t: 20.67, text: 'One confirmation email' },
              { t: 22.3, text: 'Draft to Confirmed' },
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
              { t: 'Put it live', p: 'The accessibility fixes are written and tested, not yet released.' },
              { t: 'A real person', p: 'An hour with someone who uses a screen reader every day.' },
              { t: 'Keep checking', p: 'Run the automated check on every change, so a fix can’t break something else again.' },
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
            { kind: 'lead', p: 'A careful hand audit still needs a machine to check it, and the machine still needs a person. Our sixteenth problem came from one of our own fixes.' },
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
    art: { img: '/case/superfine/cover.jpg', thumb: '/case/superfine/thumb.jpg', card: '/case/superfine/thumb.jpg', text: 'Superfine Kitchen', color: '#5a3a52', bg: 'linear-gradient(160deg,#f4d9ec,#efd6f3 50%,#f6dbe6)' },
    // Story layout in six phases (Understand → Improve, the same track as the
    // About page). Facts come from the driver prototype (sfk-driver-app: its
    // README, review notes and commit history). Videos and stills are real
    // recordings of that prototype, made with tools/case-video.
    study: {
      layout: 'story',
      heading: 'Designing the driver app that gets lunch from one kitchen to every office',
      // TODO(Sai): confirm "I designed and prototyped" matches your part.
      summary: 'Superfine Kitchen cooks in San Francisco and delivers lunch to offices around the Bay Area with its own drivers. At Heizen I designed and prototyped their driver app: the shift from the kitchen to the door, and the hand-offs with dispatch.',
      accent: '#44403c',
      tags: ['Mobile', 'Logistics', 'AI prototyping'],
      role: 'Product Designer, Heizen',
      scope: ['Driver app', 'Kitchen loading', 'Proof of delivery', 'Dispatch hand-offs'],
      // TODO(Sai): confirm the dates (driver sprints ran Oct 13–30 2026, updates into Nov).
      duration: 'Oct to Nov 2026',
      team: [],
      gallery: [],
      tools: 'Figma, Claude Code',
      sections: [
        {
          id: 'hello',
          nav: 'Intro',
          bare: true,
          immersive: true,
          blocks: [
            { kind: 'reel', src: '/case/superfine/sf-intro.mp4', audio: '/case/superfine/sf-intro.m4a', poster: '/case/superfine/sf-intro.jpg', alt: 'Intro: hot food, one free hand and a 60 minute clock. Then a driver run: go on duty, scan each slip, slide to confirm, navigate, follow the steps at the door and send a proof photo.' },
          ],
        },
        {
          id: 'impact',
          eyebrow: 'Overview',
          nav: 'Impact',
          title: 'One next step, one button, all shift',
          blocks: [
            { kind: 'lead', p: 'A driver app built around the five jobs Superfine gave us, prototyped in three sprints and reviewed with their team after each one.' },
            { kind: 'notes', items: [
              { t: 'Drivers', p: 'Always see the next step and one action, from the kitchen to the proof photo.' },
              { t: 'Dispatch', p: 'Sees who is on duty and where, and assigns work instead of drivers picking it.' },
              { t: 'Superfine', p: 'Has a working prototype as the reference for the real build.' },
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
              { h: 'Execution', items: ['Planned the three sprints', 'Driver flows and screens', 'Coded prototype with Claude'] },
              { h: 'Collaboration', items: ['Reviews with Superfine every sprint', 'Notes for Heizen engineers'] },
              { h: 'Research', items: ['Five driver jobs from Superfine', 'Walked a delivery with ops'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'background',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Why a driver app',
          illo: 'lunch',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Overview', p: 'Superfine Kitchen cooks in San Francisco and delivers lunch and catering to Bay Area offices with its own drivers.' },
              { t: 'A driver’s day', p: 'One to three stops a run from the kitchen, sometimes back for a second pickup.' },
              { t: 'Objective', p: 'One app for the shift, from the kitchen to the door, that dispatch can follow live.' },
              { t: 'Constraint', p: 'Hot food has 60 minutes from loading, and only one hot order rides in each vehicle.' },
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
              { h: 'Drivers', illo: 'driver', sub: 'On their own phone', items: ['One free hand', 'English or Spanish', 'Hot food on a timer'] },
              { h: 'Dispatch', illo: 'ops', sub: 'At a computer most of the day', items: ['Plans every route', 'Moves times when things slip', 'Needs to see who is where'] },
              { h: 'Office contacts', illo: 'employee', sub: 'Receive the food', items: ['Want it on time', 'Get the proof photo', 'Hand back reusables'] },
            ] },
          ],
        },
        {
          id: 'research',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Walking a delivery',
          illo: 'research',
          blocks: [
            { kind: 'lead', p: 'Before drawing a route screen, we walked one delivery through with Superfine’s ops team. Four facts changed the design.' },
            { kind: 'notes', items: [
              { t: 'Short routes', p: 'Most routes are one to three stops, delivered in order.' },
              { t: 'Hot goes first', p: 'Only one hot order per vehicle, and it is always the first stop.' },
              { t: 'Two pickups', p: 'Some routes go back to the kitchen for a second load.' },
              { t: 'Reusables', p: 'Empty totes are collected at a drop-off or later on the route.' },
            ] },
          ],
        },

        // ---- Define -----------------------------------------------------
        {
          id: 'jobs',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'Five driver jobs',
          blocks: [
            { kind: 'table', cols: ['Job', 'Where it lives'], rows: [
              ['See all their orders', 'Home, Route and Schedule tabs'],
              ['Follow the instructions', 'Stop screen: parking, access photo, setup steps'],
              ['Navigate', 'Google Maps, then slide when you arrive'],
              ['Prove the delivery', 'Camera, then slide to complete'],
              ['Let Superfine track them', 'Location shared only while on duty'],
            ] },
          ],
        },
        {
          id: 'problems',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'Problem spaces',
          illo: 'juggle',
          blocks: [
            { kind: 'iconlist', items: [
              { h: 'Busy hands', p: 'Bags and hot trays, one hand free. A stray tap can’t mark something done.' },
              { h: 'Every office is different', p: 'Parking, access and setup steps change by building.' },
              { h: 'Hot food on a clock', p: '60 minutes from loading, and hot goes first.' },
              { h: 'Counting at the kitchen', p: 'Fifty to a hundred meals checked before leaving.' },
              { h: 'Plans change', p: 'Dispatch moves times and adds orders during the day.' },
            ] },
          ],
        },
        {
          id: 'journey',
          eyebrow: 'Define',
          group: 'Define',
          nav: 'User journey',
          blocks: [
            // TODO(Sai): check the moods against what you saw with drivers.
            { kind: 'journeymap', rows: ['emotion', 'pain'], caption: 'One delivery run, before the app. Pains come from Superfine’s review notes.',
              stages: ['Start shift', 'Kitchen load', 'Drive', 'Arrive', 'Drop off & set up', 'Collect & proof'],
              users: [
                { name: 'Driver', illo: 'driver', cells: [
                  { emotion: 0, mood: 'Unsure', pain: 'What am I picking up?' },
                  { emotion: -2, mood: 'Rushed', pain: 'Checking 50 to 100 meals' },
                  { emotion: -1, mood: 'Tense', pain: 'Hot food on a clock' },
                  { emotion: -2, mood: 'Lost', pain: 'Where to park, how to get in' },
                  { emotion: -1, mood: 'Unsure', pain: 'Setup differs per office' },
                  { emotion: -1, mood: 'Unsure', pain: 'Totes short, who to tell?' },
                ] },
                { name: 'Dispatch', illo: 'ops', cells: [
                  { emotion: -1, mood: 'Unsure', pain: 'Who is on duty?' },
                  null,
                  { emotion: -2, mood: 'Blind', pain: 'Where is the driver?' },
                  null,
                  { emotion: -1, mood: 'Worried', pain: 'Running late?' },
                  { emotion: -1, mood: 'Unsure', pain: 'Was it delivered?' },
                ] },
              ] },
          ],
        },

        // ---- Explore ----------------------------------------------------
        {
          id: 'choices',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Design choices',
          title: 'Slide, don’t tap',
          blocks: [
            { kind: 'lead', p: 'Every screen has one coral action, and the button says the next step.' },
            { kind: 'choices', items: [
              { h: 'Slide to confirm', p: 'Loaded, arrived and complete are slides, so a full hand can’t tap them by mistake.', src: '/case/superfine/choice-slide.jpg', alt: 'Loading checklist with every item ticked and an “All orders loaded” slide at the bottom' },
              { h: 'Steps in order', p: 'At the door, setup steps come one after another, before the photo.', src: '/case/superfine/choice-steps.jpg', alt: 'Setup instructions sheet: lay meals on the pantry counter by name label, take the lids off the hot trays' },
              { h: 'Late? Say why', p: 'A late delivery asks for a reason before it can finish, so dispatch knows.', src: '/case/superfine/choice-late.jpg', alt: 'Proof of delivery with two photos, a “Delayed, 1 min past the window” card with reasons, and a slide to complete' },
            ] },
          ],
        },
        {
          id: 'ai',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'Prototyping with AI',
          illo: 'idea',
          blocks: [
            { kind: 'lead', p: 'I built the driver app as a working prototype with Claude Code, so Superfine reviewed a real app on a real phone instead of linked frames.' },
            { kind: 'notes', items: [
              { t: 'Real, not drawn', p: 'A real map, routes from Superfine’s real kitchen, and the same design system as their other apps.' },
              { t: 'Review to build', p: 'Notes from a review were in the prototype within a day or two.' },
              { t: 'A living spec', p: 'Every change is written down with its date and reason, so engineers build from the same source.' },
              { t: 'These demos', p: 'Recorded from the prototype by a script, not mocked up.' },
            ] },
          ],
        },
        {
          id: 'cut',
          eyebrow: 'Explore',
          group: 'Explore',
          nav: 'What we left out',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Claiming jobs', p: 'Drivers can’t pick deliveries. Dispatch sends each one as a request.' },
              { t: 'Meal counts', p: 'Taken off the driver screens after the October review.' },
              { t: 'Offline mode', p: 'Left out of this plan on purpose.' },
            ] },
          ],
        },

        // ---- Test -------------------------------------------------------
        {
          id: 'solving',
          eyebrow: 'Test',
          group: 'Test',
          nav: 'Design reviews',
          title: 'What changed after each review',
          blocks: [
            { kind: 'iterations', items: [
              { problem: 'Instructions only on arrival', change: 'Shown before leaving, numbered on arrival' },
              { problem: 'What am I picking up?', change: 'The kitchen card lists every order on the pickup' },
              { problem: 'Checking 50 to 100 meals', change: 'One row per meal, a By dish view, every tick saved' },
              { problem: 'Three words for one status', change: '“Loaded” everywhere' },
              { problem: 'Scanning the wrong slip', change: '“This isn’t on your route”, with Call dispatch' },
              { problem: 'In-app navigation only', change: 'Google Maps for turn-by-turn' },
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
            { kind: 'demo', src: '/case/superfine/sf-route-screen.mp4', poster: '/case/superfine/sf-route-screen.jpg', alt: 'Screen recording of the driver app, one delivery from going on duty to delivered', steps: [
              { t: 0, text: 'Go on duty' },
              { t: 3.26, text: 'Scan each packing slip' },
              { t: 8.17, text: 'Tick, then slide to confirm' },
              { t: 16.43, text: 'Hot order first' },
              { t: 21.52, text: 'Setup steps in order' },
              { t: 30.69, text: 'Totes, then proof photo' },
              { t: 42.02, text: 'Delivered, photo sent' },
            ] },
          ],
        },
        {
          id: 'sprints',
          eyebrow: 'Ship',
          group: 'Ship',
          nav: 'Three sprints',
          blocks: [
            { kind: 'lead', p: 'I planned the work as three sprints, October 13 to 30, each adding one part of the driver’s day and ending in a review with Superfine.' },
            { kind: 'notes', items: [
              { t: 'Sprint 1', p: 'Route and stop, kitchen loading, drop-off.' },
              { t: 'Sprint 2', p: 'Requests from dispatch, schedule, notifications, reusables pickups.' },
              { t: 'Sprint 3', p: 'Sign-in on their own phone, on and off duty, live location, Spanish.' },
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
              { t: 'Texting customers', p: 'An open question with the team. Today drivers send preset messages to dispatch only.' },
              { t: 'Crews', p: 'Crew roles on a stop are designed and hidden until Superfine needs them.' },
              { t: 'After the last stop', p: '“Send home” and site-to-site transfers aren’t built yet.' },
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
            { kind: 'lead', p: 'Most of the work was taking things off the screen until one step and one action were left. Building the prototype with AI meant Superfine reviewed something real every sprint.' },
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
    art: { img: '/case/mtb-pay-merchant/cover.jpg', thumb: '/case/mtb-pay-merchant/thumb.jpg', card: '/case/mtb-pay-merchant/card.jpg', text: 'MTB Pay', color: '#fff', bg: '#c8121a' },
    // Facts come from Sai's own case page (smyothu.framer.website/work/spark);
    // screens are from the Figma flows (tools/case-video/out-mtb).
    // TODO(Sai): add the dates and where the app is now.
    study: {
      layout: 'story',
      heading: 'A merchant wallet for shopkeepers, not tech people',
      summary: 'MTB Bank partnered with us to support small businesses in Myanmar by improving its merchant app. The goal was a faster, more intuitive system for people with limited tech skills, one that reinforced trust in MTB’s digital ecosystem.',
      accent: '#44403c',
      tags: ['Fintech', 'Mobile', 'Payments'],
      role: 'Product Designer',
      scope: ['Onboarding', 'Home', 'eMoney', 'My Bank', 'Receive payment', 'Top up', 'Bill payment', 'Refund', 'Profile'],
      duration: '',
      team: ['4 product designers', '11 developers', '3 stakeholders'],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'impact',
          eyebrow: 'Overview',
          nav: 'Impact',
          title: 'Faster top-ups, fewer errors',
          blocks: [
            { kind: 'lead', p: 'Users reported faster top-ups, fewer errors and more confidence using the app. The feedback was positive, and it showed how far simple, thoughtful design can go.' },
          ],
        },
        {
          id: 'role',
          eyebrow: 'Overview',
          nav: 'My role',
          illo: 'shipping',
          blocks: [
            { kind: 'role', items: [
              { h: 'Execution', items: ['User interface design', 'Design system', 'Iteration', 'Developer handoff'] },
              { h: 'Collaboration', items: ['4 product designers', '11 developers', '3 stakeholders'] },
              { h: 'Research', items: ['A survey of target users'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'background',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'The problem',
          illo: 'research',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Problem', p: 'Local merchants relied on outdated systems, which meant slow transactions and frequent errors.' },
              { t: 'What they needed', p: 'Something simpler and faster that a non-technical shopkeeper could use without training or confusion.' },
              { t: 'Who it’s for', p: 'SME owners making transactions every day. Most aren’t tech-savvy, so the tools have to be fast, reliable and quick to learn.' },
            ] },
          ],
        },
        {
          id: 'survey',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'User survey',
          title: 'What merchants asked for',
          blocks: [
            { kind: 'lead', p: 'We surveyed target users to learn what they struggled with. Three needs came up.' },
            { kind: 'iconlist', items: [
              { h: 'Faster top-ups', p: 'Top-ups are a daily job in a shop, so every extra step costs time.' },
              { h: 'Clear transaction statuses', p: 'Merchants need to know exactly what happened to their money.' },
              { h: 'Easy navigation', p: 'It has to suit people who are new to digital tools.' },
            ] },
          ],
        },

        // ---- Design -----------------------------------------------------
        {
          id: 'topup',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Top up',
          title: 'Fewer steps, clear flows',
          blocks: [
            { kind: 'lead', p: 'We built a reliable system with fewer steps and clear flows, so shopkeepers make fewer errors and feel more confident.' },
            { kind: 'choices', items: [
              { h: 'Everything on one screen', p: 'Balance, money in and out, four services and the latest transactions.', src: '/case/mtb-pay-merchant/home.jpg', alt: 'Home screen with the account balance, total in and out, four services and latest transactions' },
              { h: 'Number, then amount', p: 'Type the number, then tap an amount or a package.', src: '/case/mtb-pay-merchant/topup-amount.jpg', alt: 'Top up screen with a phone number and a grid of amounts' },
              { h: 'Check before paying', p: 'Fees, discount and commission are listed before anything is confirmed.', src: '/case/mtb-pay-merchant/topup-summary.jpg', alt: 'Top up summary listing the provider, amount, fees and total' },
              { h: 'A clear result', p: 'The amount and transaction ID, with a receipt to save.', src: '/case/mtb-pay-merchant/topup-done.jpg', alt: 'Successful top up with the amount, transaction ID and a Save Receipt button' },
              { h: 'Errors say what to do', p: 'A wrong number gets one short message and a Try Again button.', src: '/case/mtb-pay-merchant/topup-invalid.jpg', alt: 'Invalid Number message with a Try Again button' },
            ] },
          ],
        },
        {
          id: 'receive',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Receive payment',
          title: 'Always show where the money is',
          blocks: [
            { kind: 'lead', p: 'Merchants asked for clear transaction statuses, so a payment never leaves them guessing.' },
            { kind: 'choices', items: [
              { h: 'Scan the customer', p: 'Point the camera at the customer’s QR, with a flashlight and album close by.', src: '/case/mtb-pay-merchant/receive-scan.jpg', alt: 'Camera view scanning a QR code on a customer’s phone' },
              { h: 'Or show the shop’s QR', p: 'Download it or share it, right from the tab.', src: '/case/mtb-pay-merchant/receive-qr.jpg', alt: 'The shop’s QR code with Download, Share and Specify Amount' },
              { h: 'Set an amount', p: 'Add a fixed amount to the QR when the shop needs one.', src: '/case/mtb-pay-merchant/receive-amount.jpg', alt: 'Specify Amount sheet with a number keypad' },
              { h: 'Say what’s happening', p: 'While the customer confirms, the screen says so.', src: '/case/mtb-pay-merchant/receive-wait.jpg', alt: 'Waiting for Customer’s Confirmation screen with an hourglass' },
              { h: 'Paid', p: 'The amount, who sent it and a receipt to save.', src: '/case/mtb-pay-merchant/receive-done.jpg', alt: 'Successful payment with the amount, sender and a Save Receipt button' },
            ] },
          ],
        },
        {
          id: 'refund',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Refund',
          title: 'Mistakes need a clear way back',
          blocks: [
            { kind: 'choices', items: [
              { h: 'Find the payment', p: 'Search by transaction number, with refunded payments on their own tab.', src: '/case/mtb-pay-merchant/refund-list.jpg', alt: 'Refund list of received payments with a search box and two tabs' },
              { h: 'Give a reason', p: 'A refund can’t go ahead without one.', src: '/case/mtb-pay-merchant/refund-reason.jpg', alt: 'Refund Information sheet with a required reason' },
              { h: 'Check the details', p: 'Who it’s going to, the amount and the reason, before confirming.', src: '/case/mtb-pay-merchant/refund-summary.jpg', alt: 'Refund summary with the transaction details and a Confirm button' },
              { h: 'Refunded', p: 'The same clear result as every other flow.', src: '/case/mtb-pay-merchant/refund-done.jpg', alt: 'Successful refund with the amount and a Save Receipt button' },
            ] },
          ],
        },
        {
          id: 'system',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Design system',
          illo: 'juggle',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Design system', p: 'We enhanced it with clear fonts, high contrast and consistent components.' },
              { t: 'Built for the counter', p: 'Icons and layouts were optimised for small screens and busy shops.' },
              { t: 'Working together', p: 'The project thrived on close teamwork with developers, stakeholders and clients, all aimed at a real solution for Myanmar’s everyday merchants.' },
            ] },
          ],
        },
        {
          id: 'learned',
          nav: 'What I learned',
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
    art: { img: '/case/merchant-experience/cover.jpg', thumb: '/case/merchant-experience/thumb.jpg', card: '/case/merchant-experience/card.jpg', text: 'Merchant Experience', color: '#fff', bg: '#7c0a10' },
    // Facts come from Sai's page (smyothu.framer.website/work/merchant-portal-copy-copy);
    // screens are from the Figma boards in Merchant Portal.zip (tools/case-video/out-portal).
    // TODO(Sai): add the dates and What I learned.
    study: {
      layout: 'story',
      heading: 'Secure merchant management',
      summary: 'MTB Bank developed a Merchant Portal for a single large-scale partner. It gives them live transaction monitoring, refund handling, API access and reporting, and full control over digital payments without relying on manual communication.',
      accent: '#44403c',
      tags: ['B2B', 'Web portal', 'Payments'],
      role: 'UX/UI Designer',
      scope: ['Onboarding', 'Dashboard', 'Merchant information', 'Transaction history', 'Refund management', 'Fund settlement', 'API key'],
      duration: '',
      team: ['3 UX/UI designers', '5 developers', '1 project manager'],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'impact',
          eyebrow: 'Overview',
          nav: 'Impact',
          title: 'Less waiting, more control',
          blocks: [
            { kind: 'lead', p: 'The portal reduced communication delays and improved refund processing time. It gave the merchant live performance tracking and API tools, which streamlined both support and integration work.' },
          ],
        },
        {
          id: 'role',
          eyebrow: 'Overview',
          nav: 'My role',
          illo: 'shipping',
          blocks: [
            { kind: 'role', items: [
              { h: 'Execution', items: ['UI/UX design', 'User flows', 'Testing', 'Developer handoff'] },
              { h: 'Collaboration', items: ['3 UX/UI designers', '5 developers', '1 project manager'] },
              { h: 'Input', items: ['MTB’s partner team', 'The merchant'] },
            ] },
          ],
        },

        // ---- Understand -------------------------------------------------
        {
          id: 'background',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'The problem',
          illo: 'research',
          blocks: [
            { kind: 'notes', items: [
              { t: 'Before', p: 'The merchant relied on spreadsheets and email to track transactions and process refunds, which caused delays and confusion.' },
              { t: 'What was needed', p: 'One secure interface that improved visibility and transparency, and cut the back and forth.' },
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
              { h: 'Finance staff', sub: 'Reporting', items: ['Clear access to the numbers', 'Reports they can export'] },
              { h: 'Customer service', sub: 'Refunds', items: ['Find the transaction', 'Handle the refund smoothly'] },
              { h: 'Developers', sub: 'Integration', items: ['API keys', 'Tools for integration work'] },
            ] },
          ],
        },
        {
          id: 'feedback',
          eyebrow: 'Understand',
          group: 'Understand',
          nav: 'Partner feedback',
          title: 'Working with the people using it',
          blocks: [
            { kind: 'lead', p: 'There was no formal survey. We worked closely with MTB’s partner team and the merchant instead, and we prioritised three things they asked for.' },
            { kind: 'iconlist', items: [
              { h: 'Real-time data', p: 'See what’s happening now.' },
              { h: 'Exportable reports', p: 'Take the numbers out of the portal.' },
              { h: 'Smooth refund handling', p: 'No more refunds over email.' },
            ] },
          ],
        },

        // ---- Design -----------------------------------------------------
        {
          id: 'monitor',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Dashboard',
          title: 'From spreadsheets to one live view',
          blocks: [
            { kind: 'lead', p: 'We designed a dedicated portal with task-based navigation, so people could use it with minimal training.' },
            { kind: 'choices', device: 'browser', items: [
              { h: 'Live overview', p: 'Balance and transaction growth, by day, month or year, with an export.', src: '/case/merchant-experience/dash.jpg', alt: 'Dashboard with account balance, transaction growth and a daily bar chart' },
              { h: 'Every transaction', p: 'One dense table with a date range and an export.', src: '/case/merchant-experience/tx-list.jpg', alt: 'Transaction History table with dates, numbers and types' },
              { h: 'Advanced filters', p: 'Narrow it down by number, type, status or sender.', src: '/case/merchant-experience/tx-filter.jpg', alt: 'Filter panel over the transaction table' },
            ] },
          ],
        },
        {
          id: 'refunds',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Refunds',
          title: 'Refunds without the email thread',
          blocks: [
            { kind: 'choices', device: 'browser', items: [
              { h: 'Reason and rule up front', p: 'The 7 day refund window sits above the reason and the transaction.', src: '/case/merchant-experience/refund-detail.jpg', alt: 'Refund detail with a 7 day notice, a refund reason and transaction information' },
              { h: 'PIN to confirm', p: 'A refund needs the PIN before it goes through.', src: '/case/merchant-experience/refund-pin.jpg', alt: 'Enter PIN to Refund dialog' },
              { h: 'Expired, and it says so', p: 'After the window, the page explains why it can’t be refunded.', src: '/case/merchant-experience/refund-expired.jpg', alt: 'Transaction detail with a notice that it has expired and cannot be refunded' },
            ] },
          ],
        },
        {
          id: 'settlement',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Fund settlement',
          title: 'Moving money with a clear check',
          blocks: [
            { kind: 'choices', device: 'browser', items: [
              { h: 'Confirm with a PIN', p: 'The amount is repeated back before the transfer.', src: '/case/merchant-experience/fund-confirm.jpg', alt: 'Transfer Money to Bank dialog with the amount and a PIN field' },
              { h: 'See it land', p: 'A success message, with both balances updated.', src: '/case/merchant-experience/fund-done.jpg', alt: 'Fund Settlement with a Successfully Transferred message and new balances' },
              { h: 'Say what went wrong', p: 'Problems like an insufficient balance appear right at the top.', src: '/case/merchant-experience/fund-limit.jpg', alt: 'Fund Settlement with an Insufficient wallet balance message' },
            ] },
          ],
        },
        {
          id: 'api',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'API key',
          title: 'Tools for the developers too',
          blocks: [
            { kind: 'shottabs', items: [
              { name: 'New key', lead: 'The secret key can’t be recovered, so the screen says to save and copy it.', src: '/case/merchant-experience/api-new.jpg', alt: 'API Keys Generated dialog with a secret key and a Save and Copy button' },
              { name: 'Key list', lead: 'Each key shows when it was generated, its status and who generated it.', src: '/case/merchant-experience/api-key.jpg', alt: 'API Key table with date, public key, status and who generated it' },
            ] },
          ],
        },
        {
          id: 'system',
          eyebrow: 'Design',
          group: 'Design',
          nav: 'Design system',
          illo: 'juggle',
          blocks: [
            { kind: 'notes', items: [
              { t: 'MTB’s system', p: 'We followed MTB’s design system for brand consistency.' },
              { t: 'New components', p: 'Bulk actions, collapsible sections and multi-status tags, added to handle dense data views and internal operations.' },
            ] },
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
    art: { img: '/case/heizen-studio/cover.jpg', thumb: '/case/heizen-studio/thumb.jpg', card: '/case/heizen-studio/card.jpg', text: 'Heizen Studio', color: '#fff', bg: '#3a4196' },
    // Screens are built with shadcn/ui in tools/heizen-studio-ui, from Sai's
    // screenshots of the platform. TODO(Sai): check this copy, add dates, team,
    // real results, and a screenshot of a single meeting's page.
    study: {
      layout: 'story',
      heading: 'Bringing meetings into the platform where the work happens',
      summary: 'Heizen Studio is the workspace Heizen uses to deliver client software, from the first meeting to the last test case. It had no meetings feature, so we ran our calls through Granola, outside the platform. I designed Meetings to bring them in.',
      accent: '#44403c',
      tags: ['B2B', 'Internal tool', 'AI'],
      role: 'Product Designer, Heizen',
      scope: ['Meetings'],
      duration: '',
      team: [],
      gallery: [],
      tools: 'shadcn/ui',
      sections: [
        {
          id: 'problem',
          eyebrow: 'Why',
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
          id: 'screen',
          eyebrow: 'The feature',
          nav: 'The feature',
          title: 'One place for every call on a project',
          blocks: [
            { kind: 'lead', p: 'Meetings sits under Delivery, next to the Sprint Board and Backlog, so it is part of running a project and not a separate app. Drag the handle to compare the screen in the platform with the redesign.' },
            { kind: 'beforeafter', wide: true, ratio: '1664 / 992', before: '/case/heizen-studio/before-meetings.jpg', after: '/case/heizen-studio/meetings.jpg', alt: 'The Meetings screen, with past calls grouped by day' },
          ],
        },
        {
          id: 'past',
          eyebrow: 'After a call',
          nav: 'After a call',
          title: 'Finding what was said',
          blocks: [
            { kind: 'shot', wide: true, src: '/case/heizen-studio/meetings-past.jpg', alt: 'Past meetings grouped by day, with search, a date filter and a tag filter above them' },
            { kind: 'notes', items: [
              { t: 'Grouped by day', p: 'Projects run many similar syncs, so the date is what tells them apart.' },
              { t: 'Tagged by type', p: 'Standup, Design Review, Requirement Workshop: you can see what kind of call it was before opening it.' },
              { t: 'Search the summary', p: 'You can search by what was discussed, not only by the title.' },
            ] },
          ],
        },
        {
          id: 'next',
          eyebrow: 'Before a call',
          nav: 'Before a call',
          title: 'Ready before it starts',
          blocks: [
            { kind: 'shot', wide: true, src: '/case/heizen-studio/meetings-next.jpg', alt: 'Tomorrow’s meetings on the right of the screen, each with a bot switch and a record button' },
            { kind: 'notes', items: [
              { t: 'What’s next, alongside', p: 'Upcoming meetings stay in view next to past ones.' },
              { t: 'One control per call', p: 'Each meeting has its own switch for the bot and a button to start recording.' },
            ] },
          ],
        },
        {
          id: 'leads-to',
          eyebrow: 'Where it leads',
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
    title: 'Heizen Supply Chain',
    name: 'Heizen Discovery Tool',
    slug: 'heizen-supply-chain',
    domain: 'Supply Chain',
    tags: ['Product Design', 'Supply Chain'],
    desc: 'A discovery tool that gets a Heizen consultant ready for a first client call, in minutes.',
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
      role: 'Product Designer, Heizen',
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
export const HOME_WORK = ['orderflow', 'superfine-employee', 'sfk-driver-app']
// The fan of cards in the home page's More Work card; the middle one sits in front.
export const MORE_WORK = ['retina-ai', 'mtb-pay-merchant', 'merchant-experience']

// Testimonials on the home page. Use real quotes only, with the person's
// permission. `photo` is optional (initials show otherwise), e.g.
// '/people/aung.jpg' in /public. `placeholder: true` marks entries that are
// still samples (for your own tracking).
// MOCK DATA: fictional people and quotes for layout only. Replace with real
// testimonials (with permission) before the site goes public.
export const TESTIMONIALS = [
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
    { co: 'Heizen', role: 'Product Designer', start: '2025-11', end: null, logo: '/logos/heizen.png', note: 'Leading product design. Most days sit between strategy, systems and shipping.' },
    { co: 'Prime Ace Limousine', role: 'UI/UX Designer', start: '2025-09', end: '2025-11', logo: '/logos/prime-ace.png' },
    { co: 'Dinger', role: 'UX/UI Designer', start: '2024-12', end: '2025-12', logo: '/logos/dinger-logo.png', note: 'Learned to design flows, not just screens, and why clear structure matters.' },
    { co: 'Ultimate Solutions', role: 'UI Designer', start: '2024-02', end: '2024-07', logo: '/logos/ultimate-solutions.png', note: 'My move from graphics into product UI.' },
    { co: 'YER Myanmar', role: 'Graphic Designer', start: '2023-01', end: '2024-01', logo: '/logos/yer-myanmar.png', note: 'Social, print and campaign visuals. Learned layout, type and real deadlines.' },
  ],
  // My takes: a handwritten note opened from "My take" (side dock, About photo).
  // One per line; the note's up/down arrows flip through them. The first is
  // mine; the others are drafts from my own words on this site, edit freely.
  takes: [
    'I only get one life. So I take the leap, learn from every fall, and enjoy every step of the journey.',
    'I think freely, with no boundaries, until I find the problem that is truly worth solving.',
    'Good design looks good and is easy to use. It starts with understanding people and the business.',
    'Prove the smallest thing first. Then take the bigger bet.',
  ],
  takeSign: 'Sai', // signed in the script font

  // "What a product designer does": my view, then two tabs, each a short path
  // of steps (`word` is shown big, `line` under it when picked).
  craft: {
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
  ],
}

export const SOCIALS = [
  { label: 'LinkedIn', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'Behance', href: '#' },
]
export const EMAIL = 'hello@saimyothu.com'
