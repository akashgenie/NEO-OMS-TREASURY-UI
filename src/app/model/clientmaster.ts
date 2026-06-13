export interface Clientmaster {
  Id: number;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  Pan?: string;
  Dob?: Date;
  TypeId?: string;
  IsActive?: string;
  CreatedBy?: string;
  CreatedByRoleId?: number;
  CreatedOn?: Date;
  ModifiedBy?: string;
  ModifiedByRoleId?: number;
  ModifiedOn?: Date;
}
