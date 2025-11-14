/**
 * Utility functions for country flags
 * Uses flagcdn.com for flag images
 */

// Country code mapping for flag API
const countryCodes = {
    "Nigeria": "ng",
    "South Africa": "za",
    "Kenya": "ke",
    "Egypt": "eg",
    "Ghana": "gh",
    "Ethiopia": "et",
    "Rwanda": "rw",
    "Morocco": "ma",
    "Tanzania": "tz",
    "Ivory Coast": "ci",
    "Algeria": "dz",
    "Angola": "ao",
    "Uganda": "ug",
    "Sudan": "sd",
    "Mozambique": "mz",
    "Madagascar": "mg",
    "Cameroon": "cm",
    "Niger": "ne",
    "Mali": "ml",
    "Burkina Faso": "bf",
    "Malawi": "mw",
    "Zambia": "zm",
    "Senegal": "sn",
    "Chad": "td",
    "Somalia": "so",
    "Zimbabwe": "zw",
    "Guinea": "gn",
    "Benin": "bj",
    "Tunisia": "tn",
    "Burundi": "bi",
    "South Sudan": "ss",
    "Togo": "tg",
    "Eritrea": "er",
    "Sierra Leone": "sl",
    "Libya": "ly",
    "Gabon": "ga",
    "Mauritania": "mr",
    "Botswana": "bw",
    "Namibia": "na",
    "Gambia": "gm",
    "Guinea-Bissau": "gw",
    "Lesotho": "ls",
    "Equatorial Guinea": "gq",
    "Mauritius": "mu",
    "Eswatini": "sz",
    "Djibouti": "dj",
    "Comoros": "km",
    "Cape Verde": "cv",
    "São Tomé and Príncipe": "st",
    "Seychelles": "sc",
    "Democratic Republic of the Congo": "cd",
    "Republic of the Congo": "cg",
    "Central African Republic": "cf",
    "Liberia": "lr"
};

/**
 * Get flag image URL for a country
 * @param {string} countryName - Name of the country
 * @param {string} size - Size of flag (w20, w40, w80, w160, w320, w640, or w1280)
 * @returns {string} URL to flag image
 */
export function getFlagUrl(countryName, size = 'w80') {
    const code = countryCodes[countryName];
    if (!code) {
        // Fallback to emoji if country code not found
        return null;
    }
    return `https://flagcdn.com/${size}/${code}.png`;
}

/**
 * Get flag image HTML element
 * @param {string} countryName - Name of the country
 * @param {string} size - Size of flag
 * @returns {string} HTML img tag
 */
export function getFlagImage(countryName, size = 'w80') {
    const url = getFlagUrl(countryName, size);
    if (!url) {
        // Fallback to emoji
        return `<span class="country-flag-emoji">🌍</span>`;
    }
    return `<img src="${url}" alt="${countryName} flag" class="country-flag-img" loading="lazy" />`;
}

export default { getFlagUrl, getFlagImage };

