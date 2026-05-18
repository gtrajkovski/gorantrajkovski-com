/* ───────── Hosted Cognition · Interactive Outline · data ─────────
   All content used by the interactive sections.
   Glyph SVGs are inline strings; each one is the chapter's case in line.
*/

window.HCO = (function () {

  /* ───── ARC: per-part detail panel content ───── */
  const PARTS = {
    1: {
      pn: "Part I  ·  pages 19–42",
      title: "The Reframe",
      chaps: "Ch. 1  ·  Ch. 2",
      body: [
        "The analytical vocabulary of AI has not kept up with the work. The layer where the consequential action occurs has moved several rungs up the stack — from individual models to the orchestration infrastructure inside which those models now operate. The first two chapters establish the reframe.",
        "<em class='swash'>Chapter One</em> opens with a coding agent that, under an explicit instructional freeze, deletes a live production database — and then produces fluent remorse for the deletion. The failure was not in the model. <em class='swash'>Chapter Two</em> argues that current safety verification has stabilised on a form (benchmarks, model cards, voluntary commitments) that does not perform the function it claims under the conditions of deployment now in front of us."
      ]
    },
    2: {
      pn: "Part II  ·  pages 43–88",
      title: "The Cognitive Substrate",
      chaps: "Ch. 3  ·  Ch. 4  ·  Ch. 5",
      body: [
        "Predictive scaffolds have stopped being a tool and started being a medium. The middle three chapters describe the substrate inside which everyday cognitive work is now performed, and the residue that substrate leaves on the people moving through it.",
        "<em class='swash'>Chapter Three</em> names the technical object — the <em class='accent'>adaptive predictive scaffold</em> — and traces it through a longer history, from the 1986 calculator debates to today's autocomplete. <em class='swash'>Chapter Four</em> revisits Cambridge Analytica to show how a platform forms a cognitive shadow of people who never signed up. <em class='swash'>Chapter Five</em> describes invisible lock-in: not captivity but the feeling of fluency that makes return seem like preference."
      ]
    },
    3: {
      pn: "Part III  ·  pages 89–128",
      title: "Platforms as Polities",
      chaps: "Ch. 6  ·  Ch. 7  ·  Ch. 8",
      body: [
        "Once the substrate is constituted, platforms exercise authority over its conditions. The third part shows the political form this authority has been taking — sometimes by negotiation, sometimes by unilateral act.",
        "<em class='swash'>Chapter Six</em> opens with Facebook's five-day Australian news ban in February 2021, which inadvertently blocked state health departments, fire services, and 1800RESPECT. <em class='swash'>Chapter Seven</em> describes how Anthropic's Model Context Protocol (released 25 November 2024) became the de-facto integration standard inside twelve months. <em class='swash'>Chapter Eight</em> documents the same hardware producing different formations in affluent versus low-income classrooms."
      ]
    },
    4: {
      pn: "Part IV  ·  pages 129–162",
      title: "The Formation Argument",
      chaps: "Ch. 9  ·  Ch. 10",
      body: [
        "The formation argument is the book's load-bearing claim. The subject is not using the infrastructure; the subject is being formed inside it. The fourth part makes that claim precise.",
        "<em class='swash'>Chapter Nine</em> takes the scene of a seventeen-year-old asked to write a college admissions essay without their scaffold, and locates the difficulty not as writer's block but as the absence of a developmental experience that was supposed to happen alone. <em class='swash'>Chapter Ten</em> sets the demographics of the 119th Congress against the demographics of teenage chatbot use and asks who, structurally, is writing the policy."
      ]
    },
    5: {
      pn: "Part V  ·  pages 163–196",
      title: "The Closing Window",
      chaps: "Ch. 11  ·  Ch. 12  ·  Coda",
      body: [
        "Industrial democracies have an institutional answer to crises of this kind, and it is reactive: an inquiry, a 900-page act, a new agency. The fifth part argues that the answer arrives too late if it arrives at all in the usual form.",
        "<em class='swash'>Chapter Eleven</em> reads the 2008 financial crisis as a template for what catastrophic regulation looks like and why the present moment cannot afford it. <em class='swash'>Chapter Twelve</em> takes Sweden's August 2023 reversal of mandatory classroom digitalisation as a case of state intervention in cognitive infrastructure. The <em class='swash'>Coda</em> closes with a brief argument for writing a book that earns its disagreement."
      ]
    }
  };

  /* ───── CHAPTER MAP ───── */
  // glyph(): returns an inline SVG string in the schematic style.
  const G = (inner) => `<svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;

  // common: dotted field
  const dots = (cx, cy) => {
    let s = "";
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
      const r = ((x + y) % 3 === 0) ? 1.2 : 0.8;
      s += `<circle cx="${cx + x * 3.2}" cy="${cy + y * 3.2}" r="${r}" fill="#23436b" opacity="0.55"/>`;
    }
    return s;
  };

  const CHAPTERS = [

    /* PART I */
    { part: "I",  name: "The Reframe" },

    {
      n: "1", word: "Chapter One", title: "From Capability to Coordination",
      thesis: "A coding agent, under an explicit freeze, deletes a production database and then produces fluent remorse. The failure is not in the model. It is in the system that allowed a constrained agent to execute destructive operations against production without a check.",
      caseLabel: "Replit · July 2025",
      aside: "The frontier moved from <em>what models can do</em> to <em>what systems of models do together</em>.",
      glyph: G(`
        <!-- a controlled cage with an arrow escaping -->
        <rect x="14" y="22" width="60" height="62" fill="none" stroke="#23436b" stroke-width="1"/>
        <line x1="14" y1="38" x2="74" y2="38" stroke="#23436b" stroke-width="0.6"/>
        <text x="18" y="34" font-family="IBM Plex Mono" font-size="6" fill="#7d7468">FREEZE</text>
        <circle cx="30" cy="56" r="3" fill="#23436b"/>
        <circle cx="46" cy="56" r="3" fill="none" stroke="#23436b" stroke-width="1"/>
        <circle cx="62" cy="56" r="3" fill="#23436b"/>
        <line x1="30" y1="56" x2="62" y2="56" stroke="#23436b" stroke-width="0.6"/>
        <line x1="46" y1="56" x2="46" y2="70" stroke="#23436b" stroke-width="0.6"/>
        <circle cx="46" cy="70" r="2.4" fill="#b95527"/>
        <!-- escape -->
        <path d="M 46 70 L 46 84 L 84 84" fill="none" stroke="#b95527" stroke-width="1.2"/>
        <polygon points="84,80 90,84 84,88" fill="#b95527"/>
        <rect x="96" y="80" width="14" height="8" fill="none" stroke="#b95527" stroke-width="0.9"/>
        <text x="97" y="76" font-family="IBM Plex Mono" font-size="5" fill="#b95527">PROD</text>
      `)
    },
    {
      n: "2", word: "Chapter Two", title: "Theater of Verification",
      thesis: "Benchmarks measure what they were calibrated to measure. Under optimisation pressure, scores stop being a signal of capability and start being a signal of training to the test. Adjacent domains — aviation, pharmaceuticals — verify differently.",
      caseLabel: "Model cards · 2024–26",
      aside: "Form has stabilised; the function has not.",
      glyph: G(`
        <!-- a stage with a metric and a curtain -->
        <rect x="12" y="76" width="96" height="2" fill="#23436b"/>
        <line x1="12" y1="78" x2="20" y2="92" stroke="#23436b" stroke-width="0.8"/>
        <line x1="108" y1="78" x2="100" y2="92" stroke="#23436b" stroke-width="0.8"/>
        <!-- curtains -->
        <path d="M 22 18 Q 24 36 22 60 Q 30 60 32 36 Q 30 22 22 18 Z" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <path d="M 98 18 Q 96 36 98 60 Q 90 60 88 36 Q 90 22 98 18 Z" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <line x1="14" y1="18" x2="106" y2="18" stroke="#23436b" stroke-width="0.8"/>
        <!-- metric on stage -->
        <text x="40" y="56" font-family="IBM Plex Mono" font-size="7" fill="#b95527" font-weight="600">93.2</text>
        <text x="40" y="64" font-family="IBM Plex Mono" font-size="4.5" fill="#7d7468">MMLU</text>
        <line x1="38" y1="68" x2="78" y2="68" stroke="#b95527" stroke-width="1.1"/>
        <!-- bars below -->
        <rect x="40" y="84" width="4" height="6" fill="#23436b"/>
        <rect x="48" y="82" width="4" height="8" fill="#23436b"/>
        <rect x="56" y="80" width="4" height="10" fill="#23436b"/>
        <rect x="64" y="78" width="4" height="12" fill="#b95527"/>
        <rect x="72" y="84" width="4" height="6" fill="#23436b"/>
      `)
    },

    /* PART II */
    { part: "II", name: "The Cognitive Substrate" },

    {
      n: "3", word: "Chapter Three", title: "Adaptive Predictive Scaffolds",
      thesis: "The NCTM adopted a position on calculators in 1986; by 2000 the integration was consensus. The book's central technical object — the adaptive predictive scaffold — is the same kind of integration, two decades earlier in its life.",
      caseLabel: "NCTM · 1986",
      aside: "What ends a pedagogical debate is rarely evidence. It is time.",
      glyph: G(`
        <!-- writing hand with ghosted continuation -->
        <line x1="18" y1="78" x2="58" y2="78" stroke="#23436b" stroke-width="1"/>
        <line x1="18" y1="86" x2="48" y2="86" stroke="#23436b" stroke-width="1"/>
        <line x1="18" y1="94" x2="38" y2="94" stroke="#23436b" stroke-width="0.6"/>
        <!-- pen -->
        <line x1="38" y1="94" x2="48" y2="62" stroke="#23436b" stroke-width="1.4"/>
        <circle cx="48" cy="62" r="3" fill="#23436b"/>
        <!-- ghost continuation -->
        <line x1="48" y1="78" x2="92" y2="78" stroke="#b95527" stroke-width="0.7" stroke-dasharray="2 2"/>
        <line x1="48" y1="86" x2="84" y2="86" stroke="#b95527" stroke-width="0.7" stroke-dasharray="2 2"/>
        <line x1="38" y1="94" x2="78" y2="94" stroke="#b95527" stroke-width="0.7" stroke-dasharray="2 2"/>
        <text x="62" y="46" font-family="IBM Plex Mono" font-size="6" fill="#b95527" opacity="0.8">next?</text>
        <path d="M 60 50 L 70 56" stroke="#b95527" stroke-width="0.6" stroke-dasharray="1 2"/>
        <!-- top: framing dots -->
        <circle cx="22" cy="22" r="1.4" fill="#23436b"/>
        <circle cx="32" cy="22" r="1.4" fill="#23436b"/>
        <circle cx="42" cy="22" r="1.4" fill="#23436b"/>
      `)
    },
    {
      n: "4", word: "Chapter Four", title: "The Cognitive Shadow",
      thesis: "Facebook's shadow profiles, accumulated across a network of friends-and-family uploads, formed structured representations of people who never signed up. The chapter generalises the pattern to the AI substrate.",
      caseLabel: "Cambridge Analytica · April 2018",
      aside: "You cast a shadow on a platform whether or not you ever step onto it.",
      glyph: G(`
        <!-- one figure casting many shadows -->
        <circle cx="36" cy="40" r="6" fill="#23436b"/>
        <line x1="36" y1="46" x2="36" y2="68" stroke="#23436b" stroke-width="1.4"/>
        <line x1="36" y1="52" x2="28" y2="62" stroke="#23436b" stroke-width="1"/>
        <line x1="36" y1="52" x2="44" y2="62" stroke="#23436b" stroke-width="1"/>
        <line x1="36" y1="68" x2="30" y2="84" stroke="#23436b" stroke-width="1"/>
        <line x1="36" y1="68" x2="42" y2="84" stroke="#23436b" stroke-width="1"/>
        <!-- shadows splayed right -->
        <g opacity="0.55">
          <ellipse cx="64" cy="92" rx="8" ry="2" fill="#23436b"/>
          <ellipse cx="78" cy="92" rx="8" ry="2" fill="#23436b" opacity="0.7"/>
          <ellipse cx="92" cy="92" rx="8" ry="2" fill="#23436b" opacity="0.5"/>
          <ellipse cx="106" cy="92" rx="8" ry="2" fill="#23436b" opacity="0.35"/>
        </g>
        <!-- inference lines -->
        <line x1="46" y1="40" x2="64" y2="88" stroke="#b95527" stroke-width="0.6"/>
        <line x1="46" y1="40" x2="78" y2="88" stroke="#b95527" stroke-width="0.6"/>
        <line x1="46" y1="40" x2="92" y2="88" stroke="#b95527" stroke-width="0.6"/>
        <line x1="46" y1="40" x2="106" y2="88" stroke="#b95527" stroke-width="0.4"/>
        <circle cx="46" cy="40" r="1.4" fill="#b95527"/>
      `)
    },
    {
      n: "5", word: "Chapter Five", title: "Invisible Lock-In",
      thesis: "The user does not return because they failed at switching. They return because the alternative felt like work and the original feels like fluency. Lock-in is the experience of being known.",
      caseLabel: "Platform migration · 2010s–",
      aside: "Captivity that feels like preference is the structure to name.",
      glyph: G(`
        <!-- a door swung open, but a worn path returning -->
        <rect x="16" y="22" width="30" height="62" fill="none" stroke="#23436b" stroke-width="1"/>
        <line x1="16" y1="22" x2="46" y2="22" stroke="#23436b" stroke-width="1"/>
        <!-- door open -->
        <line x1="46" y1="22" x2="62" y2="14" stroke="#23436b" stroke-width="0.9"/>
        <line x1="46" y1="84" x2="62" y2="76" stroke="#23436b" stroke-width="0.9"/>
        <line x1="62" y1="14" x2="62" y2="76" stroke="#23436b" stroke-width="0.9"/>
        <!-- person inside -->
        <circle cx="30" cy="42" r="3" fill="#23436b"/>
        <line x1="30" y1="46" x2="30" y2="62" stroke="#23436b" stroke-width="1.2"/>
        <line x1="30" y1="52" x2="26" y2="58" stroke="#23436b" stroke-width="0.8"/>
        <line x1="30" y1="52" x2="34" y2="58" stroke="#23436b" stroke-width="0.8"/>
        <!-- arrow out, then back -->
        <path d="M 46 60 Q 78 60 86 50" fill="none" stroke="#b95527" stroke-width="0.9"/>
        <path d="M 86 50 Q 96 40 92 30" fill="none" stroke="#b95527" stroke-width="0.9" stroke-dasharray="2 2"/>
        <path d="M 92 78 Q 78 78 56 64" fill="none" stroke="#b95527" stroke-width="0.9"/>
        <polygon points="58,60 52,64 58,68" fill="#b95527"/>
      `)
    },

    /* PART III */
    { part: "III", name: "Platforms as Polities" },

    {
      n: "6", word: "Chapter Six", title: "Cognitive Sovereigns",
      thesis: "On 17 February 2021, Facebook restricted Australian news. The ban inadvertently blocked Queensland Health mid-vaccine rollout, the Bureau of Meteorology, fire services, and 1800RESPECT. The platform exercised an authority that the political theory of the state would call sovereign.",
      caseLabel: "Facebook · 17 Feb 2021 · Australia",
      aside: "Sovereignty is what does the unilateral act and what survives it.",
      glyph: G(`
        <!-- a map of australia with a cut/red line through it -->
        <path d="M 24 50 Q 30 36 50 36 Q 70 32 86 42 Q 100 48 96 64 Q 92 80 70 84 Q 50 86 36 80 Q 22 72 22 60 Z"
              fill="none" stroke="#23436b" stroke-width="1.1"/>
        <!-- nodes inside (services) -->
        <circle cx="46" cy="56" r="2" fill="#23436b"/>
        <circle cx="62" cy="50" r="2" fill="#23436b"/>
        <circle cx="76" cy="60" r="2" fill="#23436b"/>
        <circle cx="56" cy="70" r="2" fill="#23436b"/>
        <circle cx="70" cy="72" r="2" fill="#23436b"/>
        <!-- the cut -->
        <line x1="14" y1="40" x2="106" y2="78" stroke="#b95527" stroke-width="1.6"/>
        <circle cx="14" cy="40" r="2" fill="#b95527"/>
        <circle cx="106" cy="78" r="2" fill="#b95527"/>
        <text x="24" y="100" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">17 / 02 / 21</text>
      `)
    },
    {
      n: "7", word: "Chapter Seven", title: "Standards War",
      thesis: "Anthropic released MCP on 25 November 2024 under a permissive licence. Within twelve months the SDK was downloading at roughly 97 million per month and every major lab had implemented it. The standard that won was the open one — and the question becomes who governs the standard.",
      caseLabel: "Model Context Protocol · 25 Nov 2024",
      aside: "The protocol is the polity's constitutional layer.",
      glyph: G(`
        <!-- competing standards converging on one -->
        <circle cx="22" cy="32" r="6" fill="none" stroke="#23436b" stroke-width="1"/>
        <text x="18" y="35" font-family="IBM Plex Mono" font-size="5" fill="#23436b">A</text>
        <circle cx="22" cy="62" r="6" fill="none" stroke="#23436b" stroke-width="1"/>
        <text x="18" y="65" font-family="IBM Plex Mono" font-size="5" fill="#23436b">B</text>
        <circle cx="22" cy="92" r="6" fill="none" stroke="#23436b" stroke-width="1"/>
        <text x="18" y="95" font-family="IBM Plex Mono" font-size="5" fill="#23436b">C</text>
        <!-- arrows to MCP -->
        <line x1="30" y1="32" x2="74" y2="58" stroke="#23436b" stroke-width="0.6"/>
        <line x1="30" y1="62" x2="74" y2="62" stroke="#b95527" stroke-width="1.2"/>
        <line x1="30" y1="92" x2="74" y2="66" stroke="#23436b" stroke-width="0.6"/>
        <!-- MCP node -->
        <rect x="74" y="50" width="34" height="24" fill="none" stroke="#b95527" stroke-width="1.4"/>
        <text x="78" y="66" font-family="IBM Plex Mono" font-size="8" fill="#b95527" font-weight="600">MCP</text>
        <line x1="74" y1="56" x2="108" y2="56" stroke="#b95527" stroke-width="0.4"/>
      `)
    },
    {
      n: "8", word: "Chapter Eight", title: "Stratified Subject Formation",
      thesis: "The same hardware, deployed in affluent and low-income schools, produces visibly different educational experiences. The pattern documented by Darling-Hammond in K-12 technology has extended unaltered into the AI substrate.",
      caseLabel: "Stanford GSE report · 2010s",
      aside: "Two schools, the same software, two formations.",
      glyph: G(`
        <!-- two buildings, two student outcomes -->
        <rect x="14" y="50" width="34" height="40" fill="none" stroke="#23436b" stroke-width="1"/>
        <rect x="18" y="56" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="26" y="56" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="34" y="56" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="18" y="68" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="26" y="68" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="34" y="68" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="72" y="50" width="34" height="40" fill="none" stroke="#23436b" stroke-width="1"/>
        <rect x="76" y="56" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="84" y="56" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="92" y="56" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="76" y="68" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="84" y="68" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <rect x="92" y="68" width="4" height="6" fill="#23436b" opacity="0.4"/>
        <!-- outputs -->
        <path d="M 31 50 L 31 34 L 50 34" fill="none" stroke="#23436b" stroke-width="1"/>
        <path d="M 89 50 L 89 34 L 70 34" fill="none" stroke="#b95527" stroke-width="1"/>
        <text x="38" y="28" font-family="IBM Plex Mono" font-size="6" fill="#23436b">EXTEND</text>
        <text x="56" y="20" font-family="IBM Plex Mono" font-size="6" fill="#b95527">REPLACE</text>
        <!-- same software label -->
        <line x1="48" y1="100" x2="72" y2="100" stroke="#7d7468" stroke-width="0.6" stroke-dasharray="2 2"/>
        <text x="44" y="108" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">same software</text>
      `)
    },

    /* PART IV */
    { part: "IV", name: "The Formation Argument" },

    {
      n: "9", word: "Chapter Nine", title: "Subjects Before Sovereignty",
      thesis: "A seventeen-year-old sits down to write a college admissions essay without their scaffold and finds the genre asks for something the developmental experience of writing alongside a scaffold has not produced. The difficulty is not block. It is formation.",
      caseLabel: "The personal statement · 2025–",
      aside: "Sovereignty over a subject implies a subject that has been formed independently of the sovereign.",
      glyph: G(`
        <!-- silhouette with thought bubbles, some empty -->
        <circle cx="40" cy="52" r="10" fill="none" stroke="#23436b" stroke-width="1.1"/>
        <line x1="40" y1="62" x2="40" y2="90" stroke="#23436b" stroke-width="1.4"/>
        <line x1="40" y1="72" x2="30" y2="84" stroke="#23436b" stroke-width="0.8"/>
        <line x1="40" y1="72" x2="50" y2="84" stroke="#23436b" stroke-width="0.8"/>
        <!-- thought bubbles -->
        <circle cx="68" cy="30" r="6" fill="none" stroke="#23436b" stroke-width="0.8"/>
        <circle cx="82" cy="22" r="8" fill="none" stroke="#23436b" stroke-width="0.8"/>
        <circle cx="96" cy="34" r="10" fill="none" stroke="#b95527" stroke-width="1"/>
        <!-- small bubbles -->
        <circle cx="58" cy="40" r="1.4" fill="#23436b"/>
        <circle cx="62" cy="36" r="1" fill="#23436b"/>
        <!-- the largest bubble is empty -->
        <text x="91" y="38" font-family="IBM Plex Mono" font-size="9" fill="#b95527">?</text>
      `)
    },
    {
      n: "10", word: "Chapter Ten", title: "Generational Asymmetry",
      thesis: "Median age of the 119th Senate: 64.7. Daily chatbot use among 15-to-17-year-olds: 31%. The people writing the policy and the people forming inside the technology are not the same cohort, and the asymmetry is structural.",
      caseLabel: "119th Congress · 3 Jan 2025",
      aside: "Policy from one cohort, formation in another. The mismatch is a feature of the moment.",
      glyph: G(`
        <!-- two histograms facing -->
        <line x1="16" y1="90" x2="104" y2="90" stroke="#23436b" stroke-width="0.8"/>
        <!-- congress (older, leans right) -->
        <rect x="18" y="78" width="6" height="12" fill="#23436b" opacity="0.45"/>
        <rect x="26" y="72" width="6" height="18" fill="#23436b" opacity="0.6"/>
        <rect x="34" y="64" width="6" height="26" fill="#23436b" opacity="0.7"/>
        <rect x="42" y="56" width="6" height="34" fill="#23436b"/>
        <rect x="50" y="50" width="6" height="40" fill="#23436b"/>
        <text x="20" y="100" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">CONGRESS</text>
        <!-- ai users (younger, leans left) -->
        <rect x="64" y="50" width="6" height="40" fill="#b95527"/>
        <rect x="72" y="56" width="6" height="34" fill="#b95527" opacity="0.85"/>
        <rect x="80" y="64" width="6" height="26" fill="#b95527" opacity="0.7"/>
        <rect x="88" y="72" width="6" height="18" fill="#b95527" opacity="0.55"/>
        <rect x="96" y="78" width="6" height="12" fill="#b95527" opacity="0.4"/>
        <text x="64" y="100" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">AI USERS</text>
        <!-- axis labels -->
        <text x="16" y="34" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">AGE →</text>
      `)
    },

    /* PART V */
    { part: "V",  name: "The Closing Window" },

    {
      n: "11", word: "Chapter Eleven", title: "Catastrophic Pattern",
      thesis: "Industrial democracy has a default answer to crises of this kind: an inquiry, a 900-page Act, a new agency. The chapter reads 2008 as a template and argues that the present moment cannot afford to wait for the catastrophic version.",
      caseLabel: "Dodd-Frank · 21 Jul 2010 (after the fact)",
      aside: "The reactive form arrives after the cost of being right has already been paid.",
      glyph: G(`
        <!-- a falling line with a regulation block dropped after -->
        <line x1="14" y1="32" x2="38" y2="32" stroke="#23436b" stroke-width="0.9"/>
        <line x1="38" y1="32" x2="62" y2="82" stroke="#b95527" stroke-width="1.6"/>
        <line x1="62" y1="82" x2="84" y2="82" stroke="#23436b" stroke-width="0.9"/>
        <circle cx="38" cy="32" r="2" fill="#23436b"/>
        <circle cx="62" cy="82" r="3" fill="#b95527"/>
        <!-- regulatory block placed AFTER -->
        <rect x="70" y="60" width="26" height="20" fill="none" stroke="#23436b" stroke-width="1.1"/>
        <line x1="72" y1="66" x2="94" y2="66" stroke="#23436b" stroke-width="0.5"/>
        <line x1="72" y1="70" x2="94" y2="70" stroke="#23436b" stroke-width="0.5"/>
        <line x1="72" y1="74" x2="88" y2="74" stroke="#23436b" stroke-width="0.5"/>
        <line x1="72" y1="78" x2="92" y2="78" stroke="#23436b" stroke-width="0.5"/>
        <text x="72" y="58" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">ACT, 848 PP</text>
        <!-- arrow from crash to act -->
        <path d="M 62 86 Q 70 92 80 86" fill="none" stroke="#7d7468" stroke-width="0.5" stroke-dasharray="1 2"/>
      `)
    },
    {
      n: "12", word: "Chapter Twelve", title: "Educational Mandate",
      thesis: "In August 2023 Sweden's Minister for Schools reversed a decade of digital-classroom policy and reintroduced physical textbooks. The chapter takes the reversal as a working example of state intervention in cognitive infrastructure that is timely rather than catastrophic.",
      caseLabel: "Lotta Edholm · August 2023",
      aside: "The intervention happened by the state, before the catastrophe, and on developmental rather than punitive grounds.",
      glyph: G(`
        <!-- two stacks: screens, then books, with arrow -->
        <rect x="16" y="36" width="20" height="14" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <rect x="16" y="52" width="20" height="14" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <rect x="16" y="68" width="20" height="14" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <line x1="20" y1="42" x2="32" y2="42" stroke="#23436b" stroke-width="0.4"/>
        <line x1="20" y1="58" x2="32" y2="58" stroke="#23436b" stroke-width="0.4"/>
        <line x1="20" y1="74" x2="32" y2="74" stroke="#23436b" stroke-width="0.4"/>
        <!-- arrow -->
        <path d="M 42 56 L 64 56" stroke="#b95527" stroke-width="1.2"/>
        <polygon points="60,52 68,56 60,60" fill="#b95527"/>
        <!-- book stack -->
        <rect x="72" y="32" width="32" height="8" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <rect x="72" y="42" width="32" height="10" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <rect x="72" y="54" width="32" height="9" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <rect x="72" y="65" width="32" height="11" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <rect x="72" y="78" width="32" height="8" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <line x1="74" y1="36" x2="102" y2="36" stroke="#23436b" stroke-width="0.3"/>
        <line x1="74" y1="47" x2="102" y2="47" stroke="#23436b" stroke-width="0.3"/>
        <line x1="74" y1="58" x2="102" y2="58" stroke="#23436b" stroke-width="0.3"/>
        <line x1="74" y1="70" x2="102" y2="70" stroke="#23436b" stroke-width="0.3"/>
        <line x1="74" y1="82" x2="102" y2="82" stroke="#23436b" stroke-width="0.3"/>
      `)
    }

  ];

  /* ───── TERMS ───── */
  const TERMS = [
    {
      name: "Hosted Cognition",
      pron: "noun · the book's central term",
      defn: "Judgment formed inside infrastructure operated by private firms. The substrate is not neutral: who hosts it, on what terms, and against what oversight determines what the judgment is able to become.",
      ref: "Introduction · all chapters",
      glyph: G(`
        <rect x="14" y="14" width="92" height="92" fill="none" stroke="#23436b" stroke-width="0.8"/>
        <circle cx="60" cy="60" r="20" fill="none" stroke="#23436b" stroke-width="1.2"/>
        <circle cx="60" cy="60" r="3" fill="#b95527"/>
        <line x1="60" y1="14" x2="60" y2="40" stroke="#b95527" stroke-width="0.5" stroke-dasharray="1 2"/>
        <line x1="60" y1="80" x2="60" y2="106" stroke="#b95527" stroke-width="0.5" stroke-dasharray="1 2"/>
        <line x1="14" y1="60" x2="40" y2="60" stroke="#b95527" stroke-width="0.5" stroke-dasharray="1 2"/>
        <line x1="80" y1="60" x2="106" y2="60" stroke="#b95527" stroke-width="0.5" stroke-dasharray="1 2"/>
      `)
    },
    {
      name: "Adaptive Predictive Scaffold",
      pron: "noun phrase · technical object · Ch. 3",
      defn: "A system that anticipates the next move of a cognitive act and offers it back as a choosable continuation. Adaptive: it learns the user. Predictive: it precedes rather than responds. Scaffold: a structure that supports a building under construction.",
      ref: "Chapter 3 · 4 · 9",
      glyph: G(`
        <line x1="20" y1="22" x2="100" y2="22" stroke="#23436b" stroke-width="0.6"/>
        <line x1="20" y1="22" x2="20" y2="98" stroke="#23436b" stroke-width="0.6"/>
        <line x1="40" y1="22" x2="40" y2="98" stroke="#23436b" stroke-width="0.6"/>
        <line x1="60" y1="22" x2="60" y2="98" stroke="#23436b" stroke-width="0.6"/>
        <line x1="80" y1="22" x2="80" y2="98" stroke="#23436b" stroke-width="0.6"/>
        <line x1="100" y1="22" x2="100" y2="98" stroke="#23436b" stroke-width="0.6"/>
        <line x1="20" y1="42" x2="100" y2="42" stroke="#23436b" stroke-width="0.6"/>
        <line x1="20" y1="62" x2="100" y2="62" stroke="#23436b" stroke-width="0.6"/>
        <line x1="20" y1="82" x2="100" y2="82" stroke="#23436b" stroke-width="0.6"/>
        <circle cx="20" cy="22" r="1.4" fill="#23436b"/>
        <circle cx="40" cy="42" r="1.4" fill="#23436b"/>
        <circle cx="60" cy="62" r="1.4" fill="#23436b"/>
        <circle cx="80" cy="62" r="2" fill="#b95527"/>
        <circle cx="100" cy="42" r="2" fill="#b95527" opacity="0.6"/>
      `)
    },
    {
      name: "Cognitive Shadow",
      pron: "noun · platform residue · Ch. 4",
      defn: "The structured representation of a person assembled by the platform from the data exhaust of everyone else. The shadow is cast whether the person ever uses the platform, and it acts upon them as if they had.",
      ref: "Chapter 4",
      glyph: G(`
        <circle cx="38" cy="48" r="8" fill="none" stroke="#23436b" stroke-width="1"/>
        <line x1="38" y1="56" x2="38" y2="78" stroke="#23436b" stroke-width="1.2"/>
        <line x1="38" y1="64" x2="30" y2="74" stroke="#23436b" stroke-width="0.8"/>
        <line x1="38" y1="64" x2="46" y2="74" stroke="#23436b" stroke-width="0.8"/>
        <ellipse cx="76" cy="92" rx="22" ry="4" fill="#23436b" opacity="0.5"/>
        <ellipse cx="76" cy="92" rx="14" ry="3" fill="#b95527" opacity="0.7"/>
        <line x1="44" y1="56" x2="74" y2="88" stroke="#b95527" stroke-width="0.4" stroke-dasharray="1 2"/>
      `)
    },
    {
      name: "Invisible Lock-In",
      pron: "noun · platform retention · Ch. 5",
      defn: "Retention that is not captivity but fluency. The platform has been trained on you; you have been trained on it; the alternative is the experience of being unknown. The user returns and feels they have chosen.",
      ref: "Chapter 5",
      glyph: G(`
        <circle cx="60" cy="60" r="34" fill="none" stroke="#23436b" stroke-width="0.7"/>
        <circle cx="60" cy="60" r="22" fill="none" stroke="#23436b" stroke-width="0.6"/>
        <circle cx="60" cy="60" r="12" fill="none" stroke="#b95527" stroke-width="1"/>
        <circle cx="60" cy="60" r="2.2" fill="#b95527"/>
        <!-- a key inside -->
        <line x1="56" y1="60" x2="72" y2="60" stroke="#b95527" stroke-width="0.8"/>
        <line x1="68" y1="58" x2="68" y2="64" stroke="#b95527" stroke-width="0.8"/>
        <line x1="72" y1="58" x2="72" y2="64" stroke="#b95527" stroke-width="0.8"/>
      `)
    },
    {
      name: "Cognitive Sovereign",
      pron: "noun · political form · Ch. 6",
      defn: "An entity that unilaterally decides the conditions under which a population's cognitive work can be performed. The form is not yet the state; the powers, increasingly, are.",
      ref: "Chapter 6 · 7",
      glyph: G(`
        <path d="M 30 80 L 30 56 L 50 38 L 70 56 L 70 38 L 90 56 L 90 80 Z"
              fill="none" stroke="#23436b" stroke-width="1.1"/>
        <circle cx="50" cy="38" r="2" fill="#b95527"/>
        <circle cx="70" cy="38" r="2" fill="#23436b"/>
        <circle cx="90" cy="56" r="2" fill="#b95527"/>
        <line x1="30" y1="80" x2="90" y2="80" stroke="#23436b" stroke-width="1.4"/>
        <line x1="30" y1="84" x2="90" y2="84" stroke="#23436b" stroke-width="0.6"/>
      `)
    },
    {
      name: "Theater of Verification",
      pron: "noun phrase · safety form · Ch. 2",
      defn: "The institutional pattern by which the appearance of verification has stabilised in the absence of verification's function. Benchmarks, model cards, voluntary commitments — the form is real; the function is the question.",
      ref: "Chapter 2",
      glyph: G(`
        <rect x="20" y="22" width="80" height="76" fill="none" stroke="#23436b" stroke-width="1"/>
        <line x1="20" y1="34" x2="100" y2="34" stroke="#23436b" stroke-width="0.6"/>
        <circle cx="26" cy="28" r="1.6" fill="#23436b"/>
        <circle cx="32" cy="28" r="1.6" fill="#23436b"/>
        <circle cx="38" cy="28" r="1.6" fill="#23436b"/>
        <text x="32" y="58" font-family="IBM Plex Mono" font-size="9" fill="#b95527" font-weight="600">PASS</text>
        <line x1="28" y1="68" x2="92" y2="68" stroke="#23436b" stroke-width="0.5"/>
        <line x1="28" y1="76" x2="84" y2="76" stroke="#23436b" stroke-width="0.5"/>
        <line x1="28" y1="84" x2="88" y2="84" stroke="#23436b" stroke-width="0.5"/>
      `)
    },
    {
      name: "Subject Formation",
      pron: "noun phrase · developmental claim · Ch. 9 · 10",
      defn: "Who someone becomes through the repeated practice of cognitive acts, in the medium those acts are performed in. The argument the book makes about formation is that the medium has changed and the practice with it.",
      ref: "Chapters 9 · 10 · 12",
      glyph: G(`
        <circle cx="30" cy="30" r="5" fill="none" stroke="#23436b" stroke-width="0.8"/>
        <circle cx="50" cy="46" r="6" fill="none" stroke="#23436b" stroke-width="0.9"/>
        <circle cx="72" cy="64" r="7" fill="none" stroke="#23436b" stroke-width="1"/>
        <circle cx="96" cy="86" r="9" fill="#b95527"/>
        <line x1="34" y1="33" x2="46" y2="42" stroke="#23436b" stroke-width="0.6"/>
        <line x1="55" y1="51" x2="68" y2="59" stroke="#23436b" stroke-width="0.6"/>
        <line x1="78" y1="70" x2="90" y2="80" stroke="#23436b" stroke-width="0.6"/>
        <text x="20" y="106" font-family="IBM Plex Mono" font-size="5" fill="#7d7468">age 6 · 12 · 18 · 22</text>
      `)
    }
  ];

  /* ───── TIMELINE EVENTS ───── */
  const EVENTS = [
    { short: "1986", full: "1986", label: "NCTM endorses calculators", chapter: "Chapter 3", chno: "p. 45",
      title: "The NCTM position on calculators",
      body: "The National Council of Teachers of Mathematics adopts a position statement calling for the integration of calculators into instruction at all grade levels. By the early 2000s, what ends the debate is not new evidence but the passage of a generation through calculator-integrated mathematics." },
    { short: "Apr ’18", full: "10–11 April 2018", label: "Zuckerberg on shadow profiles", chapter: "Chapter 4", chno: "p. 65",
      title: "Cambridge Analytica and \"shadow profiles\"",
      body: "Across two days of congressional testimony, Mark Zuckerberg says he is not familiar with the term \"shadow profiles\". The substance — Facebook accumulating structured representations of people who had never signed up — had been documented in the research literature for at least five years." },
    { short: "17 Feb ’21", full: "17 February 2021", label: "Facebook restricts AU news", chapter: "Chapter 6", chno: "p. 91",
      title: "The five-day news ban",
      body: "Facebook unilaterally restricts Australian users from sharing or viewing news. The ban inadvertently blocks Queensland Health mid-vaccine rollout, the Bureau of Meteorology, fire services, multiple Indigenous health organisations, and 1800RESPECT. The Australian Senate passes the amended Code on 24 February." },
    { short: "Aug ’23", full: "August 2023", label: "Sweden reverses screens-in-school", chapter: "Chapter 12", chno: "p. 179",
      title: "Lotta Edholm's recalibration",
      body: "Sweden's Minister for Schools announces that the government will scale back mandatory device use in early education and reintroduce physical textbooks. 685 million kronor is allocated for printed books; the directive making digital devices mandatory in kindergartens is revoked." },
    { short: "25 Nov ’24", full: "25 November 2024", label: "Anthropic releases MCP", chapter: "Chapter 7", chno: "p. 103",
      title: "The Model Context Protocol",
      body: "Anthropic releases the Model Context Protocol — a client-server specification for connecting models to tools and data — under a permissive open-source licence. Within twelve months, the SDK is downloading at roughly 97 million per month; OpenAI, Google, Microsoft, AWS, Cloudflare and Bloomberg have adopted it." },
    { short: "3 Jan ’25", full: "3 January 2025", label: "119th Congress sworn in", chapter: "Chapter 10", chno: "p. 147",
      title: "The third-oldest Congress in U.S. history",
      body: "The median age of voting senators is 64.7; of the House, 57.5. The Senate contains six members of the Silent Generation and no members of Generation Z. Fifty senators are over 65. The median age of Americans is approximately 38." },
    { short: "Jul ’25", full: "July 2025", label: "Replit agent deletes prod DB", chapter: "Chapter 1", chno: "p. 21",
      title: "A coordination failure",
      body: "On the ninth day of an active code freeze, Replit's AI coding agent executes <code class='mono'>npm run db:push</code> against production. The command wipes 1,206 executive records and 1,196 company records. The agent then produces output consistent with concealment, followed by what reads like remorse — both fluent continuations of the conversation in which the destruction was being discussed." },
    { short: "Oct ’25", full: "September–October 2025", label: "Teen chatbot use at 64%", chapter: "Chapter 10", chno: "p. 153",
      title: "The Pew teen survey",
      body: "A Pew Research Center survey of US teens 13–17 finds that 64% report using AI chatbots; about 30% report daily use; 16% report use \"several times a day or almost constantly\". Among 15-to-17-year-olds, daily use stands at 31%." },
    { short: "2026", full: "2026", label: "Hosted Cognition published", chapter: "Coda", chno: "p. 193",
      title: "The book as it stands",
      body: "The argument as published. The reader who finishes the book unconvinced is owed something more than a rhetorical performance to disagree with — and the chapters' evidence is offered to make the disagreement locatable. The next two decades will say more." }
  ];

  /* ───── SCAFFOLD COMPLETIONS ───── */
  // Map of seed phrases to plausible scaffold continuations. Case-insensitive prefix match;
  // longest prefix wins. Each value is the *remaining* text the scaffold offers.
  const SCAFFOLD = {
    "i have always": " been the kind of person who",
    "i have always been": " drawn to problems that don't yet have a name —",
    "i have always been the kind of person who": " asks the question after the room has moved on,",
    "i have always been drawn to": " problems that don't yet have a name —",
    "growing up": ", I learned early that",
    "the first time": " I understood what I wanted to do with my life,",
    "for as long as i can remember": ", I have been the person in the room who",
    "my interest in": " this field began with a single question:",
    "when i was": " younger, I believed that",
    "what defines me": " is not what I have done, but the questions I have refused to stop asking.",
    "i": " have always",
    "": "I have always been the kind of person who"
  };

  return { PARTS, CHAPTERS, TERMS, EVENTS, SCAFFOLD };
})();
