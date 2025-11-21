require("dotenv").config();
const { Agent, Task, PraisonAIAgents } = require("praisonai");

// Module Maker Agent
const moduleMaker = new Agent({
  name: "ModuleMakerAgent",
  instructions: `
    You are a helpful assistant that creates educational modules.
    The topic is: {{topic}}
    Create clear module names and descriptions.
    The module should be relevant to the topic and engaging for learners. It should cover key aspects of the topic.
    Provide atleast 5 modules, each with a name and a brief description (2-3 lines).
    Format the output as a JSON array of objects, each with "name" and "description" keys.
  `,
  llm: "gemini-2.5-flash",
});

// Task Definition
const task = new Task({
  agent: moduleMaker,
  name: "ModuleCreationTask",
 
  input_schema: {
    type: "object",
    properties: {
      topic: { type: "string" }
    },
    required: ["topic"]
  },

  expected_output: {
    modules: "array of objects containing module name and 2/3 lines description",
  },
});

// Multi-Agent Manager
const agents = new PraisonAIAgents({
  agents: [moduleMaker],
  tasks: [task],
  verbose: true,
  process: "hierarchical",
  llm: "gemini-2.5-flash",
});

// Run
async function main(topic) {
  const result = await agents.start("ModuleCreationTask", {
    topic: topic,
  });
    console.log(result);
  return result;
}
main ("Intro to DBMS");
module.exports = {
	main
}