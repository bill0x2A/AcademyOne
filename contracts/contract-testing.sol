// contract testing

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CourseFactory {

    //Init the array of deployed contract addresses
    address[] public deployedCourses;

    function createCourse (string memory name, string memory description, string memory imageHash,
    string[] memory moduleNames, string[] memory moduleDescriptions,
    string[] memory materialHashes, string[] memory questionHashes) 
    public {
        //creates a new course, deploys a new course contract and pushes its address onto the address array
        CourseContract newCourse = new CourseContract(name, description, imageHash,
        moduleNames, moduleDescriptions, materialHashes, questionHashes);
        deployedCourses.push(address(newCourse));
    }

    function getDeployedCourses() public view returns (address[] memory) {
        //returns the full array on deployed contracts
        return deployedCourses;
    }    
}

contract CourseContract {

    /*
    Testing course creation as structs
    */

    struct Edit {
        uint targetID;
        string newMaterialsHash;
        string newQuestionsHash;
    }


    struct Module {
        string name;
        string description;
        address author;
        string materialsHash;
        string questionsHash;
    }



    struct Request {
        string name;
        string description;
        address author;
        uint key;
        bool confirmed;
        address approver;
    }


    Edit[] public editModules;
    Module[] public modules;
    Module[] public newModules;
    Request[] public requests;
    mapping(uint=>Module[]) moduleKey;
    mapping(uint=>Edit[]) editKey;
    mapping(address=>bool) public members;
    mapping(address=>bool) public maintainers;
    address public approver;
    address public manager;
    address public author;
    string public test;
    string public courseName;
    string public courseDescription;
    string public courseImageHash;
    uint public index;


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

    constructor(string memory name, string memory description, string memory imageHash, 
    string[] memory moduleNames, string[] memory moduleDescriptions,
    string[] memory materialHashes, string[] memory questionHashes) {
        //contructor sets manager as contract creator
        manager = msg.sender;
        index = 0;
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


    function createRequest
    (string memory _nameReq, string memory _descriptionReq,
    string[] memory _nameMod, string[] memory _descriptionMod,
    string[] memory _mHashMod, string[] memory _qHashMod,
    uint[] memory _targetID, string[] memory _qHash, string[] memory _mHash) public {

        author = msg.sender;
        
       for (uint i=0; i<_nameMod.length; i++) {
            moduleToRequest(_nameMod[i], _descriptionMod[i], _mHashMod[i], _qHashMod[i]);
       }
       moduleKey[index] = newModules;
       delete newModules;

        
        for (uint i=0; i<_qHash.length; i++) {
            editToRequest(_targetID[i], _mHash[i], _qHash[i]);
        }
        editKey[index] = editModules;
        delete editModules;

        Request memory newRequest = Request({
            name: _nameReq,
            description: _descriptionReq,
            author: author,
            key: index,
            confirmed: false,
            approver: author
        });

        requests.push(newRequest);

        index++;
    }


    function moduleToRequest(string memory _name, string memory _description, 
    string memory _mHash, string memory _qHash) 
    public {
        
        Module memory newModule = Module({
            name: _name,
            description: _description,
            author: author,
            materialsHash: _mHash,
            questionsHash: _qHash
        });
        newModules.push(newModule);
    }

    function editToRequest(uint _ID, string memory _materialsHash, string memory _questionsHash) public {
        
        Edit memory newEdit = Edit({
            targetID: _ID,
            newMaterialsHash: _materialsHash,
            newQuestionsHash: _questionsHash
        });
        editModules.push(newEdit);   
    }

    function returnRequest(uint ID) public view returns(string memory name, string memory description, 
    address _author, uint Key, string[] memory name2, string[] memory desc2, string[] memory _mHash, 
    string[] memory _qHash) {
        Request memory request = requests[ID];
        Module[] memory modulesArray = moduleKey[ID];

        string[] memory names = new string[](modulesArray.length);
        string[] memory descriptions = new string[](modulesArray.length);
        address[] memory authors = new address[](modulesArray.length);
        string[] memory mHash = new string[](modulesArray.length);
        string[] memory qHash = new string[](modulesArray.length);
    
        
        for (uint i = 0; i < modulesArray.length; i++) {
            Module memory modi = modulesArray[i];
            names[i] = modi.name;
            descriptions[i] = modi.description;
            authors[i] = modi.author;
            mHash[i] = modi.materialsHash;
            qHash[i] = modi.questionsHash;
        }
        
        return(request.name, request.description, request.author, request.key, names, descriptions, mHash, qHash);
    }



    function returnEdit(uint _ID) public view returns(uint[] memory ID, string[] memory qHash, string[] memory mHash) {
        Edit[] memory editsArray = editKey[_ID];

        uint[] memory IDs = new uint[](editsArray.length);
        string[] memory mHashs = new string[](editsArray.length);
        string[] memory qHashs = new string[](editsArray.length);

        for (uint i = 0; i < editsArray.length; i++) {
            Edit memory ed = editsArray[i];
            IDs[i] = ed.targetID;
            mHashs[i] = ed.newMaterialsHash;
            qHashs[i] = ed.newQuestionsHash;
        }

        return(IDs, mHashs, qHashs);
    }

    
    function approveRequest(uint _index) public restricted {
        Request storage request = requests[_index];
        //checks that the module has not been approved already
        require(request.confirmed == false);

        //add a signal here for error message?
        approveModules(_index);
        approveEdits(_index);

        request.approver = msg.sender;
        request.confirmed = true;
    }

    function approveModules(uint ID) public restricted {
        Module[] memory modulesArray = moduleKey[ID];

        require(modulesArray.length > 0);

        for (uint i = 0; i < modulesArray.length; i++) {
            modules.push(modulesArray[i]);
        }
    }

    function approveEdits(uint ID) public restricted {
        Edit[] memory editsArray = editKey[ID];

        require(editsArray.length > 0);


        for (uint i = 0; i < editsArray.length; i++) {
            Edit memory ed = editsArray[i];
            Module storage mod = modules[ed.targetID];
            mod.materialsHash = ed.newMaterialsHash;
            mod.questionsHash = ed.newQuestionsHash;
        }
    }

    function addModule(string memory _name, string memory _desc, address _author, 
    string memory _mHash, string memory _qHash) 
    public restricted {
        Module memory newModule = Module({
            name: _name,
            description: _desc,
            author: _author,
            materialsHash: _mHash,
            questionsHash: _qHash
        });
        modules.push(newModule);
    }

    function editModule(uint _ID, string memory _mHash, string memory _qHash) public restricted {
        Module storage mod = modules[_ID];
        mod.materialsHash = _mHash;
        mod.questionsHash = _qHash;
    }

    function addInitialModules(string[] memory _name, string[] memory _description, 
    string[] memory _mHash, string[] memory _qHash) public {

        for (uint i=0; i<_name.length; i++) {
            moduleToRequest(_name[i], _description[i], _mHash[i], _qHash[i]);
        }
        moduleKey[index] = newModules;
        delete newModules;
        approveModules(index);
        index++;
    }
}