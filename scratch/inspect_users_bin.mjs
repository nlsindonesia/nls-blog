import https from 'https';

const url = 'https://extendsclass.com/api/json-storage/bin/eaedfeb';

function getBin() {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Status code:', res.statusCode);
                console.log('Raw data:', data);
                resolve(data);
            });
        });
    });
}

getBin();
