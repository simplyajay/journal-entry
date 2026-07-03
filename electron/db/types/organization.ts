export type Organization = {
  id: string;
  ownerId: string;
  organizationName: string;
  createdAt: Date;
};

export type CreateOriganizationDTO = {
  organizationName: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  password: string;
};
