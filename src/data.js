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
export const ORDERFLOW_URL = 'https://orderflowmm.com/'

export const PROFILE = {
  name: 'Sai Myo Thu',
  role: 'Product Designer',
  // Home page avatar: the bookshop photo, framed by `avatar`
  // (background-size and -position, zoomed onto the face).
  portrait: '/sai-profile-blue.jpg', // edited copy of sai-profile.jpg: navy shirt, mountain background
  avatar: { size: '229%', position: '40% 41%' },
  // About page: the big photo card at the top (the demo photo).
  hero: { src: '/sai-demo.jpg', aspect: '3 / 2', position: 'center 40%' },
  tagline: 'Hover on projects',
  // Opens the home hero's paragraph, and is the footer's sign-off.
  signoff: 'Designed in Yangon, iced Americano nearby',
  // Plain strings render as text; { text, href } render as outbound links.
  note: [
    'I’m a product designer and co-founder building ',
    { text: 'OrderFlow', href: ORDERFLOW_URL },
    ', a browser-based ordering ecosystem for F&B businesses in Myanmar, from table ordering to kitchen operations. Previously, I designed products at ',
    { text: 'Heizen', href: 'https://www.heizen.work/' },
    ' and ',
    { text: 'Dinger', href: 'https://dinger.asia/' },
    '.',
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
    art: { img: '/case/orderflow/cover.jpg?v=34', video: '/case/orderflow/hero.mp4?v=8', bento: '/case/orderflow/bento.mp4?v=2', bentoPoster: '/case/orderflow/bento.jpg?v=2', videoSm: '/case/orderflow/hero-sm.mp4?v=2', poster: '/case/orderflow/hero.jpg?v=3', thumb: '/case/orderflow/thumb-pos.jpg?v=10', card: '/case/orderflow/thumb.jpg', text: 'OrderFlow', color: '#1f3a5f', bg: 'linear-gradient(160deg,#cfe4f7,#dfe7fb 55%,#eef1fb)' },
    // Guest app + café admin. Numbers are the pilot café only (Startup World Cup deck, Oct 2026).
    // Cover loop: art.video, tools/case-video/hero-of.html.
    study: {
      navTop: false,
      overviewNav: 'Project Overview',
      overviewPart: 'About',
      layout: 'story',
      heading: '1,300 orders in 42 days.',
      summary: 'Staff did not want to key every customer order into the POS. A mistake could come out of their own pocket, and a rush meant racing through one order after another. Guests felt the pressure of a long queue behind them, but did not want to install an app. Owners could not keep paying to reprint menus whenever prices or items changed. OrderFlow put the order on the table QR, in Burmese or English. One pilot café ran 1,300+ orders in its first 42 days, live 60 days in a row, for 35.7M MMK.',
      glance: {
        cols: 2,
        jumpLabel: 'Overview',
        items: [
          { label: 'Problem', value: 'Staff rushed to enter every order into the POS and paid for mistakes. Guests felt pressure from the queue but would not install an app. Owners could not keep reprinting changing menus.' },
          { label: 'Role', value: 'Co-Founder & Product Designer. I led product strategy, discovery and validation, owned the guest and café-admin flows, and contributed to front-end development.' },
          { label: 'Actions', value: 'Spoke with people across the F&B domain, built the MVP, tested it in a real café, iterated, tested and compared it again, then released the next version.' },
          { label: 'Result', value: '1,300+ orders in 42 days for 35.7M MMK. In the second test, a counter order reached the kitchen in about 1–10 seconds with one click.' },
        ],
      },
      accent: '#44403c',
      tags: ['Product Strategy', 'B2B SaaS', 'F&B'],
      role: 'Co-Founder & Product Designer',
      scope: ['Guest App / Café Admin'],
      timeline: '2026-Ongoing',
      metaIndustry: true,
      team: ['2 engineers', '1 brand designer'],
      gallery: [],
      tools: 'Claude Code, Figma, Trello',
      sections: [
        {
          id: 'problem',
          nav: 'The shift',
          jumpLabel: 'Problem',
          title: 'The same order was taken twice before it reached the kitchen.',
          blocks: [
            { kind: 'lead', p: 'During busy hours, one order created pressure on every side of the counter. Staff had to listen, write it down and key it into the POS while the kitchen waited. Guests felt rushed by the queue behind them, and owners kept paying to replace menus whenever an item or price changed.' },
            { kind: 'split', cols: 2, items: [
              { h: 'Owners', illustration: '/case/orderflow/problem-bill-watercolor-clear.webp', p: 'Menu items and prices changed often, and reprinting the menu each time added another recurring cost.' },
              { h: 'Staff', illustration: '/case/orderflow/problem-typing-watercolor-clear.webp', p: 'They did not want to race through one POS entry after another during a rush. A wrong order created more work and could mean paying for the mistake themselves.' },
              { h: 'Guests', illustration: '/case/orderflow/problem-no-answer-watercolor-clear.webp', p: 'A long line behind them made ordering stressful, but installing an app for one café was too much to ask.' },
              { h: 'The kitchen', illustration: '/case/orderflow/problem-cookie-watercolor-clear.webp', p: 'The kitchen needed a clear printed order as soon as it was placed, without waiting for staff to repeat it across the room.' },
            ] },
          ],
        },
        {
          id: 'listened',
          nav: 'Seven people',
          jumpLabel: 'Actions',
          title: 'Seven conversations shaped the MVP.',
          blocks: [
            { kind: 'donut', p: 'Before that shift I caught up with seven people. Not a workshop, and not a survey. I sat with them the way you catch up, and listened for what they wanted, what they needed, and the trouble they already met every day. I wanted the day in their words, before a screen existed.', items: [
              { t: 'Business owner', n: 2 },
              { t: 'F&B expert', n: 1 },
              { t: 'Cashier', n: 1 },
              { t: 'Regular customer', n: 3 },
            ] },
          ],
        },
        {
          id: 'rules',
          nav: 'The gap',
          title: 'The product had to fit the way a café actually works.',
          blocks: [
            { kind: 'lead', p: 'The interviews made the constraints clear: guests would not install an app, owners needed a menu they could update without reprinting, and staff needed the kitchen to receive an accurate order without the usual rush and repetition.' },
            { kind: 'list', items: [
              'Let guests order without installing an app. They should be able to scan the table QR and use the browser already on their phone, in Burmese or English.',
              'Let owners update the menu without reprinting it. They should be able to change an item or price once and have the QR menu show the latest version.',
              'Remove the need to repeat an order. OrderFlow needed to keep the items and table number together, then let staff print a clear kitchen slip in one click.',
            ] },
          ],
        },
        {
          id: 'prototype',
          nav: 'The pilot',
          title: 'Built, tested on a real shift, improved, then tested again.',
          blocks: [
            { kind: 'lead', p: 'Assumptions were all I had, so the first version was small. I put it in a real café, trained the staff at the table, and ran the same loop each time: watch a shift, ask what slows the counter, fix it, ship it to the pilot, test again.' },
            { kind: 'mockpair',
              phone: { label: 'Guest', alt: 'Guest flow: menu, options, order summary, waiting, preparing, ready', srcs: ['c-menu', 'c-item', 'c-summary', 'c-waiting', 'c-preparing', 'c-ready'].map((n) => `/case/orderflow/mvp/${n}.jpg`) },
              browser: { label: 'Shop', alt: 'Shop flow: add an item, table QR, QR stand, accept, ready, paid', srcs: ['a-item', 'a-table-qr', 'a-qr-stand', 'a-accept', 'a-ready', 'a-paid'].map((n) => `/case/orderflow/mvp/${n}.jpg`) },
            },
          ],
        },
        {
          id: 'shift',
          nav: 'What we learned',
          title: 'Interviews and live testing revealed four things the product had to do.',
          blocks: [
            { kind: 'lead', p: 'What people said in interviews and what happened during a real shift pointed to the same four needs, from getting an order to the kitchen to closing the month.' },
            { kind: 'split', items: [
              { h: 'Print the order for the kitchen', p: 'If OrderFlow could turn each order into a clear slip that staff could print in one click and pass straight to the kitchen, it would meet their most important need.' },
              { h: 'Items and table number at a glance', p: 'I could have asked staff to keep checking statuses. On shift, they needed the order items and the table number together. The items told them what to make. The table number told them where to serve it.' },
              { h: 'Make orders easy to place and fix', p: 'Guests could make a mistake at any point. Older guests had trouble with the small basket button and where search sat. The basket needed a bigger button, search needed a clearer spot, and guests needed a way to catch and fix a mistake.' },
              { h: 'Daily and monthly sales, already added up.', p: 'Shops put together sales reports every day and at the end of each month. Many shops in Myanmar do this in Excel. An export of individual orders still leaves the shop to add up the sales. The daily and monthly totals had to be ready in OrderFlow.' },
            ] },
            { kind: 'photos', items: [
              { src: '/case/orderflow/setup.jpg', alt: 'Training the café’s staff on the OrderFlow admin at a table' },
            ] },
          ],
        },
        {
          id: 'shipped',
          nav: 'What shipped',
          title: 'Decisions that came from the findings.',
          blocks: [
            { kind: 'lead', p: 'The interviews and the live shift pointed to the same actions. These are the decisions that went into the next release.' },
            { kind: 'split', cols: 3, items: [
              { h: 'Guest', bullets: [
                'No app. The order opens from the table QR, in Burmese or English.',
                'The basket button is bigger, and search sits where a guest can find it.',
                'A guest can review the order and fix a wrong item before it is placed.',
              ] },
              { h: 'Staff', bullets: [
                'The items and the table number arrive together.',
                'One click prints the kitchen slip.',
                'The kitchen gets that slip without the order being said again across the room.',
              ] },
              { h: 'Owner', bullets: [
                'Items and prices update once, on the QR menu. Nothing to reprint.',
                'Daily and monthly sales are already added up.',
                'The shop does not have to total the orders in Excel.',
              ] },
            ] },
            { kind: 'arch', items: [
              { key: 'guest', t: 'Guest', p: 'Order from the table without queue pressure or an app.' },
              { key: 'staff', t: 'Staff', p: 'The items and table number arrive together, and the kitchen slip prints in one click.' },
              { key: 'owner', t: 'Owner', p: 'Update menu items and prices without reprinting, and see daily and monthly sales already added up.' },
            ] },
          ],
        },
        {
          id: 'second-test',
          nav: 'Prototype vs. second test',
          title: 'The second test showed what changed.',
          blocks: [
            { kind: 'lead', p: 'I tested the same core tasks with five participants in the prototype round and five participants after the changes. The timing rows show observed task times; the completion rows show how many participants finished without help.' },
            {
              kind: 'table',
              cols: ['Task', 'Prototype', 'Second test'],
              rows: [
                ['Counter order to kitchen', '~2–3 min', '~1–10 s · one click'],
                ['Complete an order without errors', '60%', '100% · no errors'],
                ['Add a new menu item without help', '3 min 24 s', '2 min'],
                ['Find an item with search (search was hard to find)', '24 s', '11 s'],
                ['Open the basket without help', '3 of 5', '5 of 5'],
                ['Fix a wrong item without help', '2 of 5', '4 of 5'],
              ],
            },
            { kind: 'compare2', ratio: '1600 / 1000', beforeLabel: 'Prototype', afterLabel: 'Shipped', before: '/case/orderflow/mvp-compare.jpg', after: '/case/orderflow/orders-qr.jpg', alt: 'The café order board with an order open beside it, in the prototype and in the shipped product' },
          ],
        },
        {
          id: 'shipping',
          nav: 'Shipping',
          jumpLabel: 'Shipped',
          title: 'Shipping the front end',
          blocks: [
            { kind: 'lead', p: 'I worked with two engineers and a brand designer. I brought the interview and café-shift findings into the guest and admin flows, worked through feasibility and edge cases with engineering, and contributed the front-end changes. Every change then followed the same path: its own branch, type check, lint and build, a changelog note on how it was checked, then staging before production.' },
            { kind: 'ship', stats: [
              { num: '53', label: 'Commits by me, Jun to Nov 2026' },
              { num: '2', label: 'Front-end repos: guest app and admin' },
              { num: '4', label: 'Pull requests by me, merged' },
            ], image: '/case/orderflow/github-contributions-grid-2026.png', alt: 'GitHub contribution calendar with activity shown by day', summary: '27 contributions in the last year', year: '2026' },
          ],
        },
        {
          id: 'walkthrough',
          nav: 'Walkthrough',
          title: 'Design Walkthrough',
          blocks: [
            { kind: 'flowpair',
              phone: { label: 'Guest', items: [
                { name: 'QR order', src: '/case/orderflow/feat/g-order.mp4?v=3', poster: '/case/orderflow/feat/g-order.jpg?v=3', alt: 'Guest app: scanning the table QR, switching to Burmese, adding two items and placing the order' },
                { name: 'Pickup', src: '/case/orderflow/feat/g-pickup.mp4?v=3', poster: '/case/orderflow/feat/g-pickup.jpg?v=3', alt: 'Guest app: an online pickup order from the shop link, with name and phone, to the order number' },
              ] },
              browser: { label: 'Shop', items: [
                { name: 'QR order', src: '/case/orderflow/feat/a-qr.mp4?v=4', poster: '/case/orderflow/feat/a-qr.jpg?v=3', alt: 'Admin: a QR order on the board, opened, its kitchen slips printed and its payment recorded' },
                { name: 'Counter order', src: '/case/orderflow/feat/a-manual.mp4?v=4', poster: '/case/orderflow/feat/a-manual.jpg?v=3', alt: 'Admin: a counter order for table 6, three items, cash with change and printed slips' },
                { name: 'Reports', src: '/case/orderflow/feat/a-reports.mp4?v=4', poster: '/case/orderflow/feat/a-reports.jpg?v=3', alt: 'Admin: metrics for the day, the daily close, orders by channel and sales per item' },
                { name: 'New item', src: '/case/orderflow/feat/a-newmenu.mp4?v=4', poster: '/case/orderflow/feat/a-newmenu.jpg?v=3', alt: 'Admin: adding an espresso with a photo, English and Burmese names, a price and prep time' },
              ] },
            },
          ],
        },
        {
          id: 'result',
          nav: 'The numbers',
          jumpLabel: 'Result',
          title: 'One café. 42 days.',
          blocks: [
            { kind: 'lead', p: 'Measured on the pilot café, and left as revenue through OrderFlow. This is the café’s takings on the system, not a modelled design ROI.' },
            { kind: 'stats', items: [
              { num: '1,300+', label: 'Orders in the first 42 days' },
              { num: '35.7M', label: 'MMK in revenue' },
              { num: '1–10 sec', label: 'Order-to-kitchen time, one click' },
            ] },
          ],
        },
        {
          id: 'again',
          nav: 'If I could go back',
          title: 'I would move through assumptions faster.',
          blocks: [
            { kind: 'lead', p: 'I spent too much time polishing assumption-led designs as if they were ready for a final launch. Once I observed a real café shift, much of that polish had to be revised. If I could start again, I would test those assumptions sooner and move faster.' },
          ],
        },
      ],
    },
  },
  {
    title: 'Corporate Meal Order',
    name: 'Superfine Kitchen',
    domain: 'F&B',
    slug: 'superfine-employee',
    result: '$173K in lunch orders in the first 6 weeks',
    logo: '/logos/superfine-kitchen.png',
    featured: true,
    tags: ['Product Design'],
    desc: 'Lunch ordering for employees on a company meal program, with allowance and cost shown up front.',
    short: 'Company lunch ordering for office teams.', // one line for More Work
    art: { video: '/case/superfine-employee/hero.mp4?v=3', bento: '/case/superfine-employee/bento.mp4?v=2', bentoPoster: '/case/superfine-employee/bento.jpg?v=2', videoSm: '/case/superfine-employee/hero-sm.mp4?v=2', poster: '/case/superfine-employee/hero.jpg?v=2', img: '/case/superfine-employee/cover.jpg?v=5', thumb: '/case/superfine-employee/thumb.jpg?v=3', card: '/case/superfine-employee/thumb.jpg?v=3', text: 'Superfine Kitchen', color: '#5a3a52', bg: 'linear-gradient(160deg,#f4d9ec,#efd6f3 50%,#f6dbe6)' },
    // Decision story. Facts from the superfine.corporate.employee repo README
    // and ACCESSIBILITY-AUDIT.md (WCAG 2.2 AA, 23 Jul 2026).
    // Recordings: tools/case-video (web 1440 × 900, phone 402 × 874).
    study: {
      navTop: false,
      overviewNav: 'Project Overview',
      layout: 'story',
      heading: '$173K of lunch in six weeks.',
      // TODO(Sai): confirm your part and the dates.
      summary: 'Superfine Kitchen needed an ordering experience for everyday company lunches, but employees used a catering site built for one-off events. They could not see what their company covered, when ordering closed, or whether lunch was on its way. At Heizen, I researched the journey and designed a responsive ordering flow around those questions. In the first six weeks after the first customer was onboarded, the product handled 1,738 orders worth $173K.',
      glance: {
        cols: 2,
        jumpLabel: 'Overview',
        items: [
          { label: 'Problem', value: 'The old catering site hid the company allowance until checkout and gave employees no clear cut-off or order status.' },
          { label: 'Role', value: 'Product designer at Heizen. I owned the user interviews, user journeys, flows, prototype and UI.' },
          { label: 'Designed', value: 'A responsive ordering flow that shows the allowance, personal cost, cut-off and order status when employees need them.' },
          { label: 'Result', value: 'The product handled 1,738 orders worth $173K across 49 companies and 334 staff in its first six weeks.' },
        ],
      },
      accent: '#44403c',
      tags: ['Web app', 'Responsive', 'Accessibility'],
      role: 'Product Designer',
      scope: ['Responsive Web Platform'],
      timeline: 'Jun to Sep 2026',
      metaIndustry: true,
      team: [],
      gallery: [],
      tools: 'Figma, Claude Code, axe-core',
      sections: [
        {
          id: 'problem',
          nav: 'The lunch',
          jumpLabel: 'Prepare',
          title: 'Employees learned what they owed too late.',
          blocks: [
            { kind: 'lead', p: 'Superfine Kitchen delivers lunch to Bay Area offices. Companies cover part of each meal, but employees were ordering through a third-party site designed for party catering. The site treated a recurring workday lunch like a one-off event: the allowance appeared only at checkout, while the cut-off and delivery status were hard to find or absent.' },
            { kind: 'split', cols: 2, items: [
              { h: 'Office staff', illustration: '/case/superfine-employee/problem-office-watercolor.webp', p: 'Ordering between meetings, they discovered their company coverage and personal cost at the last step. The card charge could come as a surprise.' },
              { h: 'Floor staff', illustration: '/case/superfine-employee/problem-floor-watercolor.webp', p: 'They ordered on a phone around their shifts. Small controls made the site harder to use, and an unclear cut-off could leave them without lunch.' },
              { h: 'Company admins', illustration: '/case/superfine-employee/problem-admins-watercolor.webp', p: 'They set allowances, added employees and monitored spending, but that program context did not appear in the employee ordering experience.' },
              { h: 'After ordering', illustration: '/case/superfine-employee/problem-old-site-watercolor.webp', p: 'The old site did not show a useful status, so employees could not check whether their lunch was coming.' },
            ] },
          ],
        },
        {
          id: 'rules',
          nav: 'The rules',
          title: 'The journey pointed to three questions.',
          blocks: [
            { kind: 'lead', p: 'Through user interviews and two rounds with the Superfine Kitchen team, I worked through the meal program and mapped the journey from opening the menu to waiting for delivery. The office and floor contexts differed, but the same uncertainty appeared at three moments. I used those moments to prioritize the design.' },
            { kind: 'list', items: [
              'Before choosing a meal: What does my company cover, and what will I pay?',
              'Before placing or changing an order: When does this order type close?',
              'After ordering: Is my lunch confirmed and on its way?',
            ] },
          ],
        },
        {
          id: 'shift',
          nav: 'Four calls',
          jumpLabel: 'Decisions',
          title: 'Four decisions turned those questions into a flow.',
          blocks: [
            { kind: 'lead', p: 'I designed around the moments where employees lacked information, then used a working prototype to review the flow with customers and give engineering a concrete UI reference.' },
            { kind: 'split', items: [
              { h: 'Show the allowance early', p: 'The old site revealed coverage at checkout. I put the allowance in the menu header and separated the company and employee shares in the cart, so the cost is clear before an order is placed.' },
              { h: 'Make the cut-off visible', p: 'Different order types close at different times. The deadline stays on screen, and both edits to a placed order and auto-order respect that same cut-off.' },
              { h: 'Use one responsive product', p: 'Office staff use a desktop; floor staff may only have a phone. I carried the same allowance, cart and confirmation through both layouts instead of creating a separate floor app.' },
              { h: 'Test a working flow', p: 'I built a clickable prototype and worked through 10 rounds in six weeks. It let us review the ordering rules in context. Engineering used it as a UI reference while building the product separately.' },
            ] },
            { kind: 'compare2', ratio: '1600 / 1000', beforeLabel: 'Before · Third-party platform', afterLabel: 'After · Superfine', before: '/case/superfine-employee/platform-before.jpg', after: '/case/superfine-employee/platform-after.jpg', alt: 'the third-party catering platform employees used before, and the new Superfine menu with the allowance in the header' },
          ],
        },
        {
          id: 'shipped',
          nav: 'What shipped',
          jumpLabel: 'Shipped',
          title: 'The answers became part of the order.',
          blocks: [
            { kind: 'lead', p: 'The finished flow makes coverage visible before checkout, keeps the deadline close to the action, and gives employees a place to check their order after placing it. The same flow works on desktop and phone.' },
            { kind: 'split', cols: 2, items: [
              { h: '01 · Coverage', bullets: ['Found out at checkout.', 'The allowance is in the header. The cart splits who pays.'] },
              { h: '02 · Cut-off', bullets: ['Each order type closed at a different time.', 'The deadline is on the screen. A placed order can be changed until it.'] },
              { h: '03 · Status', bullets: ['Nothing said whether lunch was coming.', 'My Orders shows the current status; past orders offer re-order and rating.'] },
              { h: '04 · The phone', bullets: ['Small text, and a phone only.', 'The same order, on the phone they already carry. Not a second product.'] },
            ] },
            { kind: 'subheading', h: 'Explore the ordering flow.', h2: 'Web and phone.', p: 'These walkthroughs show ordering, order history, edits, auto-order and dietary filters across both layouts.' },
            { kind: 'flowpair', shared: true,
              phone: { label: 'On the phone', items: [
                { name: 'Ordering', src: '/case/superfine-employee/flows/m-order.mp4', poster: '/case/superfine-employee/flows/m-order.jpg', alt: 'Employee app on a phone: the allowance in the header, a meal with options, the cart split, company invoice and the confirmation' },
                { name: 'Past orders', src: '/case/superfine-employee/flows/m-orders.mp4', poster: '/case/superfine-employee/flows/m-orders.jpg', alt: 'Employee app on a phone: My Orders with status, the Past tab, re-order and rating a meal' },
                { name: 'Edit order', src: '/case/superfine-employee/flows/m-edit.mp4', poster: '/case/superfine-employee/flows/m-edit.jpg', alt: 'Employee app on a phone: editing a placed order, swapping the meal, reviewing and saving the changes' },
                { name: 'Auto-order', src: '/case/superfine-employee/flows/m-auto.mp4', poster: '/case/superfine-employee/flows/m-auto.jpg', alt: 'Employee app on a phone: setting up Auto-Order, picking a meal, choosing days and turning it on' },
                { name: 'Allergens', src: '/case/superfine-employee/flows/m-diet.mp4', poster: '/case/superfine-employee/flows/m-diet.jpg', alt: 'Employee app on a phone: filtering out tree nuts and dairy, then keeping vegan meals only' },
              ] },
              browser: { label: 'On the web', device: 'pos', logo: null, items: [
                { name: 'Ordering', src: '/case/superfine-employee/flows/order.mp4', poster: '/case/superfine-employee/flows/order.jpg', alt: 'Employee web app: the allowance in the header, a meal with options, the over-budget header, the cart split, company invoice and the confirmation' },
                { name: 'Past orders', src: '/case/superfine-employee/flows/orders.mp4', poster: '/case/superfine-employee/flows/orders.jpg', alt: 'Employee web app: My Orders with live status, the Past tab, re-order and rating a meal' },
                { name: 'Edit order', src: '/case/superfine-employee/flows/edit.mp4', poster: '/case/superfine-employee/flows/edit.jpg', alt: 'Employee web app: editing a placed order from My Orders, swapping the meal, reviewing the changes and saving them' },
                { name: 'Auto-order', src: '/case/superfine-employee/flows/auto.mp4', poster: '/case/superfine-employee/flows/auto.jpg', alt: 'Employee web app: setting up Auto-Order, picking a meal with its options, choosing days and turning it on' },
                { name: 'Allergens', src: '/case/superfine-employee/flows/diet.mp4', poster: '/case/superfine-employee/flows/diet.jpg', alt: 'Employee web app: filtering out tree nuts and dairy, then keeping vegan meals only' },
              ] },
            },
          ],
        },
        {
          id: 'result',
          nav: 'The numbers',
          jumpLabel: 'Result',
          title: 'Launch activity and design checks.',
          blocks: [
            { kind: 'lead', p: 'In the first six weeks after the first customer was onboarded, the product handled the orders and sales below. I also checked 17 desktop and phone screens with a keyboard, screen reader and automated tools. I found and fixed 16 accessibility issues; 36 automated checks reported no WCAG 2.2 AA violations.' },
            { kind: 'stats', h: 'First six weeks', items: [
              { num: '$173K', label: 'Lunch orders' },
              { num: '1,738', label: 'Orders' },
              { num: '49', label: 'Companies' },
              { num: '334', label: 'Staff ordering' },
            ] },
          ],
        },
        {
          id: 'again',
          nav: 'If I could go back',
          title: 'I would watch one lunch hour.',
          blocks: [
            { kind: 'lead', p: 'The interviews and two rounds with the kitchen team exposed the main gaps, but I would observe an office lunch hour earlier. Watching someone order around the cut-off would help me test the journey in its real setting before settling the priority of each problem.' },
          ],
        },
      ],
    },
  },
  {
    title: 'SFK Driver App',
    name: 'SFK Driver App',
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
            { kind: 'lead', p: 'The job is to see the orders, follow the instructions, navigate, prove the delivery and let Superfine track them. What we wanted was one app for the shift, from the kitchen to the door, that dispatch can follow live.' },
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
    name: 'MTB Pay Merchant',
    slug: 'mtb-pay-merchant',
    domain: 'Fintech',
    tags: ['Product Design', 'Payments'],
    desc: 'A merchant wallet for small businesses in Myanmar, designed around fast, clear counter tasks and explicit payment states.',
    short: 'A wallet for small shops.', // one line for More Work
    result: 'A merchant wallet used by 100+ merchants',
    art: { img: '/case/mtb-pay-merchant/hand.jpg?v=1', video: '/case/mtb-pay-merchant/hero.mp4?v=5', bento: '/case/mtb-pay-merchant/bento.mp4?v=2', bentoPoster: '/case/mtb-pay-merchant/bento.jpg?v=2', videoSm: '/case/mtb-pay-merchant/hero-sm.mp4?v=2', poster: '/case/mtb-pay-merchant/hero.jpg?v=4', thumb: '/case/mtb-pay-merchant/thumb.jpg?v=6', card: '/case/mtb-pay-merchant/thumb.jpg?v=6', text: 'MTB Pay', color: '#fff', bg: '#c8121a' },
    // Decision story from the published case only (smyothu.framer.website/work/spark)
    // and the Figma flow recordings (tools/case-video/out-mtb). No dates on file.
    // Edge-case screens stay out, as requested; they remain in public/case/mtb-pay-merchant/edge.
    study: {
      navTop: false,
      overviewNav: 'Project Overview',
      layout: 'story',
      heading: '100+ merchants, on both stores.',
      summary: 'The bank needed one merchant app for QR payments, top-ups, bills and refunds. I did not conduct merchant research on this project; I translated the business requirements into navigation, payment flows and UI rules for a busy counter. The app keeps the balance first, makes the amount easy to check and states what happened to the money. It is live on the App Store and Google Play, used by 100+ merchants.',
      glance: {
        jumpLabel: 'Overview',
        items: [
          { label: 'Business need', value: 'Give merchants one counter app for QR payments, top-ups, bills and refunds, with clearer transaction states and a flow that can be learned quickly.' },
          { label: 'Role', value: 'I translated the business requirements into the app structure, payment flows and UI decisions, and built the Figma design system from a Carbon Design System foundation.' },
          { label: 'Collaboration', value: 'I worked within a team of 3 designers, 11 developers and 2 PMs, using the product and bank requirements to align the screens, states and implementation.' },
          { label: 'Result', value: 'Live on the App Store and Google Play, used by 100+ merchants. Merchant adoption is the recorded product outcome for this case.' },
        ],
      },
      accent: '#44403c',
      tags: ['Fintech', 'Mobile', 'Payments'],
      role: 'UI/UX Designer',
      scope: ['Merchant App'],
      timeline: '2025',
      metaIndustry: true,
      team: ['3 designers', '11 developers', '2 PMs'],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'problem',
          nav: 'The counter',
          jumpLabel: 'The counter',
          title: 'The brief called for faster, clearer counter tasks.',
          blocks: [
            { kind: 'lead', p: 'I worked from business requirements supplied by the bank and product team rather than research I conducted myself. The brief focused on everyday merchant tasks: reduce friction in top-ups, make transaction outcomes clear and organise several payment services in one app.' },
            { kind: 'split', items: [
              { h: 'One counter app', p: 'Take a payment by QR, top up a phone, pay a bill, give a refund and check the balance from one place.' },
              { h: 'Faster top-ups', p: 'Keep the task short, make the amount easy to verify and avoid unnecessary choices at the counter.' },
              { h: 'Clear money states', p: 'Show a summary before confirmation, a clear outcome after it and the same record in History.' },
              { h: 'Learnable navigation', p: 'Keep the home structure and service locations predictable across repeated visits.' },
            ] },
          ],
        },
        {
          id: 'rules',
          nav: 'The brief',
          jumpLabel: 'The brief',
          title: 'The business brief became three design requirements.',
          blocks: [
            { kind: 'lead', p: 'These requirements became the basis for my design decisions and the flow reviews with the product and engineering teams.' },
            { kind: 'list', items: [
              'Faster top-ups.',
              'A status that says what happened to the money.',
              'Navigation for people new to digital tools.',
            ] },
          ],
        },
        {
          id: 'shift',
          nav: 'Four decisions',
          jumpLabel: 'Four decisions',
          title: 'Four decisions for the counter.',
          blocks: [
            { kind: 'lead', p: 'Built for the counter: one strong colour, big numbers, plain words. The home is the same on every visit, so a shopkeeper does not have to relearn it.' },
            { kind: 'split', items: [
              { h: 'The balance, first', p: 'Then money in and money out. Then the four services. Then the latest transactions. That order does not change.' },
              { h: 'The amount is the biggest text', p: 'One typeface. On a busy counter the amount is the thing that gets misread. It is the biggest text on every money screen.' },
              { h: 'Colour means one thing', p: 'MTB red carries the actions and the balance. White everywhere else. Green is money in. Red is money out.' },
              { h: 'Status is a sentence', p: 'A summary before the confirm, a success that says the customer paid, a receipt to save or share, and the same detail in History.' },
            ] },
            { kind: 'shot', natural: true, portrait: true, src: '/case/mtb-pay-merchant/home.jpg', alt: 'Merchant app home: account balance in the red card, total in and out, four services, latest transactions and the bottom bar', caption: 'The home, top to bottom: balance, in and out, four services, latest transactions.' },
          ],
        },
        {
          id: 'shipped',
          nav: 'Getting paid',
          jumpLabel: 'Getting paid',
          title: 'Both phones say the money moved.',
          blocks: [
            { kind: 'lead', p: 'A payment now has a summary before the confirm, a success that says the customer paid, a receipt to save or share, and the same detail in History. The customer confirms with a PIN, and both phones show it.' },
            { kind: 'flowphone', label: 'Getting paid',
              steps: [
                { h: '01 · Get paid', ps: ['A payment by QR, at the counter.', 'Start at the shop’s home, scan their QR, and wait while they confirm.'] },
                { h: '02 · The customer', ps: ['Both phones have to say it.', 'The customer confirms with a PIN. The shop sees that the customer paid.'] },
                { h: '03 · The record', ps: ['Unclear what happened to the money.', 'The receipt can be saved or shared, and the same detail lands in History.'] },
                { h: '04 · The next task', ps: ['Each service could have introduced a different pattern.', 'Find it, check the summary, confirm, keep the record—the same sequence across payment tasks.'] },
              ],
              items: [
              { name: 'Scan to Get Paid', src: '/case/mtb-pay-merchant/flows/receive.mp4?v=4', poster: '/case/mtb-pay-merchant/flows/receive.jpg?v=4', alt: 'Merchant app: starting at the shop’s home, scanning a customer’s QR, picking 50,000 MMK, adding a remark, confirming the summary, waiting for the customer, the successful payment and sharing the receipt' },
              { name: 'Customer Pays by QR', src: '/case/mtb-pay-merchant/flows/pay.mp4', poster: '/case/mtb-pay-merchant/flows/pay.jpg', alt: 'MTB Pay wallet: the customer’s Pay With QR, the shop’s payment request, the summary, entering the PIN, Payment Successful and the payment in History' },
              { name: 'Set a QR Amount', src: '/case/mtb-pay-merchant/flows/dyn.mp4', poster: '/case/mtb-pay-merchant/flows/dyn.jpg', alt: 'Merchant app: the shop’s QR, Specify Amount, typing 100,000 and the QR showing 100,000 MMK' },
              { name: 'Fund Out to an Agent', src: '/case/mtb-pay-merchant/flows/fund.mp4', poster: '/case/mtb-pay-merchant/flows/fund.jpg', alt: 'Merchant app: eMoney, scanning a Super Agent’s QR, choosing 500,000, the summary, PIN, SMS code, success and sharing the receipt' },
              { name: 'Refund a Payment', src: '/case/mtb-pay-merchant/flows/refund.mp4', poster: '/case/mtb-pay-merchant/flows/refund.jpg', alt: 'Merchant app: Refund, searching a transaction number, the payment, typing a reason, the summary, PIN, success and sharing the receipt' },
              { name: 'Pay a YESC Bill', src: '/case/mtb-pay-merchant/flows/bill.mp4', poster: '/case/mtb-pay-merchant/flows/bill.jpg', alt: 'Merchant app: Pay Bill, Electricity Bill, YESC and barcode, the full bill summary, PIN, success and the bill in History' },
              { name: 'Phone Top Up', src: '/case/mtb-pay-merchant/flows/topup.mp4', poster: '/case/mtb-pay-merchant/flows/topup.jpg', alt: 'Merchant app: typing a phone number, choosing 1,000, the summary, PIN, success, saving the receipt and History' },
            ] },
          ],
        },
        {
          id: 'system',
          nav: 'The system',
          jumpLabel: 'The system',
          title: 'A Figma system built from Carbon, adapted for MTB Pay.',
          blocks: [
            { kind: 'lead', p: 'I built the Figma design system using Carbon Design System as the structural foundation, then adapted its tokens, components and interaction states for MTB’s brand and mobile payment flows. The library includes colour and type styles, component variants and documentation for usage and properties.' },
            { kind: 'shot', src: '/case/mtb-pay-merchant/design-system.avif', alt: 'Design system documentation in Figma: style, usage and properties pages for the components', caption: 'Every component carries its states, its usage and a properties page.' },
          ],
        },
        {
          id: 'result',
          nav: 'The numbers',
          jumpLabel: 'The numbers',
          title: 'What I can show.',
          blocks: [
            { kind: 'lead', p: 'The app is live on the App Store and Google Play and is used by 100+ merchants. Faster top-ups and clearer transaction states guided the design; merchant adoption is the product result recorded for this case.' },
            { kind: 'stats', h: 'In market', items: [
              { num: '100+', label: 'Merchants using the app' },
            ] },
          ],
        },
      ],
    },
  },
  {
    title: 'Flowy Design System',
    name: 'Flowy',
    slug: 'flowy-design-system',
    domain: 'Design system',
    tags: ['Design System'],
    desc: 'A work-in-progress agentic design system for OrderFlow’s guest app and admin, built around shared code, explicit contracts and enforceable rules.',
    short: 'An agentic design system in progress for two live products.',
    result: 'WIP · 21 shared components under review',
    art: { img: '/case/flowy/cover.jpg?v=2', poster: '/case/flowy/cover.jpg?v=2', thumb: '/case/flowy/cover.jpg?v=2', card: '/case/flowy/cover.jpg?v=2', text: 'Flowy', color: '#583207', bg: '#FFFBF7' },
    study: {
      layout: 'story',
      heading: 'Building an agentic design system from two live codebases',
      summary: 'Flowy is a work-in-progress agentic design system for OrderFlow’s guest app and admin. The products grew as separate codebases, so shared jobs developed different values, components and states. I am turning those live decisions into named tokens, written component contracts, a shared React package and rules that designers, developers, QA and coding agents can all follow. The 21-component Storybook catalog is now under review before product migration begins.',
      glance: {
        cols: 2,
        jumpLabel: 'Overview',
        items: [
          { label: 'Problem', value: 'Two live products had no shared source for the correct UI. Hard-coded values, library defaults and separate implementations allowed the same job to drift.' },
          { label: 'Purpose', value: 'Keep the UI consistent and give the whole product team a shared understanding of how it should work. Explicit contracts let designers, developers, QA and coding agents inspect, use and verify the same system.' },
          { label: 'Role', value: 'I lead the codebase audit, token naming, component contracts, shared React package, Storybook catalog and governance model.' },
          { label: 'Collaboration', value: 'I propose rules from the live products. Designer and QA review visual and behavioural accuracy, while engineering checks integration before acceptance.' },
          { label: 'Current state', value: 'The inventory, tokens, contracts and private package are in place. Twenty-one shared components are being reviewed in Storybook; screen migration has not started.' },
          { label: 'Principle', value: 'One job, one value. Shared jobs use one contract, while product-specific jobs keep their own component. Consistency does not require both products to look identical.' },
        ],
      },
      accent: '#583207',
      tags: ['Tokens', 'Components', 'Documentation'],
      role: 'Product Designer · System Lead',
      scope: ['Agentic Design System'],
      timeline: 'Ongoing',
      team: [],
      gallery: [],
      tools: 'React, Storybook',
      sections: [
        {
          id: 'next',
          nav: 'Next',
          jumpLabel: 'Next',
          title: 'The next phase makes the system enforceable.',
          blocks: [
            { kind: 'lead', p: 'A catalog alone is documentation. The agentic layer comes from giving people and coding agents the same component contracts, then checking those rules automatically. Once the catalog is accepted, I will turn the agreed decisions into migration and governance controls.' },
            { kind: 'list', items: [
              'Designer, engineering and QA accept the visual and behavioural contracts in the catalog.',
              'Write agent instructions from those contracts and add CI checks for raw colours and components used outside the shared package.',
              'Create screenshot baselines, list the drifted screens and migrate them one at a time with a visual comparison.',
              'Require every token or component change to include a pull request and changelog entry.',
              'Build the Figma library from the accepted names and states so design and code describe the same system.',
            ] },
          ],
        },
      ],
    },
  },
  {
    title: 'Poh Poh Digital Wallet',
    name: 'Poh Poh',
    slug: 'pohpoh',
    domain: 'Fintech',
    tags: ['Product Design', 'Mobile App'],
    desc: 'A mobile wallet for people in Myanmar to save money or build up gold in smaller amounts.',
    short: 'A mobile wallet for money and gold savings, refined until all four participants completed six tasks unaided.',
    result: 'All four participants completed six tasks unaided in the second test.',
    art: { img: '/case/pohpoh/cover.jpg', card: '/case/pohpoh/cover.jpg', text: 'Poh Poh', color: '#8e281b', bg: '#faeee8' },
    study: {
      layout: 'story',
      overviewNav: 'Project Overview',
      intro: false,
      role: 'UX/UI Designer',
      scope: ['Validated mobile prototype', 'IA, UI and usability testing'],
      timeline: '2024',
      metaIndustry: true,
      glance: {
        cols: 2,
        jumpLabel: 'Overview',
        items: [
          { label: 'About', value: 'Poh Poh is a mobile-wallet concept for a Myanmar gold shop. It brings money saving, gold saving, withdrawals and transaction history into one place.' },
          { label: 'Problem', value: 'The study focused on customers who wanted to build savings through small, repeated amounts instead of paying for a larger amount of gold at once.' },
          { label: 'Status', value: 'A validated high-fidelity prototype. This case ends after two usability-testing rounds; development and market adoption are outside its scope.' },
          { label: 'Role', value: 'I owned research synthesis, information architecture, wireframes, high-fidelity UI, the usability-testing plan and the design iterations.' },
          { label: 'Collaboration', value: 'Paing Aung Khant (Matt) and I interviewed participants. The shop explained its gold and transfer workflows; I translated the findings into the product structure and screens.' },
          { label: 'Result', value: 'In the second round, four participants completed the same six tasks without help. Average task time fell from 19.3 to 12.2 seconds, with a 4.5/5 ease-of-use rating.' },
        ],
      },
      sections: [
        {
          id: 'target-user',
          nav: 'Target user',
          blocks: [
            { kind: 'lead', p: 'The study focused on four participants who wanted to save money or gold in smaller amounts. We asked about their existing saving habits, familiar transfer methods and what they needed to trust the outcome of a transaction.' },
            { kind: 'illustrated-needs', items: [
              { src: '/case/pohpoh/need-saving-watercolor.webp', p: 'Save gold over time, even when the price is high.' },
              { src: '/case/pohpoh/need-transfers-watercolor.webp', p: 'Deposit and withdraw money or gold easily.' },
            ] },
          ],
        },
        {
          id: 'research',
          nav: 'Research',
          jumpLabel: 'Research',
          blocks: [
            { kind: 'lead', p: 'We began with an in-person interview at the shop to learn how gold was bought and sold. I then interviewed four participants with Paing Aung Khant (Matt). We asked how they planned savings, moved money and checked what happened after a transfer.' },
            { kind: 'split', h: 'From findings to decisions' },
            { kind: 'list', items: [
              'Familiar wallet transfers reduced the learning curve, so the flow keeps the existing transfer method and lets customers upload payment proof.',
              'The gold price affected how much people could set aside, so the amount in gold and the amount due in kyats appear together before payment.',
              'Delivery trust mattered, so a gold withdrawal offers pickup or delivery and shows who will deliver it.',
              'People needed to confirm what happened after a transfer, so history combines money and gold records with status, filters and a path to support.',
            ] },
          ],
        },
        {
          id: 'designing-the-product',
          nav: 'Designing the product',
          jumpLabel: 'Decisions',
          blocks: [
            { kind: 'lead', p: 'I mapped the findings into six tasks that could be designed and tested end to end.' },
            { kind: 'list', items: [
              'Save money.',
              'Withdraw money.',
              'Save gold.',
              'Withdraw gold.',
              'Edit personal details.',
              'Find a past transaction and its outcome.',
            ] },
            { kind: 'lead', p: 'I used those tasks to structure the information architecture, then developed the wireframes and high-fidelity prototype.' },
            { kind: 'split', items: [
              { h: 'Make the transaction checkable', p: 'The prototype shows the recipient, gold and kyat amounts, payment proof and transaction outcome so customers can review what they are doing and what happened next.' },
              { h: 'Treat account security as an open requirement', p: 'The research raised unauthorised deposits and withdrawals, but this prototype did not validate authentication or authorisation. Before development, the product would need account verification, confirmation for sensitive actions and shop-side access rules.' },
            ] },
          ],
        },
        {
          id: 'save-and-withdraw',
          nav: 'Save and withdraw money or gold',
          layout: 'aside',
          blocks: [
            { kind: 'lead', p: 'Users could move money through a digital wallet. After making a transfer, they uploaded a screenshot as proof.' },
            { kind: 'split', h: 'Show the transfer steps', p: 'A progress bar showed each transfer step and what users should do next.' },
            { kind: 'phones', alt: 'Transfer instructions with the wallet account and a copy button', items: [
              '/case/pohpoh/phones/transfer-2.webp?v=4',
            ] },
            { kind: 'split', h: 'Show the price before payment', p: 'The app showed the amount due in kyats before users continued to payment.' },
            { kind: 'phones', alt: 'Gold amount entry with quick amounts and the number pad', items: [
              '/case/pohpoh/phones/price-3.webp?v=4',
            ] },
            { kind: 'split', h: 'Offer pickup and delivery', p: 'Users could choose pickup or delivery and see who would bring their gold.' },
            { kind: 'phones', alt: 'Choosing delivery or pickup for a gold withdrawal', items: [
              '/case/pohpoh/phones/pickup-1.webp?v=4',
            ] },
          ],
        },
        {
          id: 'transaction-history',
          nav: 'Managing transaction history',
          layout: 'aside',
          blocks: [
            { kind: 'lead', p: 'History held past money and gold transactions in one place. A notification told users whether each transaction succeeded or failed.' },
            { kind: 'split', h: 'Find a past transaction', p: 'Date and transaction filters helped users find a past transaction more quickly.' },
            { kind: 'phones', alt: 'Transaction history and the date range filter', items: [
              '/case/pohpoh/phones/history-1.webp?v=4',
              '/case/pohpoh/phones/history-2.webp?v=4',
            ] },
            { kind: 'split', h: 'Get help with a failed transaction', p: 'Users could reach customer support quickly when a transaction needed extra attention.' },
            { kind: 'phones', alt: 'Transaction alerts and the customer support chat', items: [
              '/case/pohpoh/phones/support-1.webp?v=4',
              '/case/pohpoh/phones/support-3.webp?v=4',
            ] },
          ],
        },
        {
          id: 'usability-testing',
          nav: 'Usability testing + improvements',
          blocks: [
            { kind: 'lead', p: 'In the first round, four participants attempted the six tasks defined earlier. I recorded where they hesitated, needed help or could not find an action, then used those observations to revise the prototype.' },
            {
              kind: 'screen-comparison',
              h: 'A clearer home screen',
              before: { src: '/case/pohpoh/compare-home-before.webp?v=2', alt: 'Original wallet home with amounts above balance labels, small action labels and a View all link' },
              after: { src: '/case/pohpoh/compare-home-after.webp', alt: 'Revised wallet home with labels above amounts, outlined wallet buttons and a dedicated transaction history button' },
              notes: [
                { h: 'Balance labels', p: 'The label comes before the amount.', before: [62, 22], after: [28, 17] },
                { h: 'Wallet actions', p: 'Larger labels and outlined buttons make the actions easier to see.', before: [74, 61], after: [29, 55] },
                { h: 'Transaction history', p: 'A labelled button makes the history easier to find.', before: [78, 67], after: [71, 69] },
              ],
            },
            {
              kind: 'screen-comparison',
              h: 'Clearer transfer steps',
              before: { src: '/case/pohpoh/compare-transfer-before.webp?v=2', alt: 'Original gold transfer screen with a thin progress line and the amount above the receiving account' },
              after: { src: '/case/pohpoh/compare-transfer-after.webp', alt: 'Revised gold transfer screen with a stronger progress line, a highlighted receiving account and the totals below it' },
              notes: [
                { h: 'Progress', p: 'A stronger line and shorter labels make the two steps clearer.', before: [72, 19], after: [29, 18] },
                { h: 'Receiving account', p: 'The highlighted account moves above the gold and kyat amounts.', before: [75, 56], after: [27, 41] },
                { h: 'Amount due', p: 'The gold amount and the price sit together below the account.', before: [69, 35], after: [32, 78] },
              ],
            },
            {
              kind: 'screen-comparison',
              h: 'Key actions stand out',
              before: { src: '/case/pohpoh/compare-history-before.webp?v=2', alt: 'Original transaction history with lightly outlined filter buttons' },
              after: { src: '/case/pohpoh/compare-history-after.webp', alt: 'Revised transaction history with solid orange date and transaction type buttons' },
              notes: [
                { h: 'History filters', p: 'Solid buttons make the date and transaction type filters easier to spot.', before: [70, 18], after: [29, 18] },
              ],
            },
          ],
        },
        {
          id: 'second-round-testing',
          nav: 'Second round of user testing',
          jumpLabel: 'Result',
          blocks: [
            { kind: 'lead', p: 'After the changes, a second round tested the same six tasks with four participants. All four completed every task without assistance.' },
            { kind: 'stats', items: [
              { num: '100%', label: 'Task completion without help' },
              { num: '12.2 s', label: 'Average time on task, down from 19.3 s' },
              { num: '4.5/5', label: 'Ease-of-use rating' },
            ] },
          ],
        },
        {
          id: 'takeaways',
          nav: 'Takeaways',
          blocks: [
            { kind: 'split', items: [
              { h: 'Design for the person making the transfer', p: 'People need to know what they will pay, what proof to send and where to check the outcome.' },
              { h: 'Test again after making changes', p: 'Watching people use the prototype helped me see where the screens needed to make those answers clearer.' },
              { h: 'Learn how money moves', p: 'Understanding the balance, security checks and transfer steps helped me see what a wallet needs to show at each point.' },
            ] },
          ],
        },
      ],
    },
  },
  {
    title: 'UZ',
    name: 'UZ',
    slug: 'uz-branding',
    domain: 'Visual Identity',
    tags: ['Visual Identity'],
    desc: 'A premium womenswear identity: the initials as one mark, four colours, and the same rules from the tag to the shop.',
    short: 'Identity for a premium womenswear label.',
    result: 'One mark, from the tag to the shop',
    art: { img: '/case/uz-branding/cover.jpg', poster: '/case/uz-branding/logo-motion-v8.jpg', video: '/case/uz-branding/logo-motion-v8.mp4', thumb: '/case/uz-branding/cover.jpg', card: '/case/uz-branding/cover.jpg', text: 'UZ', color: '#F7EEEC', bg: '#C48A93' },
    study: {
      layout: 'story',
      ref: true,
      heading: 'Made to move with you',
      summary: 'UZ is a premium womenswear label for adult women. The identity is built from one mark, four colours and a short set of rules, applied the same way from the tag to the shopfront.',
      accent: '#C48A93',
      tags: ['Identity', 'Colour', 'Packaging'],
      role: 'Brand Designer',
      scope: ['Logo, colour, applications'],
      timeline: '2026',
      team: [],
      gallery: [],
      tools: 'Figma',
      sections: [
        {
          id: 'brief',
          nav: 'The brief',
          title: 'Soft, never girlish',
          blocks: [
            { kind: 'lead', p: 'UZ is a premium womenswear label for the Myanmar market, aimed at women who prefer understated, long-wearing pieces over trend-led or girlish styling. Premium means good fabric and careful finishing; feminine means soft lines without decorative excess. The brief was to set those qualities into rules that could carry from a garment tag to a shopfront.' },
            { kind: 'split', cols: 3, items: [
              { h: 'Price segment', p: 'Premium womenswear, expressed through material quality, finishing and restraint rather than loud luxury cues.' },
              { h: 'Customer', p: 'Women looking for polished, feminine clothes they can return to for years, rather than pieces tied to one short trend.' },
              { h: 'Competitive frame', p: 'Quieter than trend-heavy boutique branding and less formal than traditional luxury. UZ needed to feel contemporary, soft and lasting.' },
            ] },
            { kind: 'pillars', items: [
              { title: 'Premium', line: 'Good fabric, careful finishing', video: '/case/uz-branding/id-premium.mp4', poster: '/case/uz-branding/id-premium.jpg', alt: 'Close-up of a sewing needle stitching cream linen, the seam building stitch by stitch' },
              { title: 'Feminine', line: 'Soft lines, never girlish', video: '/case/uz-branding/id-feminine.mp4', poster: '/case/uz-branding/id-feminine.jpg', alt: 'Dusty rose silk drifting and folding in slow waves' },
              { title: 'Made to last', line: 'Worn for years, not a season', video: '/case/uz-branding/id-lasting.mp4', poster: '/case/uz-branding/id-lasting.jpg', alt: 'Hands smoothing a tailored jacket flat on a pale counter' },
            ] },
          ],
        },
        {
          id: 'mark',
          nav: 'The mark',
          title: 'Only the initials',
          blocks: [
            { kind: 'lead', p: 'I explored wordmark-only directions, separate fashion symbols and monograms built from the initials. The mark needed to feel distinctive without decoration, remain recognisable without the full name and work from a small woven label to a shop sign. The joined UZ monogram met those requirements most directly.' },
            { kind: 'split', cols: 2, items: [
              { h: 'Selection criteria', p: 'The U and Z had to remain identifiable, work in one colour, hold together at small sizes and feel quiet enough to sit beside the clothes.' },
              { h: 'Refining the form', p: 'I made the U taller, stepped the Z downward and adjusted their overlap until the two letters read as one gesture without closing the negative space.' },
              { h: 'Checking the smallest use', p: 'The icon was checked at profile-picture and woven-label scale, where fine details disappear first. The simplified silhouette stayed recognisable.' },
              { h: 'Building the variants', p: 'Primary carries the brand alone; stacked adds the name for tags and packaging; horizontal fits websites and signs; the icon handles the smallest square spaces.' },
            ] },
          ],
        },
        {
          id: 'system',
          nav: 'Colour and type',
          title: 'Four colours, two families',
          blocks: [
            { kind: 'lead', p: 'Four colours, and nothing outside them. Petal carries most surfaces, Blush takes the panels, Dusty Rose the covers and bags, and Mulberry signs everything. Cormorant Garamond sets the headlines; Jost does the body and labels.' },
            { kind: 'shot', src: '/case/uz-branding/use-18-lookbook-v9.jpg', alt: 'Lookbook spread with a model against a tall window, the facing page carrying the UZ monogram above the Burmese headline သင့်နှင့်အတူ လှုပ်ရှားရန် and a two-line paragraph' },
          ],
        },
        {
          id: 'languages',
          nav: 'Two languages',
          title: 'English and Burmese together',
          blocks: [
            { kind: 'lead', p: 'Both languages look calm and equal. The English note sets its greeting in a serif and its body in a quiet sans; the Burmese note takes the same card with more line spacing, no italics and no tracking.' },
            { kind: 'bilingual',
              en: {
                greet: 'Dear you,',
                body: 'Thank you for choosing UZ. This piece was cut and finished with care, to move with you softly, and to stay with you for years to come.',
              },
              my: {
                greet: 'မင်္ဂလာပါ',
                body: 'UZ ကို ရွေးချယ်ပေးလို့ ကျေးဇူးတင်ပါတယ်။ ဒီအထည်လေးကို အချိန်ယူ ဂရုတစိုက် ချုပ်လုပ်ထားပါတယ်။ ဝတ်ဆင်တိုင်း သင့်နေ့တစ်နေ့ကို ပိုပျော်စေဖို့ လုပ်ပေးချင်ပါတယ်။',
              },
              notes: [
                { label: 'Burmese', value: 'More line spacing' },
                { label: 'Burmese', value: 'No italics, no tracking' },
                { label: 'The name', value: 'UZ stays in Latin' },
                { label: 'Per side', value: 'One language only' },
              ] },
          ],
        },
        {
          id: 'print',
          nav: 'Print and packaging',
          title: 'The tag, the label, the box',
          blocks: [
            { kind: 'lead', p: 'Every piece leaves with a thank-you tag, a woven label at the neck and a cotton dust bag. The box is Dusty Rose outside, with the pattern on the tissue inside. The pattern is never used on the street.' },
            { kind: 'shot', natural: true, src: '/case/uz-branding/use-02-tag-v2.jpg', alt: 'Dusty Rose and ivory thank-you tags: the UZ mark blind-embossed on the front, a handwritten-style note and QR code on the back' },
            { kind: 'shot', src: '/case/uz-branding/use-19-invitation.jpg', alt: 'The invitation and its Dusty Rose envelope' },
          ],
        },
        {
          id: 'space',
          nav: 'In the city',
          title: 'The shopfront',
          blocks: [
            { kind: 'lead', p: 'Outside, the brand goes quiet: a Dusty Rose fascia, one photograph in the window, and the mark on the glass. That is the whole shopfront — nothing else needed.' },
            { kind: 'shot', src: '/case/uz-branding/env-12-shopfront.jpg', alt: 'The shopfront at dusk, warm light inside and the mark on the glass' },
          ],
        },
        {
          id: 'digital',
          nav: 'Digital',
          title: 'Quieter on screen',
          blocks: [
            { kind: 'lead', p: 'On the phone and on the web, the layout keeps the same restraint. The clothes lead; the mark holds the corner.' },
            { kind: 'duo', images: [
              { src: '/case/uz-branding/dig-09-profile.jpg', alt: 'The Instagram profile on a phone, lying on blush silk', crop: '50% 50%' },
              { src: '/case/uz-branding/dig-10-story.jpg', alt: 'Three story posts: the collection, the message and the shop', crop: '50% 50%' },
            ] },
            { kind: 'shot', src: '/case/uz-branding/dig-11-website.jpg', alt: 'The website on a laptop, the new collection in the hero' },
          ],
        },
      ],
    },
  },

]

