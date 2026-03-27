import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { version } from "os";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Rifat's Calculator",
  version: "1.0.0"
});



// Tool function
async function getMyCaleraDataByDate(date){
    const calender=google.calender({
        version:"v3",
        auth: process.env.GOOGLE_CALENDER_API_KEY
    })
}



// Register  an addition tool
server.tool(
    "getMyCalendarDataByDate",
    {
        date: z.string().refine((val)=>!isNaN(Date.parse(val)),{
            message: "Invalid date format. Please provide a valid date string."
        }),
    },
    async({date})=>{
        return {
            content: [
                {
                    type:"text",
                    text: JSON.stringify(await getMyCaleraDataByDate(date)),
                }
            ]
        }
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