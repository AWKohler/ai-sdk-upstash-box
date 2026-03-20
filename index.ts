import { Box } from "@upstash/box"
import "dotenv/config"

const box = await Box.create({
  runtime: "node",
  env: { ANTHROPIC_KEY: process.env.ANTHROPIC_KEY! },
})

await box.exec.command("npm init -y")
await box.exec.command("npm pkg set type=module")

await box.exec.command("npm install ai @ai-sdk/anthropic")
await box.files.upload([{ path: "dist/ai.js", destination: "src/ai.js" }])

const result = await box.exec.command("node src/ai.js")
console.log({ result })
