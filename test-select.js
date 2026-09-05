const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');

  // Open Auth Modal by clicking "Sign In" or similar in Navbar
  // the CTA button in Navbar has text "Log In" or similar? Let's check text
  const [authBtn] = await page.\("//button[contains(., 'Log In') or contains(., 'Sign In') or contains(., 'Get Started')]");
  if (authBtn) {
    await authBtn.click();
    await page.waitForTimeout(1000);
  }

  // Switch to "Sign Up" tab
  const [signUpTab] = await page.\("//button[contains(text(), 'Sign Up')]");
  if (signUpTab) {
    await signUpTab.click();
    await page.waitForTimeout(1000);
  }

  // Click the Select Trigger
  const selectTrigger = await page.\#signup-institute;
  if (selectTrigger) {
    await selectTrigger.click();
    await page.waitForTimeout(1000);
  }

  // Check if SelectContent is visible
  const content = await page.\[role="listbox"];
  if (content) {
    const isVisible = await content.evaluate(el => {
      const style = window.getComputedStyle(el);
      const zIndex = style.zIndex;
      return { visible: style.display !== 'none' && style.visibility !== 'hidden', zIndex };
    });
    console.log('SelectContent:', isVisible);
  } else {
    console.log('SelectContent not found');
  }

  // Let's take a screenshot for debugging
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();