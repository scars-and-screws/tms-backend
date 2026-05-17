// ! ACTIVITY HELPER - Utility functions for building activity metadata
export const buildChanges = (oldData, newData) => {
  const changes = {};

  for (const key in newData) {
    const oldValue = oldData[key];
    const newValue = newData[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = {
        before: oldValue,
        after: newValue,
      };
    }
  }

  return changes;
};
