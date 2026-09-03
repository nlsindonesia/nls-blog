const fs = require('fs');
let content = fs.readFileSync('nlsadmin/lms-results.html', 'utf8');

const targetStr = `<td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button @click="viewDetails(r)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 border border-indigo-100">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        Detail
                                    </button>
                                </td>`;

const newStr = `<td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <template x-if="needsGrading(r)">
                                        <button @click="openGrading(r)" class="text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors font-black text-xs inline-flex items-center gap-1 border border-amber-300 shadow-sm animate-pulse focus:animate-none hover:animate-none">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            Koreksi
                                        </button>
                                    </template>
                                    <template x-if="!needsGrading(r)">
                                        <button @click="viewDetails(r)" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 border border-indigo-100">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                            Detail
                                        </button>
                                    </template>
                                </td>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('nlsadmin/lms-results.html', content, 'utf8');
    console.log('Successfully replaced');
} else {
    console.log('Target string not found!');
}
