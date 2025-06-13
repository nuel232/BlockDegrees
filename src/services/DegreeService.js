import { ethers } from 'ethers';
import degreeABI from '../abi/degree.json';

// Cache for metadata
const metadataCache = new Map();
const ownershipCache = new Map();

// Use a reliable IPFS gateway
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

class DegreeService {
    constructor(contractAddress) {
        this.contractAddress = contractAddress;
        this.contract = null;
        this.provider = null;
    }

    // Initialize the service with a provider
    async init(provider) {
        this.provider = provider;
        this.contract = new ethers.Contract(
            this.contractAddress,
            degreeABI,
            provider
        );
    }

    // Convert IPFS URI to HTTP URL
    getIPFSGatewayURL(ipfsURI) {
        return ipfsURI.replace('ipfs://', IPFS_GATEWAY);
    }

    // Get degree metadata with caching
    async getDegreeMetadata(tokenId) {
        try {
            // Check cache first
            if (metadataCache.has(tokenId)) {
                return metadataCache.get(tokenId);
            }

            // Get metadata from contract
            const metadataURI = await this.contract.getDegreeMetadata(tokenId);
            const metadataURL = this.getIPFSGatewayURL(metadataURI);
            
            // Fetch metadata from IPFS
            const response = await fetch(metadataURL);
            if (!response.ok) throw new Error('Failed to fetch metadata');
            
            const metadata = await response.json();
            
            // Cache the result
            metadataCache.set(tokenId, metadata);
            return metadata;
        } catch (error) {
            console.error('Error fetching degree metadata:', error);
            throw new Error('Failed to fetch degree metadata');
        }
    }

    // Verify degree ownership with caching
    async verifyDegree(owner, tokenId) {
        try {
            const cacheKey = `${owner}-${tokenId}`;
            
            // Check cache first
            if (ownershipCache.has(cacheKey)) {
                return ownershipCache.get(cacheKey);
            }

            // Verify ownership
            const isValid = await this.contract.ownsDegree(owner, tokenId);
            
            // Cache the result
            ownershipCache.set(cacheKey, isValid);
            return isValid;
        } catch (error) {
            console.error('Error verifying degree:', error);
            throw new Error('Failed to verify degree');
        }
    }

    // Issue a new degree
    async issueDegree(recipient, tokenId, metadataURI) {
        try {
            const signer = this.provider.getSigner();
            const contractWithSigner = this.contract.connect(signer);
            
            const tx = await contractWithSigner.issueDegree(recipient, tokenId, metadataURI);
            await tx.wait();
            
            // Clear caches for this token
            metadataCache.delete(tokenId);
            ownershipCache.delete(`${recipient}-${tokenId}`);
            
            return tx;
        } catch (error) {
            console.error('Error issuing degree:', error);
            throw new Error('Failed to issue degree');
        }
    }

    // Clear cache for a specific token
    clearCache(tokenId) {
        metadataCache.delete(tokenId);
        // Clear all ownership cache entries for this token
        for (const key of ownershipCache.keys()) {
            if (key.endsWith(`-${tokenId}`)) {
                ownershipCache.delete(key);
            }
        }
    }
}

export default DegreeService; 