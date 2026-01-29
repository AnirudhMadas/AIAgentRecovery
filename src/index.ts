import { processElevenLabsCall } from "./services/elevenLabshandler";

async function main() {
  for (let i = 0; i < 10; i++) {
    try {
      await processElevenLabsCall();
    } catch (err) {
      console.log("Call failed:", (err as Error).message);
    }
  }
}

main();