import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import VibesTokenAbi from "../../lib/abi/VibesToken";
import { base } from "viem/chains";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";

const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
const hubClient = getSSLHubRpcClient(HUB_URL);

const HOST = process.env["HOST"] ?? "https://floor-sweep-frame.vercel.app";

const vibesTokenContractAddress = "0xEAB1fF15f26da850315b15AFebf12F0d42dE5421";

export async function POST(req: NextRequest) {
    const {
      untrustedData: { inputText },
      trustedData: { messageBytes },
    } = await req.json();

        const postUrl = `${HOST}/api/watchTx`;

        const formattedInput = inputText.replace(/[^0-9]/g, "") ?? "100";
    
        const publicClient = createPublicClient({
            chain: base,
            transport: http(),
          });
    
        const mintRes = await publicClient.readContract({
            address: vibesTokenContractAddress,
            abi: VibesTokenAbi,
            functionName: "mintCostAfterFees",
            args: [BigInt(formattedInput)],
          });

          const burnRes = await publicClient.readContract({
            address: vibesTokenContractAddress,
            abi: VibesTokenAbi,
            functionName: "burnProceedsAfterFees",
            args: [BigInt(formattedInput)],
          });

        const imageParams = new URLSearchParams({
            mintCost: String(mintRes),
            burnProceeds: String(burnRes),
            amount: formattedInput as string,
          });
  
        const imageUrl = `${process.env["HOST"]}/api/images/trade?${imageParams.toString()}`;

        const mintTxUrl = `${HOST}/api/tx/mint/${String(mintRes).concat(':').concat(formattedInput as string)}`;

        const burnTxUrl = `${HOST}/api/tx/burn/${formattedInput as string}`;

        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head>
              <title>Vibes:</title>
              <meta property="og:title" content="Vibes:" />
              <meta property="og:image" content="${imageUrl}" />
              <meta name="fc:frame" content="vNext" />
              <meta name="fc:frame:post_url" content="${postUrl}" />
              <meta name="fc:frame:image" content="${imageUrl}" />
              <meta name="fc:frame:button:1" content="buy!" />
              <meta name="fc:frame:button:1:action" content="tx" />
              <meta name="fc:frame:button:1:target" content="${mintTxUrl}" />
              <meta name="fc:frame:button:2" content="sell!" />
              <meta name="fc:frame:button:2:action" content="tx" />
              <meta name="fc:frame:button:2:target" content="${burnTxUrl}" />
            </head>
            <body/>
          </html>`,
          {
            status: 200,
            headers: {
              "Content-Type": "text/html",
            },
          }
        );
  }
  
  export const GET = POST;