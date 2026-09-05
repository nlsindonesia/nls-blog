/**
 * src/config.js
 * Konfigurasi sistem remote judge dan pemetaan bahasa pemrograman ke TLX.
 */

const path = require('path');
require('dotenv').config();

const ROOT_DIR = path.resolve(__dirname, '..');

module.exports = {
  PORT: process.env.PORT || 3500,
  HEADLESS: process.env.HEADLESS !== 'false', // default: true
  SUBMISSION_DELAY_MS: parseInt(process.env.SUBMISSION_DELAY_MS, 10) || 8000,
  JUDGING_TIMEOUT_MS: parseInt(process.env.JUDGING_TIMEOUT_MS, 10) || 60000,
  SESSION_PATH: process.env.SESSION_PATH
    ? path.resolve(ROOT_DIR, process.env.SESSION_PATH)
    : path.resolve(ROOT_DIR, 'session/tlx_session.json'),
  CSES_SESSION_PATH: process.env.CSES_SESSION_PATH
    ? path.resolve(ROOT_DIR, process.env.CSES_SESSION_PATH)
    : path.resolve(ROOT_DIR, 'session/cses_session.json'),
  CSES_USERNAME: process.env.CSES_USERNAME || 'nls_bot',
  CSES_PASSWORD: process.env.CSES_PASSWORD || 'maman123',

  // Pemetaan ID bahasa umum ke nama bahasa di form dropdown CSES
  CSES_LANGUAGE_MAP: {
    'cpp': 'C++',
    'cpp20': 'C++',
    'cpp17': 'C++',
    'c': 'C',
    'python': 'Python3',
    'python3': 'Python3',
    'py': 'Python3',
    'java': 'Java',
    'pascal': 'Pascal',
    'pas': 'Pascal',
    'rust': 'Rust',
    'js': 'Node.js',
    'javascript': 'Node.js',
    'node': 'Node.js',
    'haskell': 'Haskell',
    'ruby': 'Ruby',
    'scala': 'Scala',
    'assembly': 'Assembly'
  },

  // Pemetaan ID bahasa umum ke nama bahasa di form dropdown/radio TLX
  LANGUAGE_MAP: {
    'cpp': ['C++20', 'C++17', 'C++11', 'C++'],
    'cpp20': ['C++20', 'C++17', 'C++'],
    'cpp17': ['C++17', 'C++20', 'C++'],
    'c': ['C11', 'C', 'GNU C'],
    'python': ['Python 3', 'Python3', 'Python'],
    'python3': ['Python 3', 'Python3', 'Python'],
    'py': ['Python 3', 'Python3', 'Python'],
    'java': ['Java 21', 'Java 17', 'Java 11', 'Java 8', 'Java'],
    'pascal': ['Free Pascal', 'Pascal'],
    'pas': ['Free Pascal', 'Pascal'],
    'go': ['Go', 'Golang'],
    'rust': ['Rust']
  },

  // Selektor DOM TLX (Judgels frontend)
  SELECTORS: {
    // Tombol atau Tab untuk beralih ke form submit jika belum aktif
    SUBMIT_TAB_BUTTON: [
      'a:has-text("Kirim Jawaban")',
      'a:has-text("Submit")',
      'button:has-text("Kirim Jawaban")',
      'button:has-text("Submit")',
      '[data-test="submit-tab"]'
    ],
    // Tombol submit form
    SUBMIT_BUTTON: [
      'button[type="submit"]:has-text("Kirim")',
      'button[type="submit"]:has-text("Submit")',
      'button:has-text("Kirim Jawaban")',
      'button:has-text("Submit Solution")'
    ],
    // Pilihan bahasa (bisa select dropdown atau radio/menu)
    LANGUAGE_SELECT: [
      'select[name="language"]',
      'select[name="programmingLanguage"]',
      'select[id="language"]',
      '.language-select select',
      'select'
    ],
    // Input kode (textarea atau Monaco/Ace editor)
    SOURCE_TEXTAREA: [
      'textarea[name="sourceCode"]',
      'textarea[name="source"]',
      'textarea[name="code"]',
      'textarea.form-control',
      'textarea'
    ],
    // Input file upload jika kode disubmit via upload file
    FILE_INPUT: [
      'input[type="file"][name="source"]',
      'input[type="file"][name="file"]',
      'input[type="file"]'
    ]
  }
};
