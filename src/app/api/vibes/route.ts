import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import VibesTokenAbi from "../../lib/abi/VibesToken.json";
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
    // const frameMessage = Message.decode(Buffer.from(messageBytes, "hex"));
    // const validateResult = await hubClient.validateMessage(frameMessage);

    // if (validateResult.isOk() && validateResult.value.valid) {

      // const validMessage = validateResult.value.message;
  
      // let urlBuffer = validMessage?.data?.frameActionBody?.url ?? [];
      // const urlString = Buffer.from(urlBuffer).toString("utf-8");
      // if (!urlString.startsWith(process.env["HOST"] ?? "")) {
      //   return new NextResponse("Bad Request", { status: 400 });
      // }

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
            mintCost: mintRes as string,
            burnProceeds: burnRes as string,
          });
  
        const imageUrl = `${process.env["HOST"]}/api/images/trade?${imageParams.toString()}`;

        const mintParams = new URLSearchParams({
            mintCost: mintRes as string,
            amount: formattedInput as string,
          });

        const mintTxUrl = `${HOST}/api/tx/mint?${mintParams.toString()}`;

        const burnParams = new URLSearchParams({
            amount: formattedInput as string,
          });

        const burnTxUrl = `${HOST}/api/tx/burn?${burnParams.toString()}`;

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
              <meta name="fc:frame:button:1" content="mint!" />
              <meta name="fc:frame:button:1:action" content="tx" />
              <meta name="fc:frame:button:1:target" content="${mintTxUrl}" />
              <meta name="fc:frame:button:1" content="burn!" />
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
    // } else {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }
  }
  
  export const GET = POST;