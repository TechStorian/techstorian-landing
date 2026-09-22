// All copy and links for the site live here, so the page can be updated
// without touching the components.

export const contact = {
  email: 'vijo@cas.au.dk',
  location: 'Aarhus, Denmark',
}

export const links = {
  refcheck: 'https://refcheck.techstorian.com/',
  substack: 'https://techstorian.substack.com/',
  founderSite: 'https://harbojohnston.dk',
  github: 'https://github.com/VictorHarbo',
  linkedin: 'https://www.linkedin.com/in/victor-harbo-johnston-936585156/',
  orcid: 'https://orcid.org/0000-0003-0087-1220',
  pure: 'https://pure.au.dk/portal/da/persons/vijo%40cas.au.dk/',
}

export type RefStatus = 'valid' | 'partial' | 'invalid'

export const refcheckSample: { citation: string; status: RefStatus; note: string }[] = [
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

export const refcheckFeatures = [
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
    body: 'Ready-made software for institutions, starting with RefCheck for universities, journals and research libraries.',
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
