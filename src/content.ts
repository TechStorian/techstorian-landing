// All copy and links for the site live here, so the page can be updated
// without touching the components.

export const contact = {
  email: 'info@techstorian.com',
  location: 'Aarhus, Denmark',
}

export const links = {
  exorcite: 'https://refcheck.techstorian.com/',
  closeReader: '/close-reader/',
  substack: 'https://techstorian.substack.com/',
  founderSite: 'https://harbojohnston.dk',
  github: 'https://github.com/VictorHarbo',
  linkedin: 'https://www.linkedin.com/in/victor-harbo-johnston-936585156/',
  orcid: 'https://orcid.org/0000-0003-0087-1220',
  pure: 'https://pure.au.dk/portal/da/persons/vijo%40cas.au.dk/',
}

export type RefStatus = 'valid' | 'partial' | 'invalid'

export const exorciteSample: { citation: string; status: RefStatus; note: string }[] = [
  {
    citation:
      'Anderson, B. (1991). Imagined Communities: Reflections on the Origin and Spread of Nationalism. London: Verso.',
    status: 'valid',
    note: 'Matched against an existing record by title.',
  },
  {
    citation: '“On the Social Function of Literature.” Chapter in an edited volume.',
    status: 'partial',
    note: 'Found only through the book holding the chapter.',
  },
  {
    citation:
      'Lindqvist, M. & Ortega, P. (2021). Algorithmic trust in Nordic higher education. Journal of Digital Pedagogy, 14(3), 211–229.',
    status: 'invalid',
    note: 'No matching record in the repositories searched.',
  },
]

export const exorciteFeatures = [
  {
    title: 'Evidence, not a probability score',
    body: 'Every reference gets a status and an explanation: what was searched for, where, and what was found. Anyone can check the answer.',
  },
  {
    title: 'Footnotes and Scandinavian sources',
    body: 'Footnote-only citation styles are read too, and Danish, Norwegian and Swedish conventions are handled specifically, so monographs are checked against library catalogues and not just journal indexes.',
  },
  {
    title: 'Documents are not kept',
    body: 'A document is processed to extract its references and is never stored after the check completes.',
  },
]

export const openSource = [
  {
    name: 'SolrWayback',
    role: 'Core developer',
    body: 'Search interface and wayback machine for web archives, developed at the Royal Danish Library and used by web archives internationally.',
    href: 'https://github.com/netarchivesuite/solrwayback',
    lang: 'Java',
  },
  {
    name: 'InternetArchiveExtractor',
    role: 'Main developer',
    body: 'A tool for pulling material out of the Internet Archive in a form historians can work with.',
    href: 'https://github.com/WEB-CHILD/InternetArchiveExtractor',
    lang: 'Python',
  },
  {
    name: 'LLM Document Discovery',
    role: 'Co-developer',
    body: 'An AI-assisted discovery agent that helps researchers find relevant documents in a SolrWayback index.',
    href: 'https://doi.org/10.5281/zenodo.19591245',
    lang: 'Python',
  },
]

export const principles = [
  {
    title: 'Provenance first',
    body: 'A historian’s first question is “where does this come from?” Our tools answer it: every result can be traced back to its source.',
  },
  {
    title: 'The humanities are not an edge case',
    body: 'Footnotes, monographs, small languages, messy scans. Humanities material is what we build for, not what we patch in later.',
  },
  {
    title: 'Made alongside the people who use it',
    body: 'Our software grows out of real research projects, teaching and archive work, and it is tested on real collections before it is shipped.',
  },
]

export const services = [
  {
    title: 'Products',
    body: 'Ready-made software: exorCITE for universities, journals and research libraries, and Close Reader for researchers taking notes in the archive.',
  },
  {
    title: 'Research software',
    body: 'Bespoke tooling for projects that work with web archives, digitised collections and collections as data.',
  },
  {
    title: 'Workshops & training',
    body: 'Hands-on sessions in running SolrWayback, working with archived web, OCR and data science for historians.',
  },
]

export const writing = {
  blurb:
    'techstorian writes about anything from the history of the Internet to modern AI, and about what it means for the people who will have to make sense of it later.',
  featured: {
    title: 'Google Changes Course — Is It Time to Rediscover the Bookmark?',
    date: '7 July 2026',
    href: 'https://substack.com/home/post/p-204904632',
  },
}

export const founder = {
  name: 'Victor Harbo Johnston',
  role: 'Founder',
  email: 'victor@techstorian.com',
  bio: [
    'Victor is a digital historian and software developer. He is a PhD fellow in History at Aarhus University, working on the archived web as a historical source in the ERC-funded project WEB CHILD, which studies changing childhoods in the early era of the WWW.',
    'Before that he was a software developer at the Royal Danish Library (2023–2025), where he became a core developer of SolrWayback. He teaches Data Science for Historians and has written for The Programming Historian.',
  ],
  facts: [
    { label: 'Field', value: 'Web history, digital history' },
    { label: 'Affiliation', value: 'Aarhus University' },
    { label: 'Previously', value: 'Royal Danish Library' },
    { label: 'Works in', value: 'Java, Python, Bash' },
  ],
}

