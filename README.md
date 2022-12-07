![example workflow](https://github.com/PharmaLedger-IMI/lpwa-test-automation/actions/workflows/test-pipeline.yml/badge.svg)

This is a repository containing end-to-end test for the Lightweight Progressive Web App (LPWA) configured to the demo environment.
## Installation & Setup

### Step-1: Clone repository
```sh
git clone https://github.com/PharmaLedger-IMI/lpwa-test-automation.git
```
After the repository was cloned, you must install all the dependencies.

```sh
cd lpwa-test-automation

npm install
```

### Step-2: Configure environment variables

Setup following env. variables in your local machine or in pipleine as secrets
- `SAUCE_USERNAME`
- `SAUCE_ACCESS_KEY`

### Step-3: Generate 2d Data Matrix Image for a product-batch combination
 - In `test/configs/matrixGenerator.js` file, add gtin, batch & expiry as arguments in `generate2dDataMatrixImage` function
 - Run following command to generate image (it will be in test/data folder)
 ```sh
 npm run generateImage
 ```

### Step-4: Configure devices and OS versions (Optional)

Setup device and OS version in `test/configs/wdio.saucelabs.conf.js` file. By default, it will run on Safari browser on iOS 15 & 16 on any iPhone mobile device, Chrome browser on Android 10, 11 & 12 on any Samsung mobile device.

### Step-5: Point the test suite to required environment 

By default, this framework points to the Demo environment. It can be changed by modifying `baseUrl` property in `test/configs/wdio.shared.conf.js` file
### Step-6: Run tests
Run following command to trigger end-to-end tests
 ```sh
 npm run test.saucelabs.eu
 ```
