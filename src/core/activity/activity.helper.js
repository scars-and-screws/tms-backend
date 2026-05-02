// ! ACTIVITY HELPER - Utility functions for building activity metadata
export const buildChanges = (oldData, newData) => {
  const changes = {};

  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        before: oldData[key],
        after: newData[key],
      };
    }
  }

  return changes;
};
