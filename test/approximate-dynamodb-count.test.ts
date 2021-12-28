import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import {ApproximateDynamodbCountStack} from '../lib/approximate-dynamodb-count-stack';

test('Lambda Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new ApproximateDynamodbCountStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: "DynamoDBCounter"
  });
});
