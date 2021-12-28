import { retrieveTableName } from '../lambda/app';
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('toRow function', () => {
  it('should return expected row data', () => {
    const result = retrieveTableName("arn:aws:dynamodb:eu-west-1:301090941374:table/sample/stream/2021-11-23T11:16:38.739");
    expect(result).to.eql("sample");
  });
});