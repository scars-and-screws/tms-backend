import prisma from "../../../core/database/prisma.js";

// ! CREATE PROJECT
export const createProject = async data => {
  return prisma.project.create({
    data,
  });
};

// ! GET PROJECT BY ID
export const findProjectById = async projectId => {
  return prisma.project.findUnique({
    where: { id: projectId },
  });
};

// ! CHECK FOR DUPLICATE PROJECT NAME WITHIN SAME ORG
export const findProjectByNameAndOrg = async (name, organizationId) => {
  return prisma.project.findFirst({
    where: { name, organizationId },
  });
};

// ! GET PROJECT WITH MEMBERS (for project access checks)
export const findProjectWithMembers = async projectId => {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
};

// ! LIST PROJECTS WITH OPTIONAL ARCHIVED FILTER
export const findProjectsByOrganization = async ({
  organizationId,
  inclueArchived = false,
  onlyArchived = false,
}) => {
  let where = { organizationId };

  if (onlyArchived) {
    where.isArchived = true;
  } else if (!inclueArchived) {
    where.isArchived = false;
  }
  return prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

// ! UPDATE PROJECT
export const updateProjectById = async (projectId, data) => {
  return prisma.project.update({
    where: { id: projectId },
    data,
  });
};

// ! SET PROJECT ARCHIVE STATUS
export const setProjectArchiveStatus = async (projectId, isArchived) => {
  return prisma.project.update({
    where: { id: projectId },
    data: { isArchived },
  });
};

// ! DELETE PROJECT
export const deleteProjectById = async projectId => {
  return prisma.project.delete({
    where: { id: projectId },
  });
};
