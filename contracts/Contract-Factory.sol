// Contract Factory

// SPDX-License-Identifier: GPL-3.0

import "./Course-Contract.sol"; 

pragma solidity >=0.7.0 <0.9.0;

contract CourseFactory{

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