import prisma from "../../../core/database/prisma.js";

// ! CREATE PROJECT
export const createProject = async data => {
  return prisma.project.create({
    data,
  });
};

// ! GET PROJECT BY ID
export const getProjectById = async projectId => {
  return prisma.project.findUnique({
    where: { id: projectId },
  });
};

// ! GET PROJECT WITH MEMBERS (for project access checks)
export const getProjectWithMembers = async projectId => {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
};

// ! LIST PROJECTS BY ORGANIZATION
export const listProjectsByOrganization = async organizationId => {
  return prisma.project.findMany({
    where: { organizationId },
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

// ! DELETE PROJECT
export const deleteProjectById = async projectId => {
  return prisma.project.delete({
    where: { id: projectId },
  });
};
