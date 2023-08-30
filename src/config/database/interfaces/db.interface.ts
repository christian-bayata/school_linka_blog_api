export interface IDatabaseConfigAttributes {
  dbUser?: string;
  dbPass?: string;
  dbName?: string;
  dbHost?: string;
  dbPort?: number | string;
  dialect?: string;
  dbUri?: string;
}

export interface IDatabaseConfig {
  development: IDatabaseConfigAttributes;
  staging: IDatabaseConfigAttributes;
}
