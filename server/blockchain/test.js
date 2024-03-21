const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3('http://41.111.227.13:7545'); // Connect to Ganache on 41.111.227.13

// Load the ABI and bytecode from files
const contractAbi = JSON.parse(fs.readFileSync('./soumission_sol_Submissions.abi'));
const contractBytecode = fs.readFileSync('./soumission_sol_Submissions.bin').toString();

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const Contract = new web3.eth.Contract(contractAbi, null, {
    data: contractBytecode,
    
    //gasPrice: web3.utils.toWei('0.00003', 'ether')
  });

  Contract.deploy().send({from: accounts[9], gas: await Contract.deploy().estimateGas(),})
    .then((newContractInstance) => {
      console.log('Contract deployed at address: ' + newContractInstance.options.address);
    });
}

deploy();