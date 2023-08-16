const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Import the cors module

const app = express();
const port = 3004;

// Apply cors middleware
app.use(cors());

app.get('/ping', async (req, res) => {
  res.status(200).send('pong !');
});

app.get('/shot', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.vehant.com/products-solutions/premise-security/automated-number-plate');

  try {
    const base64 = await page.screenshot({ encoding: 'base64' });
    res.status(200).send(`data:image/png;base64, ${base64}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the request.');
  } finally {
    await browser.close();
  }
});

app.get('/stream', async (req, res) => {
  const { url } = req.query;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the requested URL
    await page.goto(url);
    console.log('INSIDE STREAM');

    // Wait for the page to finish loading (use page.waitForNavigation instead of page.waitForLoadState)
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    try {
      // Take a screenshot of the page
      const screenshotData = await page.screenshot({ encoding: 'base64' });

      // Send the base64-encoded screenshot as a response
      res.send(`data:image/png;base64, ${screenshotData}`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while processing the request.');
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the request.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
