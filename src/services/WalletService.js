import { BrowserProvider, Contract, Interface } from "ethers";

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  checkMetaMask() {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      throw new Error("Please install MetaMask to continue");
    }
    return true;
  }

  async connectMetaMask() {
    try {
      this.checkMetaMask();

      // Request MetaMask specifically
      this.provider = new BrowserProvider(window.ethereum, "any");
      await this.provider.send("eth_requestAccounts", []);

      this.signer = await this.provider.getSigner();
      this.address = await this.signer.getAddress();

      // Store connection info
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletType", "metamask");
      localStorage.setItem("walletAddress", this.address);

      return {
        address: this.address,
        provider: this.provider,
        signer: this.signer,
      };
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw new Error(error.message || "Error connecting to MetaMask");
    }
  }

  async disconnect() {
    try {
      // Clear the provider and signer
      this.provider = null;
      this.signer = null;
      this.address = null;

      // Clear stored connection info
      localStorage.removeItem("walletConnected");
      localStorage.removeItem("walletType");
      localStorage.removeItem("walletAddress");

      // Force a page reload to clear any cached provider state
      window.location.reload();

      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw new Error("Error disconnecting wallet");
    }
  }

  isConnected() {
    return localStorage.getItem("walletConnected") === "true";
  }

  getAddress() {
    return localStorage.getItem("walletAddress");
  }

  async getNetwork() {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }
    return await this.provider.getNetwork();
  }

  async getContract(address, abiJson) {
    try {
      // Force reconnect to ensure fresh signer
      const { signer } = await this.connectMetaMask();

      if (!signer) {
        throw new Error("Wallet not connected");
      }

      // Create interface from ABI
      const contractInterface = new Interface(abiJson);

      return new Contract(address, contractInterface, signer);
    } catch (error) {
      console.error("Error getting contract:", error);
      throw error;
    }
  }

  // Listen for account changes
  listenToAccountChanges(callback) {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
          callback(null);
        } else {
          this.address = accounts[0];
          localStorage.setItem("walletAddress", this.address);
          callback(this.address);
        }
      });
    }
  }

  // Listen for network changes
  listenToNetworkChanges(callback) {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainId) => {
        callback(chainId);
      });
    }
  }
}

export const walletService = new WalletService();
