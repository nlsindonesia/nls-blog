// ==============================================================================
// VERCEL SERVERLESS API: NLS COMPETITIVE PROGRAMMING TRANSLATOR (EN -> ID)
// File: /api/translate.js
// Preserves 100% LaTeX Math Formulas ($...$, $$...$$), Code blocks & Images
// ==============================================================================

import https from 'https';

/**
 * Robust HTTP GET for translation service
 */
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            },
            timeout: 10000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Translation request timed out'));
        });
    });
}

/**
 * Translate a single plain text chunk (max 450 chars) via MyMemory
 */
async function translateChunk(text, sourceLang = 'en', targetLang = 'id') {
    if (!text || !text.trim()) return '';
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        const res = await fetchJson(url);
        if (res.data && res.data.responseData && res.data.responseData.translatedText) {
            let translated = res.data.responseData.translatedText;
            // Clean HTML entity leaks from translator
            translated = translated
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            return translated;
        }
    } catch (e) {
        console.warn('Chunk translation warning:', e.message);
    }
    return text; // Return original on error
}

/**
 * Translate text while strictly masking and preserving all LaTeX formulas, code, and images
 */
export async function translateTextPreservingMath(text, sourceLang = 'en', targetLang = 'id') {
    if (!text || !text.trim()) return '';

    const mathTokens = [];
    let masked = String(text);

    // 1. Mask Display Math: $$...$$ or \[...\]
    masked = masked.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (m) => {
        const id = mathTokens.length;
        mathTokens.push(m);
        return ` XMATB${id}X `;
    });

    // 2. Mask Inline Math: $...$ or \(...\)
    masked = masked.replace(/(\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g, (m) => {
        const id = mathTokens.length;
        mathTokens.push(m);
        return ` XMATI${id}X `;
    });

    // 3. Mask Images
    masked = masked.replace(/<img[^>]*>/gi, (m) => {
        const id = mathTokens.length;
        mathTokens.push(m);
        return ` XMATG${id}X `;
    });

    // 4. Mask Code Blocks
    masked = masked.replace(/`([^`\n]+?)`/g, (m) => {
        const id = mathTokens.length;
        mathTokens.push(m);
        return ` XMATC${id}X `;
    });

    // 5. Split by paragraphs to respect translation API length limits
    const paragraphs = masked.split('\n\n');
    const translatedParagraphs = [];

    for (const para of paragraphs) {
        if (!para.trim()) {
            translatedParagraphs.push('');
            continue;
        }

        // If paragraph is very long, sub-chunk by sentences
        if (para.length > 400) {
            const sentences = para.split(/([.!?]\s+)/);
            const translatedSentences = [];
            let currentBuf = '';

            for (let i = 0; i < sentences.length; i++) {
                const part = sentences[i];
                if ((currentBuf + part).length > 350 && currentBuf) {
                    const trans = await translateChunk(currentBuf, sourceLang, targetLang);
                    translatedSentences.push(trans);
                    currentBuf = part;
                } else {
                    currentBuf += part;
                }
            }
            if (currentBuf) {
                const trans = await translateChunk(currentBuf, sourceLang, targetLang);
                translatedSentences.push(trans);
            }
            translatedParagraphs.push(translatedSentences.join(' '));
        } else {
            const trans = await translateChunk(para.trim(), sourceLang, targetLang);
            translatedParagraphs.push(trans);
        }
    }

    let result = translatedParagraphs.join('\n\n');

    // 6. Restore all original math, code, and image tokens
    for (let i = 0; i < mathTokens.length; i++) {
        const token = mathTokens[i];
        const regexB = new RegExp(`X\\s*MATB${i}\\s*X`, 'gi');
        const regexI = new RegExp(`X\\s*MATI${i}\\s*X`, 'gi');
        const regexG = new RegExp(`X\\s*MATG${i}\\s*X`, 'gi');
        const regexC = new RegExp(`X\\s*MATC${i}\\s*X`, 'gi');
        result = result.replace(regexB, token);
        result = result.replace(regexI, token);
        result = result.replace(regexG, token);
        result = result.replace(regexC, token);
    }

    return result;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const body = req.body || {};
        const sourceLang = body.sourceLang || 'en';
        const targetLang = body.targetLang || 'id';

        // 1. Single text translation
        if (body.text) {
            const translated = await translateTextPreservingMath(body.text, sourceLang, targetLang);
            return res.status(200).json({
                success: true,
                sourceLang,
                targetLang,
                translated
            });
        }

        // 2. Multi-segment batch problem translation
        if (body.segments && typeof body.segments === 'object') {
            const { title, description, inputFormat, outputFormat, constraints, editorial } = body.segments;
            
            const [
                transTitle,
                transDesc,
                transInput,
                transOutput,
                transConstraints,
                transEditorial
            ] = await Promise.all([
                title ? translateTextPreservingMath(title, sourceLang, targetLang) : Promise.resolve(''),
                description ? translateTextPreservingMath(description, sourceLang, targetLang) : Promise.resolve(''),
                inputFormat ? translateTextPreservingMath(inputFormat, sourceLang, targetLang) : Promise.resolve(''),
                outputFormat ? translateTextPreservingMath(outputFormat, sourceLang, targetLang) : Promise.resolve(''),
                constraints ? translateTextPreservingMath(constraints, sourceLang, targetLang) : Promise.resolve(''),
                editorial ? translateTextPreservingMath(editorial, sourceLang, targetLang) : Promise.resolve('')
            ]);

            return res.status(200).json({
                success: true,
                sourceLang,
                targetLang,
                segments: {
                    title: transTitle || title || '',
                    description: transDesc || description || '',
                    inputFormat: transInput || inputFormat || '',
                    outputFormat: transOutput || outputFormat || '',
                    constraints: transConstraints || constraints || '',
                    editorial: transEditorial || editorial || ''
                }
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Harap berikan field "text" atau "segments" untuk diterjemahkan.'
        });

    } catch (err) {
        console.error('Translation error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Terjadi kesalahan pada layanan terjemahan.'
        });
    }
}

export async function translateProblemSegments(segments, sourceLang = 'en', targetLang = 'id') {
    if (!segments || typeof segments !== 'object') return {};
    const { title, description, inputFormat, outputFormat, constraints, editorial } = segments;
    const [
        transTitle,
        transDesc,
        transInput,
        transOutput,
        transConstraints,
        transEditorial
    ] = await Promise.all([
        title ? translateTextPreservingMath(title, sourceLang, targetLang) : Promise.resolve(''),
        description ? translateTextPreservingMath(description, sourceLang, targetLang) : Promise.resolve(''),
        inputFormat ? translateTextPreservingMath(inputFormat, sourceLang, targetLang) : Promise.resolve(''),
        outputFormat ? translateTextPreservingMath(outputFormat, sourceLang, targetLang) : Promise.resolve(''),
        constraints ? translateTextPreservingMath(constraints, sourceLang, targetLang) : Promise.resolve(''),
        editorial ? translateTextPreservingMath(editorial, sourceLang, targetLang) : Promise.resolve('')
    ]);

    return {
        title: transTitle || title || '',
        description: transDesc || description || '',
        inputFormat: transInput || inputFormat || '',
        outputFormat: transOutput || outputFormat || '',
        constraints: transConstraints || constraints || '',
        editorial: transEditorial || editorial || ''
    };
}
