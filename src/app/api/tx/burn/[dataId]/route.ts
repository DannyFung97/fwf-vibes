import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, getAbiItem } from "viem";
import VibesTokenAbi from "../../../../lib/abi/VibesToken";

const protocol_address = '0x53D6D64945A67658C66730Ff4a038eb298eC8902'
const contract_address = '0xEAB1fF15f26da850315b15AFebf12F0d42dE5421'

export async function POST(
  _req: NextRequest,
  { params: { dataId } }: { params: { dataId: string } }
) {

  const data = encodeFunctionData({
    abi: VibesTokenAbi,
    functionName: "burn",
    args: [BigInt(dataId), protocol_address],
  });
  const errorsAbi = VibesTokenAbi.filter((t) => t.type === "error");
  const functionAbi = getAbiItem({
    abi: VibesTokenAbi,
    name: "burn",
  });
  const txData = {
    chainId: `eip155:8453`,
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
