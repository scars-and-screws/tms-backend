// ! Extract usernames
export const extractMentions = content => {
  const matches = content.match(/@([a-zA-Z0-9._-]+)/g);

  return matches ? [...new Set(matches.map(m => m.slice(1)))] : [];
};
