const fs = require('fs')
const bwipjs = require('bwip-js');

exports.generate2dDataMatrixImage = function (gtin, batchNumber, expiryDate, serialNumber) {


    let barcode = '(01)' + gtin + '(17)' + expiryDate + '(10)' + batchNumber;

    console.log("barcode " + barcode)
    bwipjs.toBuffer({
        bcid: 'gs1datamatrix',
        text: barcode,
        backgroundcolor: 'ffffff',
        padding: 135
    }, function (err, buff) {
        if (err) {

            console.log("error", err)

        } else {

            fs.writeFileSync('test/data/test.png', buff)
            console.log("2D Data Matrix image generated !!")

        }

    });
    return barcode

}


