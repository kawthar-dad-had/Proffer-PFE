const express = require('express')
const router = new express.Router()
const multer = require('multer')
const Web3 = require('web3');
const fs = require('fs');
const { isAuth } = require('../middleware/auth');
const Lot = require('../models/lot');
const { promisify } = require("util");
const Inscription = require('../models/inscription');
const path = require('path');
const Offre = require('../models/offre');

const web3 = new Web3('http://41.111.227.13:7545');


const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname,'../../Soumission_sol_Submissions.abi')).toString());

let contract = new web3.eth.Contract(contractAbi, '0x46357674DE68Ad7B3603b874A12D7658021F27d2');
    // You can now use the Contract instance to interact with the contract
let accounts 
web3.eth.getAccounts().then(res => accounts = res)

const mkdirAsync = promisify(fs.mkdir);
const uploadsDir = "uploads/";
mkdirAsync(uploadsDir).catch(() => {});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      fs.mkdir('./uploads/',(err)=>{
      cb(null, './uploads/')
      })
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix.replace(/:/g, '-') + file.originalname)
  },
})

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(pdf)/)) {
      return cb(new Error('File must be in pdf format!'))
  }

  cb(undefined, true)
}

const upload = multer({storage: storage, fileFilter: fileFilter})


router.post("/", isAuth, upload.fields([
    { name: 'cahierDesCharges', maxCount: 1 },
    { name: 'employes', maxCount: 1 },
    { name: 'materiels', maxCount: 1 }])
    , async(req, res) => {
    try {
        
        const evaluation = {
            materiels: 0,
            employes:  0,
            qualTech: 0
        }
        
        const submissionParams = {
            srb: "srb", 
            infos: {
                budget: req.body.budget,
                delai: req.body.delai,
                garantie: req.body.garantie,
                employes: req.files.employes[0].filename,
                materiels: req.files.materiels[0].filename,
                cahierDesCharges: req.files.cahierDesCharges[0].filename,
            },
            dateDepot: Date.now(),
            owner: req.user.id,
            lotId: req.body.lotId,
            addresses: {
            offreOwnerAddress: accounts[2],
            evaluateurAddress: accounts[3],
            ownerAddress: accounts[1],
            adminAddress: accounts[0],
            },
            evaluation: evaluation
        };
        console.log(accounts);
        const balance = await web3.eth.getBalance(accounts[1]);
        const requiredBalance = parseInt(web3.utils.toWei('0.006', 'ether'));
            
        console.log(web3.utils.fromWei(balance, 'ether')); // output: the balance in Ether
        console.log(web3.utils.fromWei(requiredBalance.toString(), 'ether')); 
        
        if (balance < requiredBalance) {
          throw new Error(`Account ${accounts[1]} does not have enough funds to perform the transaction.`);
        }
        
        await contract.methods
            .createSubmission(submissionParams)
            .send({ from: accounts[1], gas: await contract.methods.createSubmission(submissionParams).estimateGas({ from: accounts[1] }) });
        res.status(201).send("soumission created")
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
})

router.get("/owner", isAuth, async(req, res) => {
    try{
        const ownerSubmissions = await contract.methods
            .getSubmissionsByOwner(req.user.id)
            .call({ from: accounts[1] });
        const result = transformData(ownerSubmissions)
        res.status(200).send(result)
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error")
    }
})

router.get("/lot/:id", isAuth, async(req, res) => {
    try{
        const lotSubmissions = await contract.methods
            .getSubmissionsByLotId(req.params.id)
            .call({ from: accounts[2] });
        console.log(lotSubmissions);
        const result = transformData(lotSubmissions)
        let finalResult = []
        for (let r of result){
            const inscription = await Inscription.findOne({where: {userId: r.owner}})
            finalResult.push({...r, ...inscription.dataValues})
        }
        res.status(200).send({count:  finalResult.length,rows: finalResult})
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error")
    }
})

router.get("/evaluateur/lot/:id", isAuth, async(req, res) => {
    try{
        const evaluateurSubmissions = await contract.methods
            .getSubmissionsByLotIdAndEvaluateurAddress(accounts[3],req.params.id)
            .call({ from: accounts[3] });
        console.log(evaluateurSubmissions);
        const result = transformData(evaluateurSubmissions)
        let finalResult = []
        for (let r of result){
            const inscription = await Inscription.findOne({where: {userId: r.owner}})
            delete inscription.dataValues.id
            finalResult.push({...r, ...inscription.dataValues})
        }
        res.status(200).send({count:  finalResult.length,rows: finalResult})
    } catch (err) {
        res.status(500).send("Internal server error")
    }
})

router.patch("/evaluate/:submissionId", isAuth, async(req, res) => {
    try{
        await contract.methods
            .evaluateSubmission(req.params.submissionId, req.body.qualTech, req.body.employes, req.body.materiels)
            .send({ from: accounts[3], gas: await contract.methods.evaluateSubmission(req.params.submissionId, req.body.qualTech, req.body.employes, req.body.materiels).estimateGas({ from: accounts[3] }) })
            .then(() => {console.log("done")})
            .catch(err => {console.log("error", err)});
        res.status(200).send("soumission evaluated")
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error")
    }
})

router.patch("/close/:offreId", isAuth, async(req, res) => {
    try{
        const offre = await Offre.findOne({where: {id: req.params.offreId}, include: Lot})
        for( let lot of offre.dataValues.lots) {
            await contract.methods
                .closeLot(lot.id)
                .send({ from: accounts[2], gas: await contract.methods.closeLot(lot.id).estimateGas({ from: accounts[2] }) });
        }
        res.status(200).send("soumission closed")
    } catch (err) {
        res.status(500).send("Internal server error")
    }
})

function transformData(data) {
    const transformed = data.map(item => {
      return {
        id: item[0],
        srb: item[1],
        state: (item[2] == 0) ? "en attente" : (item[2] == 1) ? "evaluée" : (item[2] == 2) ? "fermée": null,
        infos: {
          budget: item[3][0],
          delai: item[3][1],
          garantie: item[3][2],
          materiels: item[3][3],
          employes: item[3][4],
          cahierDesCharges: item[3][5]
        },
        owner: item[4],
        lotId: item[5],
        dateDepot: item[6],
        addresses: {
          offreOwnerAddress: item[7][0],
          evaluateurAddress: item[7][1],
          ownerAddress: item[7][2],
          adminAddress: item[7][3]
        },
        evaluation: {
          materiels: item[8][0],
          employes: item[8][1],
          qualTech: item[8][2]
        }
      };
    });
    
    return transformed;
}

module.exports = router
