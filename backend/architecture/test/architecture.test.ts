import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ArchitectureStack } from "../lib/architecture-stack";

test("DynamoDB Table Created with correct props", () => {
  const app = new cdk.App();
  const stack = new ArchitectureStack(app, "MyTestStack");

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::DynamoDB::Table", {
    TableName: "Users",
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });
});

test("All 4 Lambda Functions Are Created", () => {
  const app = new cdk.App();
  const stack = new ArchitectureStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  const lambdaFunctions = template.findResources("AWS::Lambda::Function");

  expect(Object.keys(lambdaFunctions)).toHaveLength(5);
});

test("API Gateway Created with /users and /users/{id} resources", () => {
  const app = new cdk.App();
  const stack = new ArchitectureStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::ApiGateway::RestApi", 1);

  template.hasResourceProperties("AWS::ApiGateway::Method", {
    HttpMethod: "POST",
  });

  template.hasResourceProperties("AWS::ApiGateway::Method", {
    HttpMethod: "GET",
  });

  template.hasResourceProperties("AWS::ApiGateway::Method", {
    HttpMethod: "PUT",
  });

  template.hasResourceProperties("AWS::ApiGateway::Method", {
    HttpMethod: "DELETE",
  });
});
