#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApproximateDynamodbCountStack } from '../lib/approximate-dynamodb-count-stack';

const app = new cdk.App();
new ApproximateDynamodbCountStack(app, 'ApproximateDynamodbCountStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
