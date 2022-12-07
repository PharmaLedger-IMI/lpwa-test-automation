const fs = require('fs/promises')
const expectedValues = require("../configs/expectations").expectations;

describe('Expired Product Scenario', () => {
    it('should run expired product test on LPWA', async () => {
        console.debug("Executing Expired Product Scenario...");
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

        // // On Chrome 'autoGrantPermissions' does not work
        // // This branch will click the native elements that are needed to grant permissions
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
            let permissionDurationSelector = '';
            if(browser.capabilities.platformVersion === '10') {
                console.debug(`Detected Android 10, using different selector for permissions duration...`)
                permissionDurationSelector = 'android=new UiSelector().text("Allow").className("android.widget.Button")'
            } else if (browser.capabilities.platformVersion === '7.0') {
                console.debug(`Detected Android 7, using different selector for permissions duration...`)
                permissionDurationSelector = 'android=new UiSelector().text("ALLOW").className("android.widget.Button")'
            } else {
                permissionDurationSelector = 'android=new UiSelector().text("While using the app").className("android.widget.Button")'

            }
            await $(permissionDurationSelector).waitForExist()
            await $(permissionDurationSelector).click()
            console.log("Permissions duration granted!")

            console.debug(`Switching to web context (${webContext})`)
            await driver.switchContext(webContext);
        }

        await expect(browser).toHaveUrl('https://demo.pla.health/scan.html')

        console.log(`Loading & injecting image...`)
        const testImage = await fs.readFile('./test/data/expired-product.png', {encoding: 'base64'})

        // Image injection
        browser.execute(`window.ImageCapture = class {
            constructor() {}
            grabFrame() {
                return fetch("data:image/png;base64,${testImage}").then((res) => res.blob()).then((blob) => createImageBitmap(blob))
            }
        }`)
        
        await $('#settings-modal > div > div.page-content > div.loader').waitForExist()
        console.log(`Image scanned!`)
        
        await browser.pause(1500);
        let expiryModal = await $('#expired-title');
        await expect(expiryModal).toHaveText('Expired');
        console.log("Found Expired Pop-up");
        await $("#expired-modal > div > div.modal-header > div.close-modal").click();
        const title = await $('.product-name');
        await expect(title).toHaveText(expectedValues.productName);
        const description = await $('.product-description');
        await expect(description).toHaveText(expectedValues.productDescription);
        var firstSection = await $("div[id='leaflet-content'] div:nth-child(1) h5:nth-child(1)");
        await expect(firstSection).toHaveText(expectedValues.sectionOneHeader);        
        var secondSection = await $("div[id='leaflet-content'] div:nth-child(2) h5:nth-child(1)");
        await expect(secondSection).toHaveText(expectedValues.sectionTwoHeader);
        var thirdSection = await $("div[id='leaflet-content'] div:nth-child(3) h5:nth-child(1)");
        await expect(thirdSection).toHaveText(expectedValues.sectionThreeHeader);
        var fourthSection = await $("div[id='leaflet-content'] div:nth-child(4) h5:nth-child(1)");
        await expect(fourthSection).toHaveText(expectedValues.sectionFourHeader);
        console.log("Checked for Leaflet Headers");

        await firstSection.click();
        const firstSectionContent = await $("div[class='leaflet-accordion-item active'] p:nth-child(1)");
        await expect(firstSectionContent).toHaveTextContaining(expectedValues.sectionOneContent);
        console.log("Checked content by expanding 1st section");
        await firstSection.click();


        await secondSection.click();
        const secondSectionContent = await $("div[class='leaflet-accordion-item active'] li:nth-child(2)");
        await expect(secondSectionContent).toHaveTextContaining(expectedValues.sectionTwoContent);
        console.log("Checked content by expanding 2nd section");
        await secondSection.click();

        await thirdSection.click();
        const thirdSectionContent = await $("div[class='leaflet-accordion-item active'] li:nth-child(3)");
        await expect(thirdSectionContent).toHaveTextContaining(expectedValues.sectionThreeContent);
        console.log("Checked content by expanding 3rd section");
        await thirdSection.click();

        await fourthSection.click();
        const fourthSectionContent = await $("div[class='leaflet-accordion-item active'] li:nth-child(1)");
        await expect(fourthSectionContent).toHaveTextContaining(expectedValues.sectionFourContent);
        console.log("Checked content by expanding 4th section");
        await fourthSection.click();
        await browser.pause(1000);
    });

   
})
