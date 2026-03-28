import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";

// Create an MCP server
const server = new McpServer({
  name: "Rifat's Calculator",
  version: "1.0.0"
});




// Tool function
async function getMyCalendarDataByDate(date){
    const calender=google.calendar({
        version:"v3",
        auth: process.env.GOOGLE_CALENDAR_API_KEY
    })


    // calculate the start and end of the given date
    const start=new Date(date);
    start.setUTCHours(0,0,0,0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    try{
        const res=await calender.events.list({
            calendarId:process.env.CALENDAR_ID,
            timeMin:start.toISOString(),
            timeMax:end.toISOString(),
            maxResults:10,
            singleEvents:true,
            orderBy:"startTime"
        });

        const events=res.data.items || [];
        const meetings=events.map((event)=>{
            const start=event.start.dateTime || event.start.date;
            return `${event.summary} at ${new Date(start).toLocaleString()}`;
        });

        if(meetings.length>0){
            return {
                meetings,
            };
        } else{
            return{
                meetings : [],
            }
        }
    } catch(error){
        return{
            error: error.message,
        }
    }
}




// Register the tool correctly
server.tool(
  "getMyCalendarDataByDate",
  {
    parameters: z.object({
      date: z.string().describe("The date to fetch meetings for (YYYY-MM-DD)")
    })
  },
  async ({ date }) => {
    try {
      const result = await getMyCalendarDataByDate(date);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ]
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: error.message
          }
        ]
      };
    }
  }
);



// set transport
async function init(){
    const transport= new StdioServerTransport();
    await server.connect(transport);
}

// start the server
init();