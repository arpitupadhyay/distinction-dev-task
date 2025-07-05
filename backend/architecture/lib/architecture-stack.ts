import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as logs from "aws-cdk-lib/aws-logs";
import * as path from "path";

export class ArchitectureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersTable = new dynamodb.Table(this, "UsersTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "Users",
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const commonLayer = new lambda.LayerVersion(this, "CommonLayer", {
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../layers/common/dist")
      ),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      description: "Shared utilities layer",
    });

    const createLambda = (name: string) =>
      new lambdaNodejs.NodejsFunction(this, `${name}Fn`, {
        entry: path.join(__dirname, `../../lambdas/${name}.ts`),
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: 256,
        timeout: cdk.Duration.seconds(15),
        environment: {
          TABLE_NAME: usersTable.tableName,
        },
        layers: [commonLayer],
        logRetention: logs.RetentionDays.ONE_DAY,
        description: `${name} Lambda`,
      });

    const createUserFn = createLambda("createUser");
    const getUserFn = createLambda("getUser");
    const updateUserFn = createLambda("updateUser");
    const deleteUserFn = createLambda("deleteUser");
    const getAllUsersFn = createLambda("getAllUsers");

    [
      createUserFn,
      getUserFn,
      updateUserFn,
      deleteUserFn,
      getAllUsersFn,
    ].forEach((fn) => usersTable.grantReadWriteData(fn));

    const api = new apigateway.RestApi(this, "UsersApi", {
      restApiName: "Users Service",
      defaultCorsPreflightOptions: {
        allowOrigins: [
          "https://distinction-dev-task.vercel.app",
          "http://localhost:3000",
        ],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["*"],
      },
    });

    const users = api.root.addResource("users");
    users.addMethod("POST", new apigateway.LambdaIntegration(createUserFn));
    users.addMethod("GET", new apigateway.LambdaIntegration(getAllUsersFn));

    const userById = users.addResource("{id}");
    userById.addMethod("GET", new apigateway.LambdaIntegration(getUserFn));
    userById.addMethod("PUT", new apigateway.LambdaIntegration(updateUserFn));
    userById.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteUserFn)
    );

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "Base URL for the Users API",
    });
  }
}
