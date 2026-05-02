// Extract @mentions from content
export const extractMentions = content => {
  const matches = content.match(/@(\w+)/g); // Match @ followed by word characters
  return matches ? matches.map(m => m.slice(1)) : [];
};