// Close Reader (subpage at /close-reader/). Drawn from the close-reader repository's README.
export const closeReader = {
  version: '0.1',
  platform: 'macOS 14.4 or newer',
  features: [
    {
      title: 'Real source records',
      body: 'Bibliographic and archival details are entered once (author, title, archive, shelfmark, a link to the digitised copy) instead of retyping a title in every row.',
    },
    {
      title: 'Typed tags',
      body: 'Group tags as Theme, Person, Place, Organisation or anything else you need, with autocompletion and counts. Rename, merge and move tags as your categories change.',
    },
    {
      title: 'Filtering and search',
      body: 'Filter by source and by tags, matching any or all of them, and search the full text of every note.',
    },
    {
      title: 'Fast entry',
      body: 'A new note keeps the source and page of the one before it, so a morning at the archive is mostly typing what you read.',
    },
  ],
  model: [
    {
      term: 'Note',
      body: 'One row: the note text (an excerpt, a paraphrase or your own idea), a source, a page or locator, metadata fields and tags.',
    },
    {
      term: 'Source',
      body: 'A reference to material outside the computer: short title, author, title, year, primary or secondary, archive, shelfmark, URL, full citation and a comment.',
    },
    {
      term: 'Metadata field',
      body: 'A free-text column you define yourself, such as Date in source, Note type or Language. Values you have used before are suggested.',
    },
    {
      term: 'Tag type',
      body: 'A group of tags with its own colour: Theme, Person, Place, Organisation, Event.',
    },
    {
      term: 'Tag',
      body: 'A term within a tag type. A note can carry any number of tags of each type.',
    },
  ],
  shortcuts: [
    { keys: '⌘N', body: 'New note with the same source and page as the current one' },
    { keys: '⌘D', body: 'New note copying source, page, all fields and tags' },
    { keys: '⇧⌘N', body: 'Blank note' },
    { keys: '⌘T', body: 'Add tags to all selected notes' },
    { keys: '⌘F', body: 'Search' },
  ],
  exchange: [
    {
      title: 'Import CSV',
      body: 'Bring in the spreadsheet you already have, comma, semicolon or tab separated. For each column you choose what it is: note text, source, page, a metadata field or a tag type.',
    },
    {
      title: 'Export CSV',
      body: 'Write the notes currently shown to a file that opens in Excel.',
    },
    {
      title: 'Export Markdown',
      body: 'Write the notes currently shown grouped by source, with citations, as a first step towards writing.',
    },
  ],
}

// Allowing the unsigned app on first launch. Works on macOS 14 and on 15 and newer, where
// Control-click → Open no longer bypasses Gatekeeper and System Settings is the only route.
export const closeReaderInstall = [
  {
    title: 'Copy it to Applications',
    body: 'Open the .dmg file and drag Close Reader onto the Applications folder.',
  },
  {
    title: 'Open it, and click Done',
    body: 'The first time, macOS stops Close Reader because it isn’t signed and notarised by Apple yet. Click Done (OK on macOS 14), not Move to Trash.',
  },
  {
    title: 'Allow it in System Settings',
    body: 'Open System Settings → Privacy & Security, scroll down to Security and click Open Anyway next to the message about Close Reader.',
  },
  {
    title: 'Confirm',
    body: 'Choose Open Anyway once more, then confirm with your password or Touch ID.',
  },
  {
    title: 'That’s it',
    body: 'Close Reader opens. You only do this once; after that it starts like any other app.',
  },
]

export type CloseReaderTagType = 'theme' | 'person' | 'place' | 'org'

// From the demo project that ships with the app. Every source, person and quotation is fictional.
export const closeReaderDemo = {
  project: 'Havnby cholera 1853',
  sources: [
    { name: 'Berg 1987', count: 2 },
    { name: 'Board of Health minutes', count: 3 },
    { name: 'Havnby Gazette 1853', count: 3 },
    { name: 'Police journal 1853', count: 3 },
    { name: 'Teacher’s diary', count: 3 },
  ],
  themes: [
    { name: 'Charity', count: 3 },
    { name: 'Death & burial', count: 4 },
    { name: 'Medicine', count: 4 },
    { name: 'Public order', count: 5 },
    { name: 'Rumour', count: 2 },
  ],
  notes: [
    'First recorded death ‘of the cholera’ – a ship’s carpenter lodging near the North Quay.',
    '“The people will not have the dead carried through the Market Street by daylight.”',
    'Three arrests after a stone was thrown at the physician’s carriage.',
    'Board meets in emergency session. Proposes closing two wells in the harbour quarter.',
    '“It is the opinion of the Board that the evil arises from the exhalations of the harbour mud.”',
    'Temporary hospital opened in the old customs warehouse; nursing by deaconesses.',
    '“School closed. The children’s benches stand empty and the street smells of vinegar and smoke.”',
  ],
  current: {
    source: 'Police journal 1853',
    sourceDetail: 'Havnby police office · 1853 · Havnby Town Archive · Police 2.14',
    page: 'fol. 112r',
    text: 'First recorded death ‘of the cholera’ – a ship’s carpenter lodging near the North Quay. Constable reports crowd gathering outside the lodging house.',
    tags: [
      { type: 'theme', label: 'Theme', values: ['Disease', 'Public order'] },
      { type: 'person', label: 'Person', values: ['Constable Holm'] },
      { type: 'place', label: 'Place', values: ['North Quay'] },
      { type: 'org', label: 'Organisation', values: ['Police office'] },
    ] as { type: CloseReaderTagType; label: string; values: string[] }[],
  },
}
