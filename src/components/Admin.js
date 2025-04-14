const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
require('dotenv').config();

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const uploadCertificateToIPFS = async (filePath) => {
    try {
        console.log('Starting upload for:', filePath);
        const readableStreamForFile = fs.createReadStream(filePath);
        const options = {
            pinataMetadata: {
                name: 'Certificate',
                keyvalues: {
                    customKey: 'customValue'
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
        console.log('Certificate uploaded:', result);
        return result.IpfsHash;
    } catch (error) {
        console.error('Error uploading certificate:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request made but no response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    }
};

const listAllCertificates = async () => {
    try {
        const filters = {
            status: 'pinned',
            pageLimit: 10,
            pageOffset: 0,
            metadata: {
                name: 'Certificate'
            }
        };
        const result = await pinata.pinList(filters);
        console.log('All certificates:', result);
        return result;
    } catch (error) {
        console.error('Error listing certificates:', error);
    }
};

const displayCertificatesForAdmin = async () => {
    const certificates = await listAllCertificates();
    certificates.rows.forEach(cert => {
        console.log(`Certificate: ${cert.metadata.name}, IPFS Hash: ${cert.ipfs_pin_hash}`);
    });
};

displayCertificatesForAdmin(); 