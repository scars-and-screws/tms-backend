// ! SANITIZE PROJECT RESPONSE
export const sanitizeProject = project => ({
  id: project.id,

  name: project.name,

  description: project.description,

  isArchived: project.isArchived,

  organizationId: project.organizationId,

  createdById: project.createdById,

  createdAt: project.createdAt,

  updatedAt: project.updatedAt,
});

// ! SANITIZE PROJECT LIST
export const sanitizeProjectList = projects => projects.map(sanitizeProject);
