const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://41.111.227.13:7545'); // Connect to Ganache on 41.111.227.13

// Load the ABI and bytecode from files
const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname,'./Soumission_sol_Submissions.abi')).toString());

let contract = new web3.eth.Contract(contractAbi, '0xd4e40F9d2700192bD16dE3d12a14EC124a8FD94D');


async function testContract() {
    const accounts = await web3.eth.getAccounts();

    console.log(accounts);
  
    // Test createSubmission
    const submissionParams = {
        srb: "SRB001",
        infos: {
          budget: 1000,
          delai: 30,
          garantie: 1,
          materiels: "Materiels",
          employes: "Employes",
          cahierDesCharges: "Cahier des charges"
        },
        dateDepot: Math.floor(Date.now()), // current timestamp in seconds
        owner: 1,
        lotId: 1,
        addresses: {
            offreOwnerAddress: accounts[2],
            evaluateurAddress: accounts[3],
            ownerAddress: accounts[1],
            adminAddress: accounts[0],
        },
        evaluation: {
          materiels: 0,
          employes: 0,
          qualTech: 0
        }
    };

    // Test createSubmission
    await contract.methods
      .createSubmission(submissionParams)
      .send({ from: accounts[1], gas: await contract.methods.createSubmission(submissionParams).estimateGas({ from: accounts[1] })})
      .then(() => console.log('done')).catch(err => console.log(err));
  
    // Test getSubmissionsByOwner
    const ownerSubmissions = await contract.methods
      .getSubmissionsByOwner(1)
      .call({ from: accounts[1] });
  
    console.log('Owner Submissions:', ownerSubmissions);
  
    // Test getSubmissionsByLotId
    const lotSubmissions = await contract.methods
      .getSubmissionsByLotId(1)
      .call({ from: accounts[2] });
  
    console.log('Lot Submissions:', lotSubmissions);
  
    // Test getSubmissionsByEvaluateurId
    const evaluateurSubmissions = await contract.methods
      .getSubmissionsByLotIdAndEvaluateurAddress(accounts[3],1)
      .call({ from: accounts[3] });
  
    console.log('Evaluateur Submissions:', evaluateurSubmissions);
  
    // Test evaluateSubmission
    await contract.methods
      .evaluateSubmission(5, 30)
      .send({ from: accounts[3], gas: await contract.methods.evaluateSubmission(5, 30).estimateGas({ from: accounts[3] }) });
    
    // Test closeSubmission
    await contract.methods
      .closeLot(1)
      .send({ from: accounts[2], gas: await contract.methods.closeLot(1).estimateGas({ from: accounts[2] }) });
}

  testContract()
    .then(() => console.log('Tests passed'))
    .catch((error) => console.error('Tests failed:', error));  