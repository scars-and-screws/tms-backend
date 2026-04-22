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

// ! FIND PROJECT BY ID FOR MIDDLEWARE (SELECTING ONLY FIELDS NEEDED FOR ACCESS CHECKS)
export const findProjectByIdMinimal = async projectId => {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, isArchived: true },
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
  includeArchived = false,
  onlyArchived = false,
}) => {
  let where = { organizationId };

  if (onlyArchived) {
    where.isArchived = true;
  } else if (!includeArchived) {
    where.isArchived = false;
  }
  // Default is to include all projects regardless of archive status (no filter on isArchived)

  // logging the filter being applied for debugging
  console.log("Project filter:", where);

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
