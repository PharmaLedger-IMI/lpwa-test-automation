const fs = require('fs/promises')
const expectedValues = require("../configs/expectations").expectations;

describe('Unknown Product Scenario', () => {
    it('should run unknown product tests on LPWA', async () => {
        await browser.url('');
        try {
            const eulaAcceptButton = $('body > div.page-container > div.terms-content-container > div > div > div.terms-button.agree')
            await eulaAcceptButton.waitForDisplayed()
            console.log(`Accepting T&C`)
            await eulaAcceptButton.click()
        } catch(err) {
            console.log(`T&C not visible`)
        }

        await $('body > div.page-container > div.welcome-container > span').waitForDisplayed();

        await $('body > div.page-container > div.scan-button-container > div').click()

        // On Chrome 'autoGrantPermissions' does not work
        // This branch will click the native elements that are needed to grant permissions
        if(browser.capabilities.browserName === "Chrome") {
            console.log("Handling Permission Dialog on Android...")
            // Storing webcontext
            const webContext = await driver.getContext()

            console.debug("Switching to native context")
            driver.switchContext("NATIVE_APP");

            console.debug("Granting permissions...")
            const grantSelector = 'android=new UiSelector().text("Allow").className("android.widget.Button")'
            await $(grantSelector).waitForExist()
            await $(grantSelector).click()
            console.log('Permissions granted!')

            console.debug("Granting permissions duration...")
            let permissionDurationSelector = 'android=new UiSelector().text("While using the app").className("android.widget.Button")'
            if(browser.capabilities.platformVersion === '10') {
                console.debug(`Detected Android 10, using different selector for permissions duration...`)
                permissionDurationSelector = 'android=new UiSelector().text("Allow").className("android.widget.Button")'
            }
            await $(permissionDurationSelector).waitForExist()
            await $(permissionDurationSelector).click()
            console.log("Permissions duration granted!")

            console.debug(`Switching to web context (${webContext})`)
            await driver.switchContext(webContext);
        }

        await expect(browser).toHaveUrl('https://demo.pla.health/scan.html')

        console.log(`Loading & injecting image...`)
        const testImage = await fs.readFile('./test/data/unknown-product.png', {encoding: 'base64'})

        // Image injection
        browser.execute(`window.ImageCapture = class {
            constructor() {}
            grabFrame() {
                return fetch("data:image/png;base64,${testImage}").then((res) => res.blob()).then((blob) => createImageBitmap(blob))
            }
        }`)
        
        //await $('#settings-modal > div > div.page-content > div.loader').waitForExist()
        console.log(`Image scanned!`)
        
        await browser.pause(1500);
        const headerTitle = await $('.modal-title.header-title');
        await expect(headerTitle).toHaveText("Not Recognized");
        console.log("Found \"Not Recognized\" product");
        
        const errorCode = await $("p:nth-child(2)");
        await expect(errorCode).toHaveText("Error code 001");
    });

   
})
