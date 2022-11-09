![example workflow](https://github.com/PharmaLedger-IMI/lpwa-test-automation/actions/workflows/test-pipeline.yml/badge.svg)
## Installation & Setup

### Step-1: Clone repository
```sh
$ git clone https://github.com/PharmaLedger-IMI/lpwa-test-automation.git
```
After the repository was cloned, you must install all the dependencies.

```sh
$ cd lpwa-test-automation

$ npm install
```

### Step-2: Configure environment variables

Setup following env. variables in your local machine or in pipleine as secrets
- `SAUCE_USERNAME`
- `SAUCE_ACCESS_KEY`

### Step-3: Generate 2d Data Matrix Image for a product-batch combination
 - In `test/configs/matrixGenerator.js` file, add gtin, batch & expiry as arguments in `generate2dDataMatrixImage` function
 - Run following command to generate image (it will be in test/data folder)
 ```sh
 $ npm run generateImage
 ```

### Step-4: Run tests
Run following command to trigger end-to-end tests
 ```sh
 $ npm run test.saucelabs.eu
 ```
