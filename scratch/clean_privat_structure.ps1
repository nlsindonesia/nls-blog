$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$currentHtml = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

# Get the pristine header through pricing section
$pricingEndMarker = "</section>`r`n`r`n            <!-- Testimoni Siswa -->"
if (-not $currentHtml.Contains("<!-- Testimoni Siswa -->")) {
    $pricingEndMarker = "</section>"
}

$paketIdx = $currentHtml.IndexOf('id="paket"')
$sectionClosePaket = $currentHtml.IndexOf('</section>', $paketIdx)
$pricingSectionEnd = $sectionClosePaket + '</section>'.Length
$headerToPricing = $currentHtml.Substring(0, $pricingSectionEnd)

# Get modal container onwards
$modalMarker = '<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->'
$modalIdx = $currentHtml.IndexOf($modalMarker)
$modalToEnd = $currentHtml.Substring($modalIdx)

$middleSectionsAndFooter = @'

            <!-- Testimoni Siswa -->
            <section class="py-20 bg-white dark:bg-[#0B132B]">
                <div class="px-4 md:px-8 container-max">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl font-bold text-primary mb-4">Apa Kata Mereka?</h2>
                        <p class="text-on-surface-variant max-w-2xl mx-auto text-lg">Kisah sukses siswa yang telah
                            mencapai potensi maksimal bersama Next Level Study.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div
                            class="glass-card p-8 rounded-3xl flex flex-col h-full bg-primary/5 border-t-4 border-primary shadow-sm">
                            <p class="text-on-surface-variant italic mb-6">"Les privat disinii Mind Blowing. Saat libur
                                kita malah di rangkul buat bantai bantai saat masuk. Dan hasilnya Ulangan pertama MTK
                                saya di kelas 12 langsung 97. Gacorr !"</p>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="icon-[mdi--account] text-primary"></span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-on-surface">Divo</h4>
                                    <p class="text-xs text-secondary font-semibold">BPK Penabur Pondok Indah<br>Les
                                        Privat dari awal 2026-Sekarang</p>
                                </div>
                            </div>
                        </div>
                        <div class="glass-card p-8 rounded-3xl flex flex-col justify-between">
                            <p class="text-on-surface-variant italic mb-6">"Persiapan OSN jadi jauh lebih terarah.
                                Strategi yang diberikan mentor sangat taktis dan membantu saya meraih medali perak tahun
                                ini. Kalau kompetisi Luar seperti AMO, SIMOC udah pasti emas"</p>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="icon-[mdi--account] text-primary"></span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-on-surface">Axell Chandra</h4>
                                    <p class="text-xs text-secondary font-semibold">Medali Perak OSN Matematika
                                        SMP<br>Les Privat Sejak Okt 2024- Sekarang</p>
                                </div>
                            </div>
                        </div>
                        <div class="glass-card p-8 rounded-3xl flex flex-col justify-between">
                            <p class="text-on-surface-variant italic mb-6">"Susah cari guru di Purwodadi. Akhirnya di
                                arahkan kesini, dan luar bisa tutornya. Tidak hanya mengajar, namun juga merangkul
                                secara teknis dan mental. Hingga bisa jadi World Champoin"</p>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="icon-[mdi--account] text-primary"></span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-on-surface">Timothy M. Wijaya</h4>
                                    <p class="text-xs text-secondary font-semibold">Perwakilan IMSO resmi
                                        Indonesia<br>Les Privat Sejak Nov 2024 - Sekarang</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section class="py-20 bg-surface-alt dark:bg-[#0F1A3A]">
                <div class="px-4 md:px-8 max-w-3xl mx-auto">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl md:text-4xl font-bold text-primary mb-4">Pertanyaan Umum (Q&A)</h2>
                    </div>
                    <div class="space-y-4">
                        <details class="group bg-white dark:bg-[#131D38] rounded-2xl border border-surface-container dark:border-slate-800 overflow-hidden">
                            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span class="font-bold text-on-surface">Bagaimana cara mendaftar Les Privat?</span>
                                <span
                                    class="icon-[mdi--chevron-down] transition-transform group-open:rotate-180 text-primary"></span>
                            </summary>
                            <div class="px-6 pb-6 text-on-surface-variant">
                                Anda dapat mendaftar dengan menekan tombol "Daftar Program" atau memilih paket di atas untuk memilih fokus belajar dan langsung terhubung dengan admin kami via WhatsApp.
                            </div>
                        </details>
                        <details class="group bg-white dark:bg-[#131D38] rounded-2xl border border-surface-container dark:border-slate-800 overflow-hidden">
                            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span class="font-bold text-on-surface">Apakah jadwal belajar bisa fleksibel?</span>
                                <span
                                    class="icon-[mdi--chevron-down] transition-transform group-open:rotate-180 text-primary"></span>
                            </summary>
                            <div class="px-6 pb-6 text-on-surface-variant">
                                Ya, jadwal belajar sangat fleksibel. Anda bisa mendiskusikan waktu terbaik langsung
                                dengan mentor, mulai dari pagi, siang, hingga sesi malam hari (18.30 - 21.00 WIB).
                            </div>
                        </details>
                        <details class="group bg-white dark:bg-[#131D38] rounded-2xl border border-surface-container dark:border-slate-800 overflow-hidden">
                            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span class="font-bold text-on-surface">Siapa saja mentor di Next Level Study?</span>
                                <span
                                    class="icon-[mdi--chevron-down] transition-transform group-open:rotate-180 text-primary"></span>
                            </summary>
                            <div class="px-6 pb-6 text-on-surface-variant">
                                Mentor kami adalah lulusan dan mahasiswa berprestasi dari universitas top nasional (UI, ITB, UGM) dan
                                internasional yang telah melalui proses seleksi ketat serta medalis olimpiade sains terverifikasi.
                            </div>
                        </details>
                        <details class="group bg-white dark:bg-[#131D38] rounded-2xl border border-surface-container dark:border-slate-800 overflow-hidden">
                            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span class="font-bold text-on-surface">Apa saja program les privat di Next Level Study?</span>
                                <span
                                    class="icon-[mdi--chevron-down] transition-transform group-open:rotate-180 text-primary"></span>
                            </summary>
                            <div class="px-6 pb-6 text-on-surface-variant">
                                Program Les Next Level Study meliputi Paket Reguler (Pendampingan Kurikulum Nasional & TKA SD/SMP/SMA), Paket Exclusive (OSN Kota/Provinsi, SD/SMP Internasional, SNBT/Mandiri), serta Paket Juara (OSN Final, SMA Internasional & Kompetisi Global AMO/SEAMO/TIMO).
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            <!-- CTA -->
            <section class="py-20 px-4 md:px-8 container-max">
                <div class="relative rounded-[40px] overflow-hidden bg-primary p-12 text-center text-white">
                    <div class="absolute inset-0 opacity-10 pointer-events-none">
                        <div
                            class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent">
                        </div>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">Siap untuk Melejitkan Akademikmu?</h2>
                    <p class="text-on-primary-container max-w-2xl mx-auto mb-10 text-lg">Jangan biarkan materi sulit
                        menghambat impianmu. Daftar sesi privat pertamamu hari ini dan rasakan bedanya.</p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button type="button" @click="$store.paketPrivat.open('reguler')" onclick="openPrivatPackage('reguler')"
                            class="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface transition-all cursor-pointer">Daftar
                            Sekarang</button>
                        <a href="https://wa.me/628170100788" target="_blank" rel="noopener noreferrer"
                            class="border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">Hubungi
                            Admin</a>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Footer -->
    <footer id="kontak" class="bg-[#D8E6FF] dark:bg-[#080E20] text-slate-800 dark:text-slate-200 scroll-mt-20 w-full border-t border-slate-200 dark:border-slate-800">
        <div class="container-max mx-auto w-full px-4 md:px-6 py-12 md:py-16">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                <div class="md:col-span-5 lg:col-span-5">
                    <h2 class="text-2xl md:text-[26px] font-extrabold text-[#0B5A8A] dark:text-sky-400 mb-4 tracking-tight">
                        Next Level Study
                    </h2>
                    <p class="text-sm md:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed mb-6 max-w-md">
                        Platform belajar persiapan kompetisi sains dan ujian masuk perguruan tinggi terbaik di
                        Indonesia. Memberdayakan masa depan cerah anak bangsa.
                    </p>
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="nlsSharePage()"
                            class="w-10 h-10 rounded-full bg-[#0B5A8A] hover:bg-[#08476e] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer"
                            title="Bagikan">
                            <span class="icon-[mdi--share-variant] text-[20px]"></span>
                        </button>
                        <a href="mailto:nextlevelstudyindonesia@gmail.com"
                            class="w-10 h-10 rounded-full bg-[#0B5A8A] hover:bg-[#08476e] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                            title="Kirim Email">
                            <span class="icon-[mdi--email] text-[20px]"></span>
                        </a>
                        <a href="https://next-level-study.com" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-[#0B5A8A] hover:bg-[#08476e] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                            title="Website">
                            <span class="icon-[mdi--web] text-[20px]"></span>
                        </a>
                        <a href="/achievements"
                            class="w-10 h-10 rounded-full bg-[#0B5A8A] hover:bg-[#08476e] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                            title="Pengumuman & Event">
                            <span class="icon-[mdi--bullhorn] text-[20px]"></span>
                        </a>
                        <a href="https://wa.me/6285163070002" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-[#0B5A8A] hover:bg-[#08476e] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                            title="Tanya CS">
                            <span class="icon-[mdi--chat] text-[20px]"></span>
                        </a>
                    </div>
                </div>

                <div class="md:col-span-3 lg:col-span-3">
                    <h3 class="text-base md:text-lg font-bold text-[#0B5A8A] dark:text-sky-400 mb-4">
                        Program Kami
                    </h3>
                    <ul class="space-y-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <li>
                            <a href="/programs" class="hover:text-[#0B5A8A] dark:hover:text-sky-300 transition-colors">Mitra sekolah</a>
                        </li>
                        <li>
                            <a href="/programs" class="hover:text-[#0B5A8A] dark:hover:text-sky-300 transition-colors">Mitra Dinas</a>
                        </li>
                        <li>
                            <a href="/#bimbel" class="hover:text-[#0B5A8A] dark:hover:text-sky-300 transition-colors">Bimbel Online/Offline</a>
                        </li>
                        <li>
                            <a href="/privat" class="hover:text-[#0B5A8A] dark:hover:text-sky-300 transition-colors">Privat Online/Offline</a>
                        </li>
                    </ul>
                </div>

                <div class="md:col-span-4 lg:col-span-4">
                    <h3 class="text-base md:text-lg font-bold text-[#0B5A8A] dark:text-sky-400 mb-4">
                        Hubungi Kami
                    </h3>
                    <div class="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                        <div class="flex items-start gap-2.5">
                            <span class="icon-[mdi--map-marker] text-[#0B5A8A] dark:text-sky-400 text-[20px] mt-0.5 shrink-0"></span>
                            <span>Jl. Pahlawan nomor 26, Bekasi Timur</span>
                        </div>

                        <div class="flex items-start gap-2.5">
                            <span class="icon-[mdi--phone] text-[#0B5A8A] dark:text-sky-400 text-[20px] mt-0.5 shrink-0"></span>
                            <div class="space-y-1">
                                <div>Pusat: <a href="https://wa.me/6285163070002" target="_blank"
                                        class="hover:underline font-medium">085163070002 (ADMIN)</a></div>
                                <div>Privat: <a href="https://wa.me/628170100788" target="_blank"
                                        class="hover:underline font-medium">08170100788 (Seno)</a></div>
                                <div>Bimbel Online: <a href="https://wa.me/6285810464960" target="_blank"
                                        class="hover:underline font-medium">085810464960 (Fasya)</a></div>
                                <div>Bimbel Offline: <a href="https://wa.me/6281286096600" target="_blank"
                                        class="hover:underline font-medium">081286096600 (Olla)</a></div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2.5">
                            <span class="icon-[mdi--email] text-[#0B5A8A] dark:text-sky-400 text-[20px] shrink-0"></span>
                            <a href="mailto:nextlevelstudyindonesia@gmail.com" class="hover:underline">
                                nextlevelstudyindonesia@gmail.com
                            </a>
                        </div>

                        <div class="flex items-center gap-2.5">
                            <span class="icon-[mdi--camera] text-[#0B5A8A] dark:text-sky-400 text-[20px] shrink-0"></span>
                            <a href="https://instagram.com/nextlevelstudyindonesia" target="_blank"
                                rel="noopener noreferrer" class="hover:underline font-medium">
                                @nextlevelstudyindonesia
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-[#B9D5FA] dark:border-slate-800 my-8"></div>

            <div
                class="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                <p>&copy; 2026 Next Level Study : Era Baru Pendidikan</p>
                <div class="flex items-center gap-6">
                    <a href="/privacy" class="hover:text-[#0B5A8A] dark:hover:text-sky-300 transition-colors">Kebijakan Privasi</a>
                    <a href="/terms" class="hover:text-[#0B5A8A] dark:hover:text-sky-300 transition-colors">Syarat &amp; Ketentuan</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        function nlsSharePage() {
            if (navigator.share) {
                navigator.share({
                    title: "Next Level Study - Era Baru Pendidikan",
                    url: window.location.href
                }).catch(() => { });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Tautan berhasil disalin ke clipboard!");
            }
        }
    </script>

'@

$fullCleanHtml = $headerToPricing + $middleSectionsAndFooter + $modalToEnd
[System.IO.File]::WriteAllText($privatPath, $fullCleanHtml, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Cleaned up privat/index.html with full sections restored!"
