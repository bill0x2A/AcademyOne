// contract testing

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CourseContract {

    struct Edit {
        uint targetID;
        string newMaterialsHash;
        string newQuestionsHash;
    }

    struct Module {
        string name;
        string description;
        string materialsHash;
        string questionsHash;
    }

    struct Request {
        string name;
        string description;
        address author;
        bool confirmed;
        address approver;
    }

    string public courseName;
    string public courseDescription;
    string public courseImageHash;
    uint public index;
    uint public requestIndex;
    address public author;
    address public manager;
    Request[] public listOfRequests;
    Module[] public modulesToPush;
    Module[] public currentModules;
    mapping(address=>bool) public maintainers;
    mapping(uint=>Module[]) public requestModules;
    mapping(uint=>Module[]) public moduleVersions;

    modifier onlyOwner() {
        //restricted requires either a manager or maintainer to operate the function
        require(msg.sender == manager);
        _;
    }
    
    modifier restricted() {
        //restricted requires either a manager or maintainer to operate the function
        require(msg.sender == manager || maintainers[msg.sender]);
        _;
    }

    constructor(
        string memory name,
        string memory description,
        string memory imageHash,
        string[] memory moduleNames,
        string[] memory moduleDescriptions,
        string[] memory materialHashes,
        string[] memory questionHashes)
    {
        //contructor sets manager as contract creator
        manager = msg.sender;
        index = 0;
        requestIndex = 0;
        courseName = name;
        courseDescription = description;
        courseImageHash = imageHash;
        addMaintainer(manager);
        addInitialModules(moduleNames, moduleDescriptions, materialHashes, questionHashes);
    }

    function addMaintainer(address newMaintainer) public restricted() {
        require(maintainers[newMaintainer] != true);
        //Add a signal here to tell Ux that this address is already a maintainer

        //adds new maintainer to the mapping with positive boolean value pair
        maintainers[newMaintainer] = true;
    }

    function addInitialModules(
        string[] memory _name,
        string[] memory _description,
        string[] memory _mHash, 
        string[] memory _qHash) 
    public {

        pushModules(_name, _description, _mHash, _qHash);
    }

    function pushModules(
        //takes in arrays of module detailes, pushes them onto an array and stores that array in version controlled modules mapping.
        string[] memory _name,
        string[] memory _description,
        string[] memory _mHash,
        string[] memory _qHash)
    public {
        for (uint i=0; i<_name.length; i++) {

            Module memory newModule = Module({
                name: _name[i],
                description: _description[i],
                materialsHash: _mHash[i],
                questionsHash: _qHash[i]
            });
            modulesToPush.push(newModule);
        }
        moduleVersions[index] = modulesToPush;
        delete(modulesToPush);
        index++;

    }

    function returnModules(uint _version) public view 
    returns(
        //returns all of the modules stored in version controlled modules mapping at _version
        //returns as an array of names, descs,materials,and questions.
        string[] memory _name,
        string[] memory _desc,
        string[] memory _materials,
        string[] memory questions)
    {
        Module[] memory modulesToReturn = moduleVersions[_version];

        uint length = modulesToReturn.length;

        string[] memory names = new string[](length);
        string[] memory descriptions = new string[](length);
        string[] memory mHashes = new string[](length);
        string[] memory qHashes = new string[](length);

        for (uint i = 0; i < length; i++) {
            Module memory module = modulesToReturn[i];
            names[i] = module.name;
            descriptions[i] = module.description;
            mHashes[i] = module.materialsHash;
            qHashes[i] = module.questionsHash;
        }
        return(names,descriptions,mHashes,qHashes);
    }

    function createRequest(
        //creates a request with all of the modules, including past modules, edited modules and new modules.
        //array of modules are stored at request index in request modules mappings.
        string memory _nameReq,
        string memory _descriptionReq,
        string[] memory _moduleNames,
        string[] memory _moduleDescriptions,
        string[] memory _materialsHash,
        string[] memory _questionsHash
    ) public {
        author = msg.sender;

        Request memory newRequest = Request({
            name: _nameReq,
            description: _descriptionReq,
            author: author,
            confirmed: false,
            approver: address(0)
        });

        listOfRequests.push(newRequest);

        for (uint i=0; i<_moduleNames.length; i++) {

            Module memory newModule = Module({
                name: _moduleNames[i],
                description: _moduleDescriptions[i],
                materialsHash: _materialsHash[i],
                questionsHash: _questionsHash[i]
            });
            modulesToPush.push(newModule);
        }
        requestModules[requestIndex] = modulesToPush;
        delete(modulesToPush);
        requestIndex++;
    }

    function approveRequest(uint ID) public restricted{
        //Approves a request at index ID in list of requests array,
        //changes the approver address and confirmed boolean,
        //pushes all the new modules stored in request module mapping, into current modules array mapping.
        Request storage request = listOfRequests[ID];
        request.confirmed = true;
        request.approver = msg.sender;

        Module[] memory modules = requestModules[ID];

        uint length = modules.length;
        
        string[] memory names = new string[](length);
        string[] memory descriptions = new string[](length);
        string[] memory materialHashes = new string[](length);
        string[] memory questionHashes = new string[](length);

        for (uint i = 0; i < length; i++) {
            Module memory module = modules[i];
            names[i] = module.name;
            descriptions[i] = module.description;
            materialHashes[i] = module.materialsHash;
            questionHashes[i] = module.questionsHash;
        }

        pushModules(names, descriptions, materialHashes, questionHashes);
    }

    function returnRequests(uint ID) public view returns(string memory name){

    // To write

    }
}
