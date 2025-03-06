# BlockDegrees

BlockDegrees is a web application that leverages blockchain technology to provide verifiable academic credentials. This platform allows users to easily verify their degrees and share them with potential employers, streamlining the hiring process.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Blockchain-Powered Degrees**: Each degree is tokenized into a unique, non-fungible token (NFT) that guarantees its authenticity.
- **Instant Verification**: Employers and institutions can verify certificates in seconds, eliminating fraud.
- **Global Access**: Credentials are stored on the blockchain, accessible anytime, anywhere.
- **User Testimonials**: Read what users are saying about BlockDegrees.

## How It Works

1. **Issuance**: Educational institutions mint your degree as a secure, unique token on the blockchain.
2. **Ownership**: Your degree is stored in your blockchain wallet, giving you full ownership and control.
3. **Verification**: Employers can verify your degree instantly using its unique token ID.
4. **Sharing**: Easily share your credentials with anyone, anywhere.

## Installation

To get started with BlockDegrees, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/research_seminar.git
   ```

2. Navigate to the project directory:
   ```bash
   cd research_seminar
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

Once the server is running, open your browser and navigate to `http://localhost:3000` to view the application. You can explore the features, read testimonials, and learn more about how BlockDegrees works.

## Project Structure

The project structure is as follows:

```
research_seminar/
├── NFT-Ceritificate/
│   ├── contracts/
│   │   └── degree.sol
│   ├── ignition/
│   │   └── modules/
│   │       └── Lock.js
│   ├── test/
│   │   └── Lock.js
│   ├── .gitignore
│   ├── hardhat.config.js
│   ├── package.json
│   └── README.md
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── abi/
│   │   └── degree.json
│   ├── components/
│   │   ├── DegreeDetails.js
│   │   ├── Features.js
│   │   ├── Footer.js
│   │   ├── Hero.js
│   │   ├── HowItWorks.js
│   │   ├── Navbar.js
│   │   ├── Testimonials.js
│   │   └── VerifyCertificateModal.js
│   ├── styles/
│   │   ├── DegreeDetails.css
│   │   ├── Features.css
│   │   ├── Footer.css
│   │   ├── Hero.css
│   │   ├── HowItWorks.css
│   │   ├── Navbar.css
│   │   ├── Testimonials.css
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   ├── server.js
│   ├── services/
│   │   └── WalletService.js
│   ├── setupTests.js
├── .env
├── .gitignore
├── certificates.csv
├── package.json
├── project proposal.docx
└── README.md
```

## Technologies Used

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Smart Contracts**: OpenZeppelin ERC721
- **Testing**: Hardhat, Chai
- **Deployment**: Hardhat Ignition
- **Wallet Integration**: MetaMask

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please fork the repository and submit a pull request. 

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the developers and contributors of the libraries and frameworks used in this project.
- Special thanks to the users who provided testimonials and feedback.
