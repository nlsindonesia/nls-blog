# 1. Update blog/index.html
$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$blogContent = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# Replace category badge in blog card
$oldBlogBadge = @'
                            <!-- Category Badge -->
                            <div class="absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                                :class="getCategoryBadgeClass(art.category)"
                                x-text="art.category">
                            </div>
'@

$newBlogBadge = @'
                            <!-- Multi-Category Badges -->
                            <div class="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[88%]">
                                <template x-for="(cat, cIdx) in (art.categories || [art.category || 'Informasi NLS'])" :key="cIdx">
                                    <span class="backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                                        :class="getCategoryBadgeClass(cat)"
                                        x-text="cat"></span>
                                </template>
                            </div>
'@

$blogContent = $blogContent.Replace($oldBlogBadge, $newBlogBadge)

# Update filteredArticles in blog/index.html
$oldBlogFilter = @'
                        const matchCat = this.selectedCategory === 'all' || art.category === this.selectedCategory;
                        const q = this.searchQuery.toLowerCase().trim();
                        const matchSearch = !q ||
                            (art.title && art.title.toLowerCase().includes(q)) ||
                            (art.metaDescription && art.metaDescription.toLowerCase().includes(q)) ||
                            (art.category && art.category.toLowerCase().includes(q)) ||
                            (art.author && art.author.toLowerCase().includes(q));
'@

$newBlogFilter = @'
                        const matchCat = this.selectedCategory === 'all' || 
                            (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);
                        const q = this.searchQuery.toLowerCase().trim();
                        const matchSearch = !q ||
                            (art.title && art.title.toLowerCase().includes(q)) ||
                            (art.metaDescription && art.metaDescription.toLowerCase().includes(q)) ||
                            (art.categories ? art.categories.join(' ').toLowerCase().includes(q) : (art.category && art.category.toLowerCase().includes(q))) ||
                            (art.author && art.author.toLowerCase().includes(q));
'@

$blogContent = $blogContent.Replace($oldBlogFilter, $newBlogFilter)
[System.IO.File]::WriteAllText($blogPath, $blogContent, [System.Text.Encoding]::UTF8)

# 2. Update homepage index.html
$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$homeContent = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

$oldHomeBadge = @'
                        <!-- Category Badge -->
                        <div class="absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                            :class="getCategoryBadgeClass(art.category)"
                            x-text="art.category">
                        </div>
'@

$newHomeBadge = @'
                        <!-- Multi-Category Badges -->
                        <div class="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[88%]">
                            <template x-for="(cat, cIdx) in (art.categories || [art.category || 'Informasi NLS'])" :key="cIdx">
                                <span class="backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                                    :class="getCategoryBadgeClass(cat)"
                                    x-text="cat"></span>
                            </template>
                        </div>
'@

$homeContent = $homeContent.Replace($oldHomeBadge, $newHomeBadge)

# Update filteredArticles in index.html
$oldHomeFilter = "return this.selectedCategory === 'all' || art.category === this.selectedCategory;"
$newHomeFilter = "return this.selectedCategory === 'all' || (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);"

$homeContent = $homeContent.Replace($oldHomeFilter, $newHomeFilter)
[System.IO.File]::WriteAllText($homePath, $homeContent, [System.Text.Encoding]::UTF8)

Write-Host "SUCCESS: Upgraded /blog and homepage with Multi-Category support!"
