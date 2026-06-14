import prisma from "../../../../infrastructure/database/prisma.js";

// ! CREATE MENTIONS (BULK)
export const createCommentMentions = async data => {
  return prisma.commentMention.createMany({
    data,
    skipDuplicates: true,
  });
};
