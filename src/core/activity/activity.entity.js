// ! TASK ENTITY
export const buildTaskEntity = task => ({
  id: task.id,
  type: "TASK",
  title: task.title,
});

// ! PROJECT ENTITY
export const buildProjectEntity = project => ({
  id: project.id,
  type: "PROJECT",
  title: project.name,
});

// ! ORGANIZATION ENTITY
export const buildOrganizationEntity = organization => ({
  id: organization.id,
  type: "ORGANIZATION",
  title: organization.name,
});

// ! COMMENT ENTITY
export const buildCommentEntity = comment => ({
  id: comment.id,
  type: "COMMENT",
});
