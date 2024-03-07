export type JurisdictionType = {
  id: number;
  name: string;
  subJurisdictions?: JurisdictionType[];

};