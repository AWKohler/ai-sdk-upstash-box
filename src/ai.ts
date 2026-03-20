import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText, tool } from "ai"
import { execSync } from "child_process"
import { writeFileSync } from "fs"
import { z } from "zod"

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_KEY,
})

async function runAgent() {
  const { text, steps } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    prompt: "Write a Node.js script to /tmp/hello.js that prints 'Hello from the sandbox!' and run it.",
    maxSteps: 5,
    tools: {
      writeFile: tool({
        description: "Write content to a file",
        parameters: z.object({
          path: z.string().describe("Absolute file path"),
          content: z.string().describe("File content"),
        }),
        execute: async ({ path, content }) => {
          writeFileSync(path, content)
          return `Wrote ${content.length} bytes to ${path}`
        },
      }),
      executeCommand: tool({
        description: "Execute a shell command and return its output",
        parameters: z.object({
          command: z.string().describe("Shell command to run"),
        }),
        execute: async ({ command }) => {
          try {
            return execSync(command, { encoding: "utf8" })
          } catch (err: any) {
            return err.message
          }
        },
      }),
    },
  })

  console.log({ steps: steps.length, text })
}

runAgent()
