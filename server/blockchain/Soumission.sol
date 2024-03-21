// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Submissions {
    struct Evaluation {
        uint materiels;
        uint employes;
        uint qualTech;
    }

    struct Addresses {
        address offreOwnerAddress;
        address evaluateurAddress;
        address ownerAddress;
        address adminAddress;
    }

    struct Info {
        uint budget;
        uint delai;
        uint garantie;
        string materiels;
        string employes;
        string cahierDesCharges;
    }
    
    struct Submission {
        uint id;
        string srb;
        State state;
        Info infos;
        uint owner;
        uint lotId;
        uint dateDepot;
        Addresses addresses;
        Evaluation evaluation;
    }

    struct SubmissionParams {
        string srb;
        Info infos;
        uint dateDepot;
        uint owner;
        uint lotId;
        Addresses addresses;
        Evaluation evaluation;
    }

    enum State { deposed, evaluated, closed }

    mapping(uint => Submission) public submissions;
    mapping(uint => Submission[]) public submissionsByOwner;
    mapping(uint => Submission[]) public submissionsByLotId;
    mapping(address => mapping(uint => Submission[])) public submissionsByEvaluatorAndLotId;
    uint public submissionCounter;

    function createSubmission(SubmissionParams memory params) public {
        submissionCounter++;
        Submission storage newSubmission = submissions[submissionCounter];
        newSubmission.id = submissionCounter++;
        newSubmission.srb = params.srb;
        newSubmission.infos.materiels = params.infos.materiels;
        newSubmission.infos.employes = params.infos.employes;
        newSubmission.infos.budget = params.infos.budget;
        newSubmission.infos.delai = params.infos.delai;
        newSubmission.infos.garantie = params.infos.garantie;
        newSubmission.dateDepot = params.dateDepot;
        newSubmission.infos.cahierDesCharges = params.infos.cahierDesCharges;
        newSubmission.state = State.deposed;
        newSubmission.owner = params.owner;
        newSubmission.lotId = params.lotId;
        newSubmission.addresses = params.addresses;
        newSubmission.evaluation = params.evaluation;
        submissionsByOwner[newSubmission.owner].push(newSubmission);
        submissionsByLotId[newSubmission.lotId].push(newSubmission);
        submissionsByEvaluatorAndLotId[newSubmission.addresses.evaluateurAddress][newSubmission.lotId].push(newSubmission);
    }

    function _createSubmissionStruct(Submission storage submissionData) private view returns (Submission memory) {
        Submission memory submission;
        submission.id = submissionData.id;
        submission.srb = submissionData.srb;
        submission.infos.materiels = submissionData.infos.materiels;
        submission.infos.employes = submissionData.infos.employes;
        submission.infos.budget = (submissionData.state == State.closed || (msg.sender == submissionData.addresses.ownerAddress))? submissionData.infos.budget : 0;
        submission.infos.delai = (submissionData.state == State.closed || (msg.sender == submissionData.addresses.ownerAddress))? submissionData.infos.delai : 0;
        submission.infos.garantie = (submissionData.state == State.closed || (msg.sender == submissionData.addresses.ownerAddress))? submissionData.infos.garantie : 0;
        submission.dateDepot = submissionData.dateDepot;
        submission.infos.cahierDesCharges = submissionData.infos.cahierDesCharges;
        submission.state = submissionData.state;
        submission.owner = submissionData.owner;
        submission.lotId = submissionData.lotId;
        submission.addresses.offreOwnerAddress = address(0);
        submission.addresses.evaluateurAddress = address(0);
        submission.addresses.ownerAddress = address(0);
        submission.addresses.adminAddress = address(0);
        submission.evaluation.materiels = (submissionData.state == State.closed) ? submissionData.evaluation.materiels : 0;
        submission.evaluation.employes = (submissionData.state == State.closed) ? submissionData.evaluation.employes : 0;
        submission.evaluation.qualTech = (submissionData.state == State.closed) ? submissionData.evaluation.qualTech : 0;
        return submission;
    }

    function _updateMappings(Submission storage submission, uint submissionId) private {
        for (uint i = 0; i < submissionsByOwner[submission.owner].length; i++) {
            if (submissionsByOwner[submission.owner][i].id == submissionId) {
                submissionsByOwner[submission.owner][i] = submission;
                break;
            }
        }
        for (uint i = 0; i < submissionsByLotId[submission.lotId].length; i++) {
            if (submissionsByLotId[submission.lotId][i].id == submissionId) {
                submissionsByLotId[submission.lotId][i] = submission;
                break;
            }
        }
        for (uint i = 0; i < submissionsByEvaluatorAndLotId[submission.addresses.evaluateurAddress][submission.lotId].length; i++) {
            if (submissionsByEvaluatorAndLotId[submission.addresses.evaluateurAddress][submission.lotId][i].id == submissionId) {
                submissionsByEvaluatorAndLotId[submission.addresses.evaluateurAddress][submission.lotId][i] = submission;
                break;
            }
        }
    }

    function getSubmissionsByOwner(uint owner) public view returns (Submission[] memory) {
        return submissionsByOwner[owner];
    }

    function getSubmissionsByLotId(uint lotId) public view returns (Submission[] memory) {
        Submission[] storage submissionsLot = submissionsByLotId[lotId];
        Submission[] memory formattedSubmissions = new Submission[](submissionsLot.length);

        for (uint i = 0; i < submissionsLot.length; i++) {
            formattedSubmissions[i] = _createSubmissionStruct(submissionsLot[i]);
        }

        return formattedSubmissions;
    }

    function getSubmissionsByLotIdAndEvaluateurAddress(address evaluateurAddress, uint lotId) public view returns (Submission[] memory) {
        Submission[] storage submissionsEval = submissionsByEvaluatorAndLotId[evaluateurAddress][lotId];
        Submission[] memory formattedSubmissions = new Submission[](submissionsEval.length);

        for (uint i = 0; i < submissionsEval.length; i++) {
            formattedSubmissions[i] = _createSubmissionStruct(submissionsEval[i]);
        }

        return formattedSubmissions;
    }

    function evaluateSubmission(uint submissionId, uint qualTech, uint employes, uint materiels) public {
        Submission storage submission = submissions[submissionId];
        require(submission.state == State.deposed, "Submission is not in 'deposed' state");
        require(msg.sender == submission.addresses.evaluateurAddress, "Sender is not the designated evaluator");
        submission.evaluation.qualTech = qualTech;
        submission.evaluation.materiels = materiels;
        submission.evaluation.employes = employes;
        submission.state = State.evaluated;
        
        _updateMappings(submission, submissionId);
    }

    function closeLot(uint lotId) public {
        Submission[] storage lotSubmissions = submissionsByLotId[lotId];
        for (uint i = 0; i < lotSubmissions.length; i++) {
            Submission storage submission = lotSubmissions[i];
            submission.state = State.closed;
            
            _updateMappings(submission, submission.id);
        }
    }
}