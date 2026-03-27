import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Rifat's Calculator",
  version: "1.0.0"
});

// Add an addition tool
server.tool(
    "getMyCalendarDataByDate",
    {
        date: z.string().refine((val)=>!isNaN(Date.parse(val)),{
            message: "Invalid date format. Please provide a valid date string."
        })
    }
)

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);