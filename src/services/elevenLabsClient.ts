import { TransientError } from "../errors/TransientError";

export async function callElevenLabs(): Promise<void> {
  // Simulate random 503 failure
  const random = Math.random();
  if (random < 0.7) {
    throw new TransientError(
      "503 Service Unavailable",
      "ElevenLabs"
    );
  }
  console.log("ElevenLabs call succeeded");
}