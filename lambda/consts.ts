interface TableMeta {
    name: string;
    idColumn: string;
}
interface CountTableMeta extends TableMeta {
    countColumn: string;
}
export const MAIN_TABLE: TableMeta = {
    name: 'sample',
    idColumn: 'id'
};
export const COUNT_TABLE: CountTableMeta = {
    name: 'count_keeper',
    idColumn: 'table_name',
    countColumn: 'table_count',
};
export const DLA_NAME = MAIN_TABLE.name+'-dlq'
export const LAMBDA_NAME = 'DynamoDBCounter'