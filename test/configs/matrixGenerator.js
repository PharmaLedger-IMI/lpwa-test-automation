const run = require('../utility/generateDataMatrixImage');
// generate data matrix for happy path
//run.generate2dDataMatrixImage('07613421039424','LC4062','230630'); 

// generate data matrix for expired product
//run.generate2dDataMatrixImage('07613421039424','LC4032','211031'); 

// generate data matrix for unknown product 
run.generate2dDataMatrixImage('00001234567895','UNK1234','991231'); 
