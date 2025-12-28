const puppeteer = require('puppeteer');

(async () => {
    const url = process.argv[2];
    if (!url) {
        console.error("Please provide a URL");
        process.exit(1);
    }

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Go to page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => { });

        // Screenshot to base64
        const buffer = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 60 });
        console.log(buffer); // Output only the base64 string

        await browser.close();
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
})();
