import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, getAbiItem } from "viem";
import VibesTokenAbi from "../../../lib/abi/VibesToken";

const protocol_address = '0x53D6D64945A67658C66730Ff4a038eb298eC8902'
const contract_address = '0xEAB1fF15f26da850315b15AFebf12F0d42dE5421'

export async function POST(
  _req: NextRequest,
  { params: { amount } }: { params: { amount: string } }
) {

  const mintAbi = [{
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "_streamerAddress",
        type: "address"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }]

  const data = encodeFunctionData({
    abi: mintAbi,
    functionName: "burn",
    args: [BigInt(amount), protocol_address],
  });
  const errorsAbi = VibesTokenAbi.filter((t) => t.type === "error");
  const functionAbi = getAbiItem({
    abi: VibesTokenAbi,
    name: "burn",
  });
  const txData = {
    chainId: `8453`,
    method: "eth_sendTransaction",
    params: {
      functionSignature: "", // deprecated, use abi below
      abi: [functionAbi, ...errorsAbi],
      to: contract_address,
      data,
    },
  };
  return NextResponse.json(txData);
}

export const GET = POST;
