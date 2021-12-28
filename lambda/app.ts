import { DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { COUNT_TABLE } from "./consts";

const docClient = new DynamoDB.DocumentClient();

export const handler = async (
    event: DynamoDBStreamEvent
): Promise<any> => {
    const tableName = retrieveTableName(event.Records[0].eventSourceARN);
    const eventName = event.Records[0].eventName;

    let change = 0;
    if (eventName === "INSERT") {
        change = 1;
    }
    if (eventName == "REMOVE") {
        change = -1;
    }
    if (change === 0)
        return "no change";

    const res = await docClient.update({
        TableName: COUNT_TABLE.name,
        Key: {
            [COUNT_TABLE.idColumn]: tableName,
        },
        UpdateExpression: `set ${COUNT_TABLE.countColumn} = ${COUNT_TABLE.countColumn} + :val`,
        ExpressionAttributeValues: {
            ":val": change
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();
    return res.Attributes || "no result"

}

export function retrieveTableName(arn?: string): string {
    if (!arn) throw new Error("Missing arn")
    const tableName = arn.split("/")[1];
    if (!tableName) throw new Error(`Missing table name in ${arn}`)
    return tableName;
}