// Project order on the home page and in the case study pager.
export const HOME_WORK = ['orderflow', 'superfine-employee', 'flowy-design-system', 'pohpoh', 'mtb-pay-merchant', 'uz-branding']
export const MORE_WORK = []

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
    quote: 'Sai Myo Thu is a creative and detail-oriented designer. He listens well, contributes fresh ideas, and collaborates effectively.',
    name: 'Aung Kaung Myat',
    role: 'Design Lead, Dinger',
    photo: '/people/aung-kaung-myat.jpg',
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
  headline: ['Understand the people and the business first,', 'then make it simple to use.'],
  bio: [
    'I’m 23, a product designer at Heizen. I design OrderFlow, the ordering system cafés in Myanmar use from table to kitchen. I believe less is more: clear communication and sound judgement help me decide what to keep and what to cut.',
    'I started making social, print and campaign visuals in 2023, moved into product UI in 2024, and joined Heizen in 2025. I start with a user or business problem, find a solution before drawing screens, and work closely with the team to build it, writing code when needed.',
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
    2025: { text: 'A busy year: Prime Ace Limousine, more work at Dinger, then joining Heizen and designing OrderFlow. Started seeing design as part of the business.' },
    2026: { text: 'Leading product design at Heizen while building OrderFlow for F&B businesses. Most days sit between strategy, systems and shipping.' },
  },
  // Roles (any order). `start`/`end` are 'YYYY-MM'; `end: null` means present.
  // `logo` is optional (falls back to the company initial on a tile).
  // `note` (optional) shows when the row is opened.
  experience: [
    { co: 'OrderFlow', role: 'Co-Founder & Product Designer', start: '2025-11', end: null, logo: '/logos/orderflow-icon.png', note: 'QR table ordering for cafés, restaurants and tea houses in Myanmar. I lead product and design.' },
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
