const { By, Key, Builder, Actions } = require('selenium-webdriver');
require('chromedriver');
require('geckodriver');
const chrome = require('selenium-webdriver/chrome');
const data = require('./data');

// ChromeOptions
async function example() {
  //To wait for browser to build and launch properly
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--start-maximized');
  // chromeOptions.addArguments('--start-fullscreen');
  chromeOptions.addArguments('--single-process');
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--incognito');
  chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
  chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
  // chromeOptions.addArguments('useAutomationExtension', false);
  // chromeOptions.addArguments('excludeSwitches', ['enable-automation']);
  chromeOptions.addArguments('disable-infobars');
  chromeOptions.addArguments('--profile-directory=Default');
  chromeOptions.addArguments('--disable-plugins-discovery');
  chromeOptions.addArguments('--disable-notifications');

  chromeOptions
    .setUserPreferences({ 'profile.default_content_settings.popups': '0' })
    .setUserPreferences({
      'profile.default_content_setting_values.notifications': '2',
    })
    .addExtensions('./extension_3_6_17_0.crx');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  driver.get('chrome://extensions/?id=bgnkhhnnamicmpeenaelnjfhikgbkllg');
  await driver.executeScript(() => {
    document
      .querySelector('extensions-manager')
      .shadowRoot.querySelector('#viewManager > extensions-detail-view.active')
      .shadowRoot.querySelector(
        'div#container.page-container > div.page-content > div#options-section extensions-toggle-row#allow-incognito'
      )
      .shadowRoot.querySelector('label#label input')
      .click();
  });

  for (const el of data) {
    const { length: duration } = el;
    console.log(data.indexOf(el), el.download_url);
    console.log('time', new Date().toLocaleString());
    await driver.get(el.download_url);
    await driver.sleep(1 * 1000);
    if (data.indexOf(el) === 0) await driver.get(el.download_url);

    //To send a search query by passing the value in searchString.
    const actions = driver.actions();
    const mouse = actions.mouse();

    var elem1 = await driver.findElement(By.css('#os_player'));
    const { height, width, x, y } = await elem1.getRect();

    // console.log('width===', width);
    // console.log('height====', height);
    // console.log('dim======', x, y);

    actions.pause(mouse).move({ origin: elem1 }).press().release().perform();
    // await driver.sleep(60 * 1000);

    // let timesToClick = parseInt(duration / 10);
    // timesToClick = timesToClick > 10 ? 16 : 0;
    // console.log('timesToClick', duration, timesToClick);
    // for (const elemw of Array(timesToClick).fill('_')) {
    //   await driver.sleep(1 * 200);
    //   // console.log('before click');
    //   actions
    //     .pause(mouse)
    //     .move({
    //       x: 150 - parseInt(width / 2),
    //       y: parseInt(height / 2) - 35,
    //       origin: elem1,
    //     })
    //     .press()
    //     .release()
    //     .perform();
    // }

    // actions
    //   .moveToElement(elem1)
    //   .moveByOffset(width - 120, height - 80)
    //   .click()
    //   .perform();
    await driver.sleep(100 * 1000);

    if (el === data[data.length - 1]) {
      console.log('End@@@@@@@', new Date().toLocaleString());
      await driver.quit();
    }
  }

  var tabs = await driver.getAllWindowHandles();
  console.log('tabs', tabs);

  //Verify the page title and print it
  // var title = await driver.getTitle();
  // var title = await driver.getCurrentUrl();

  // console.log('Title is:', title);
  // await driver.sleep(10 * 1000);
  // console.log('Title is:', title);

  //It is always a safe practice to quit the browser after execution
  // await driver.quit();
}

example();
