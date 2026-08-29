const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

const faultyTarget = `                        </div>
                    </div>
                </div>

                    </div>

                    <!-- =================================================================
                         VIEW 3: TRASH EVENT (TEMPAT SAMPAH AGENDA TERHAPUS)`;

const fixedTarget = `                        </div>
                    </div>
                </div>

                    <!-- =================================================================
                         VIEW 3: TRASH EVENT (TEMPAT SAMPAH AGENDA TERHAPUS)`;

html = html.replace(faultyTarget, fixedTarget);

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Removed extra premature </div> before VIEW 3: TRASH EVENT in nlsadmin/index.html');
