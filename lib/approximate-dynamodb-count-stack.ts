import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { DynamoEventSource, SqsDlq } from '@aws-cdk/aws-lambda-event-sources';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sqs from '@aws-cdk/aws-sqs';
import { MAIN_TABLE, COUNT_TABLE, DLA_NAME, LAMBDA_NAME } from '../lambda/consts';
import { StreamViewType } from '@aws-cdk/aws-dynamodb';

export class ApproximateDynamodbCountStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // setup of DynamoDB
    const mainTable = new dynamodb.Table(this, MAIN_TABLE.name, {
      tableName: MAIN_TABLE.name,
      partitionKey: { name: MAIN_TABLE.idColumn, type: dynamodb.AttributeType.STRING },
      stream: StreamViewType.NEW_IMAGE,
    });
    const countTable = new dynamodb.Table(this, COUNT_TABLE.name, {
      tableName: COUNT_TABLE.name,
      partitionKey: { name: COUNT_TABLE.idColumn, type: dynamodb.AttributeType.STRING },
    });

    // dead letter queue for when messages are missed
    const deadLetterQueue = new sqs.Queue(this, DLA_NAME, {
      queueName: DLA_NAME
    });

    // setup of Lambda
    const fn = new NodejsFunction(this, LAMBDA_NAME, {
      runtime: lambda.Runtime.NODEJS_14_X,
      functionName: LAMBDA_NAME,
      entry: 'lambda/app.ts',
      handler: 'handler'
    });

    // grant rights
    countTable.grantReadWriteData(fn);
    deadLetterQueue.grantSendMessages(fn);
    mainTable.grantStreamRead(fn);

    // make the main table dynamodb stream an event source
    fn.addEventSource(new DynamoEventSource(mainTable, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      batchSize: 1, // needs to be adjusted based on the rate and size of records
      bisectBatchOnError: true,
      onFailure: new SqsDlq(deadLetterQueue),
      retryAttempts: 10,
    }));

  }
}
