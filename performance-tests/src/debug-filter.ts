import puppeteer from 'puppeteer';

async function debugFilter() {
  console.log('🔍 Starting filter debug test...');

  const browser = await puppeteer.launch({
    headless: true, // Keep headless for now
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('📍 Step 1: Navigate to app...');
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
    console.log('✅ Navigation complete');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('📍 Step 2: Find all text inputs...');
    const filterInputs = await page.$$('thead input[type="text"]');
    console.log(`✅ Found ${filterInputs.length} text inputs`);

    if (filterInputs.length < 2) {
      throw new Error('Not enough text inputs found');
    }

    console.log('📍 Step 3: Type "Ri" into second input (Product Name)...');
    const filterInput = filterInputs[1];
    await filterInput.type('Ri');
    console.log('✅ Typed "Ri"');

    console.log('📍 Step 4: Blur the input...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('thead input[type="text"]');
      const productNameInput = inputs[1] as HTMLInputElement;
      console.log('About to blur input, value:', productNameInput?.value);
      if (productNameInput) {
        productNameInput.blur();
      }
    });
    console.log('✅ Blur triggered');

    console.log('📍 Step 5: Wait for table to update (MutationObserver)...');
    const updateComplete = await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        const tbody = document.querySelector('tbody');
        if (!tbody) {
          console.log('No tbody found!');
          resolve(false);
          return;
        }

        console.log('Setting up MutationObserver...');
        let timeoutId: NodeJS.Timeout;
        let mutationCount = 0;

        const observer = new MutationObserver(() => {
          mutationCount++;
          console.log(`Mutation #${mutationCount} detected`);
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            console.log('Mutations stopped, table updated');
            observer.disconnect();
            resolve(true);
          }, 50);
        });

        observer.observe(tbody, { childList: true, subtree: true });

        // Fallback timeout
        setTimeout(() => {
          console.log('Fallback timeout hit (500ms)');
          observer.disconnect();
          resolve(true);
        }, 500);
      });
    });

    console.log('✅ Table update complete:', updateComplete);

    console.log('📍 Step 6: Count visible rows...');
    const visibleRows = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    console.log(`✅ Visible rows: ${visibleRows}`);

    console.log('\n🎉 Test completed successfully!');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await browser.close();

  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    process.exit(1);
  }
}

debugFilter().catch(console.error);
