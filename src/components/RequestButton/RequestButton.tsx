import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { SeiSigningCosmWasmClient, WalletWindowKey } from '@sei-js/core'
import { useWallet, SeiSigningStargateClient } from '@sei-js/react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Stack
} from '@mui/material'
import { useMutation } from 'react-query'
import { AccountData } from '@cosmjs/proto-signing'
import axios from 'axios'
import { useRouter } from 'next/router'
import { CosmWasmClient, createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate'
import {
  AminoTypes,
  createIbcAminoConverters,
  GasPrice
} from '@cosmjs/stargate'
import { useRefetchQueries } from "@sparrowswap/hooks/useRefetchQueries";
import { walletTypeState } from "@sparrowswap/types/walletTypeState";
import { makeADR36AminoSignDoc } from "@sparrowswap/services/signDoc";
import {sign} from "crypto";

const RequestButton = () => {
  const [chainInfo] = useChainInfo()
  const [noNFTModal, setNoNFTModal] = useState(false);
  const [failModal, setFailModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [walletType, setWalletType] = useRecoilState(walletTypeState);

  const router = useRouter()
  const user_id = router.query.user_id

  const checkNFTKeplr = async () => {
    try {
      if (!window.keplr) {
        console.log("Please install Keplr");
        alert("Please install keplr extension");
        return;
      }

      // Get Keplr offlineSigner
      const offlineSigner = window.keplr.getOfflineSigner("atlantic-2");
      const address = (await offlineSigner.getAccounts())[0].address;

      const { signature } = await window.keplr.signArbitrary("atlantic-2", address, user_id as string);

      const collections = [
        {
          "id": "ogapril2023",
          "name": "Sparrowswap OG April 2023",
          "address": "sei1mn73rzt8yla2qc3vg65jvfan84axwzynepnleukt69yxrqgehwss09x7hl"
        }
      ]
      const queryMessage = {
        tokens: {
          owner: address
        },
      }
      console.log("OfflineSigner: ", offlineSigner)
      console.log("Using address: ", address)
      console.log("On collection adddress: ", collections[0].address)
      console.log("With msg ", queryMessage)
      const wasmChainClient = await SeiSigningCosmWasmClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString("0.0025usei"),
          aminoTypes: new AminoTypes(
            Object.assign(
              createIbcAminoConverters(),
              createWasmAminoConverters()
            )
          ),
        }
      )
      const tokenIDs = await wasmChainClient.queryContractSmart(collections[0].address, queryMessage)

      if (tokenIDs == null || tokenIDs.tokens.length == 0) {
        setNoNFTModal(true);
      }
      console.log("Sending request to server: ", {
        address: address,
        user_id: user_id,
        exists: true,
        transaction_message: transaction_message,
        signature: signature,
      })
      const response = await axios.post('http://localhost:8090/role_assign_upon_nft', {
        address: address,
        user_id: user_id,
        exists: true,
        transaction_message: transaction_message,
        signature: signature,
      });
      // Check the response if needed
      console.log("Response.data", response.data);
      console.log("Response.status", response.status);

      if (response.status == 200) {
        setSuccessModal(true);
      } else {
        setFailModal(true)
      }
    } catch (error) {
      console.error(error);
      setFailModal(true)
    }
  };

  const checkNFTLeap = async () => {
    try {
      if (!window.keplr) {
        console.log("Please install Keplr");
        alert("Please install keplr extension");
        return;
      }

      // Get Keplr offlineSigner
      const offlineSigner = window.keplr.getOfflineSigner("atlantic-2");
      const address = (await offlineSigner.getAccounts())[0].address;
      // const wasmChainClient = await SeiSigningStargateClient.connectWithSigner(
      //   chainInfo.rpc,
      //   offlineSigner,
      //   {
      //     gasPrice: GasPrice.fromString(`0.0025usei`),
      //     /*
      //      * passing ibc amino types for all the amino signers (eg ledger, wallet connect)
      //      * to enable ibc & wasm transactions
      //      * */
      //     aminoTypes: new AminoTypes(
      //       Object.assign(
      //         createIbcAminoConverters(),
      //         createWasmAminoConverters()
      //       )
      //     ),
      //   }
      // )

      // Get the accounts associated with the offlineSigner
      // const accounts = await offlineSigner.getAccounts();

      // Assuming you want to use the first account
      // const signerAddress = accounts[0].address;
      const discordBotVerificationMessage = {"Discord username": user_id};
      const discordBotVerificationMessageBuffer = Buffer.from(JSON.stringify(discordBotVerificationMessage));
      const signDoc = {
        chain_id: "",
        account_number: "0",
        sequence: "0",
        fee: {
          gas: "0",
          amount: [],
        },
        msgs: [
          {
            type: "sign/MsgSignData",
            value: {
              signer: address,
              data: discordBotVerificationMessageBuffer.toString("base64"),
            },
          },
        ],
        memo: "",
      }
      const signDocString = JSON.stringify(signDoc);
      const uint8Msg = Uint8Array.from(Buffer.from(signDocString));
      console.log("uint8MsgString: ", uint8Msg)

      console.log("Checking NFT presence")

      const {signed, signature} = await window.keplr.signArbitrary("", address, uint8Msg);
      const transaction_message = signed

      console.log("transaction_message", transaction_message, "Signature: ", signature);


      const collections = [
        {
          "id": "ogapril2023",
          "name": "Sparrowswap OG April 2023",
          "address": "sei1mn73rzt8yla2qc3vg65jvfan84axwzynepnleukt69yxrqgehwss09x7hl"
        }
      ]
      const queryMessage = {
        tokens: {
          owner: address
        },
      }
      console.log("OfflineSigner: ", offlineSigner)
      console.log("Using address: ", address)
      console.log("On collection adddress: ", collections[0].address)
      console.log("With msg ", queryMessage)
      const wasmChainClient = await SeiSigningCosmWasmClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString("0.0025usei"),
          aminoTypes: new AminoTypes(
            Object.assign(
              createIbcAminoConverters(),
              createWasmAminoConverters()
            )
          ),
        }
      )
      const tokenIDs = await wasmChainClient.queryContractSmart(collections[0].address, queryMessage)

      if (tokenIDs == null || tokenIDs.tokens.length == 0) {
        setNoNFTModal(true);
      }
      console.log("Sending request to Captain Autopirate: ", {
        address: address,
        user_id: user_id,
        exists: true,
        transaction_message: transaction_message,
        signature: signature,
      })
      const response = await axios.post('http://localhost:8090/role_assign_upon_nft', {
        address: address,
        user_id: user_id,
        exists: true,
        transaction_message: transaction_message,
        signature: signature,
      });
      // Check the response if needed
      console.log("Response.data", response.data);
      console.log("Response.status", response.status);

      if (response.status == 200) {
        setSuccessModal(true);
      } else {
        setFailModal(true)
      }
    } catch (error) {
      console.error(error);
      setFailModal(true)
    }
  };

  const checkNFT = async () => {
    if (walletType === 'keplr') {
      await checkNFTKeplr();
    } else if (walletType === 'leap') {
      await checkNFTLeap();
    } else {
      console.error(`Unsupported wallet type: ${walletType}`);
    }
  };


  return (
    <>
      <Button
        disabled={false}
        color='primary'
        variant='contained'
        size='large'
        onClick={() => checkNFT()}
      >
        Request
      </Button>
      {noNFTModal && (
        <Dialog
          open={noNFTModal}
          onClose={() => setNoNFTModal(false)}
        >
          <DialogContent>
            <DialogContentText>
              NFT is not found; complete the next missions https://medium.com/@sparrowswap,
              and retweet @Sparrowswapxyz and #SparrowswapAhoy please on Twitter
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {failModal && (
        <Dialog
          open={failModal}
          onClose={() => setFailModal(false)}
        >
          <DialogContent>
            <DialogContentText>
              Err, Captain Autopirate's gadget malfunctions, please ask your friends on Discord or contact Discord admin
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {successModal && (
        <Dialog
          open={successModal}
          onClose={() => setSuccessModal(false)}
        >
          <DialogContent>
            <DialogContentText>
              NFT found, sent to Captain Autopirate.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RequestButton;
