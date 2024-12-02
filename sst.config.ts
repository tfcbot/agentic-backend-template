/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
      return {
        name: "agentic-api-template",
        removal: input?.stage === "prod" ? "retain" : "remove",
        
        home: "aws",
        providers: { aws: {
          region: "us-east-1",
        }, "aws-native": {
          region: "us-east-1",
        }, 
        cloudflare: {
          version: "5.42.0",
          apiToken: process.env.CLOUDFLARE_API_TOKEN,
        }
      },
      };
    },
    async run() {
      const infra = await import("./infra");
      return {
        api: infra.api.url,
      };
    },
    console: {
      autodeploy: {    
        target(event) {      
          if (event.type === "branch" && event.branch != "main" && event.action === "pushed") {        
            return {          
              stage: event.branch,          
              runner: { 
                engine: "codebuild", 
                compute: "large",
                architecture: "arm64" 
              }        
            };      
          }   
          if (event.type === "branch" && event.branch === "main" && event.action === "pushed") {
            return {
              stage: "prod",
              runner: {
                engine: "codebuild",
                compute: "large",
                architecture: "arm64"
              }
            };
          }
        }  
      }
    }
  });
  