// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract DegreeToken is ERC721URIStorage {
    uint256 public _tokenCounter;
    address private admin;

    constructor() ERC721("DegreeToken", "DEG") {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender, "Not Authorized");
        _;
    }

    error NotOwner(address caller, uint256 tokenId);

    function issueDegree(address recipient, uint256 tokenId, string memory metadataURI) public onlyAdmin {
        _tokenCounter++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }

    function transferDegree(address to, uint256 tokenId) public {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotOwner(msg.sender, tokenId);
        }
        safeTransferFrom(msg.sender, to, tokenId);
    }

    function ownsDegree(address owner, uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) == owner;
    }

    function getDegreeMetadata(uint256 tokenId) public view returns (string memory) {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotOwner(msg.sender, tokenId);
        }
        return tokenURI(tokenId);
    }

    function validateDegree(address owner, uint256 tokenId) public view returns (string memory) {
        if (ownerOf(tokenId) != owner) {
            revert NotOwner(owner, tokenId);
        }
        return tokenURI(tokenId);
    }

    function updateDegreeMetadata(uint256 tokenId, string memory newMetadataURI) public onlyAdmin {
        _setTokenURI(tokenId, newMetadataURI);
    }

    function revokeDegree(uint256 tokenId) public onlyAdmin {
        _burn(tokenId);
    }
}
