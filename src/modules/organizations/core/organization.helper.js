export const sanitizeOrganization = organization => {
  return {
    id: organization.id,
    name: organization.name,
    description: organization.description,
    logoUrl: organization.logoUrl,
    ownerId: organization.ownerId,
    createdAt: organization.createdAt,
  };
};

export const buildOrganizationResponse = (organization, role) => {
  return {
    id: organization.id,
    name: organization.name,
    description: organization.description,
    logoUrl: organization.logoUrl,
    role,
    createdAt: organization.createdAt,
  };
};

export const mapOrganizationList = memberships => {
  return memberships.map(membership => ({
    id: membership.organization.id,
    name: membership.organization.name,
    logoUrl: membership.organization.logoUrl,
    role: membership.role,
    createdAt: membership.organization.createdAt,
  }));
};
