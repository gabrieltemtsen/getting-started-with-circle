const yargs = require("yargs");
const {
  initiateUserControlledWalletsClient,
} = require("@circle-fin/user-controlled-wallets");

require("dotenv").config();

const client = initiateUserControlledWalletsClient({
  apiKey: process.env.API_KEY,
});

//CREATE USER
async function createNewUser() {
  let response = await client.createUser({
    userId: "User_1",
  });

  console.log("User created successfully");
}

//CREATE USER SESSION TOKEN
async function createSessionToken() {
  let response = await client.createUserToken({
    userId: "User_1",
  });

  console.log(response.data);
}

// Create Challenge for Wallet Creation
async function createChallengeForWalletCreation() {
  let response = await client.createUserPinWithWallets({
    userId: "User_1",
    blockchains: ["ETH-SEPOLIA"],
    userToken: process.env.USER_TOKEN_1,
  });

  console.log(response.data?.challengeId);
}

// Create Challenge for SCA Wallet Creation
async function createChallengeForSCAWalletCreation() {
  let response = await client.createUserPinWithWallets({
    userId: "User_2",
    blockchains: ["ETH-SEPOLIA"],
    accountType: "SCA",
    userToken: process.env.USER_2_TOKEN,
  });

  console.log(response.data?.challengeId);
}
// 5797fbd6-3795-519d-84ca-ec4c5f80c3b1

// #Step 5 - Fetch Wallet Balance
async function fetchWallet() {
  let response = await client.getWalletTokenBalance({
    walletId: process.env.SCA_WALLET_ID,
    userToken: process.env.USER_2_TOKEN,
    userId: "User_2",
  });

  console.log(response.data?.tokenBalances);
}

 // Create Challenge for Outbound Transfer
async function createChallengeForOutboundTransfer() {
  let response = await client.createTransaction({
    idempotencyKey: "ENTER IDEMPOTENCY KEY",
    amounts: ["0.1"],
    destinationAddress: "0X-ENTER DESTINATION ADDRESS",
    tokenId: "5797fbd6-3795-519d-84ca-ec4c5f80c3b1", //USDC TOKEN ID
    walletId: process.env.SCA_WALLET_ID,
    userId: "User_2",
    fee: {
      type: "level",
      config: {
        feeLevel: "MEDIUM",
      },
    },
    userToken: process.env.USER_2_TOKEN,
  });
  console.log(response.data?.challengeId);
}

yargs
  .scriptName("circle_server")
  .usage("$0 <cmd> [args]")

  .command(
    "create-user",
    "Create a new user",
    () => {},
    (argv) => {
      createNewUser();
    }
  )

  .command(
    "create-token",
    "Create a session token",
    () => {},
    (argv) => {
      createSessionToken();
    }
  )

  .command(
    "create-challenge-wallet",
    "Create Challenge to Create Wallet",
    () => {},
    (argv) => {
      createChallengeForWalletCreation();
    }
  )

  .command(
    "create-challenge-sca-wallet",
    "Create Challenge to Create SCA Wallet",
    () => {},
    (argv) => {
      createChallengeForSCAWalletCreation();
    }
  )

  .command(
    "fetch-wallet",
    "Fetch wallet",
    () => {},
    (argv) => {
      fetchWallet();
    }
  )

  .command(
    "create-challenge-outbound-transfer",
    "Create Challenge for Outbound Transfer",
    () => {},
    (argv) => {
      createChallengeForOutboundTransfer();
    }
  )

  .help().argv;
