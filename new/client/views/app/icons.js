const svg = (shapes) => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">${shapes}</svg>
`;
 
export const ICONS = {
    HOME: svg(`
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M9 22V12h6v10"/>
    `),
 
    CALS: svg(`
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
    `),
 
    SEARCH: svg(`
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
    `),
 
    CHAT: svg(`
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    `),
 
    PROFILE: svg(`
        <circle cx="12" cy="7" r="4"/>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    `)
};