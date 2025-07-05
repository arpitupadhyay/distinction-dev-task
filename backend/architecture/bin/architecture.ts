#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ArchitectureStack } from "../lib/architecture-stack";

const app = new cdk.App();

new ArchitectureStack(app, "ArchitectureStack", {});
