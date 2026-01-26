// Bootstrap module: expose verses to existing inline script
import verses from './data/verses.js';

// Ensure mastered property exists on all verses (defensive)
verses.forEach(v => { if (typeof v.mastered === 'undefined') v.mastered = false; });

// Expose to global to be consumed by inline script until full modularization
window.__verses = verses;
