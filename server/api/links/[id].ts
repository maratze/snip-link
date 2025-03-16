import { defineEventHandler, getRouterParams, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const userId = event.context.userId; // Access userId from context

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const link = await prisma.link.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!link) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Link not found',
    });
  }

  if (event.node.req.method === 'GET') {
    // Get a single link

    return link;
  } else if (event.node.req.method === 'PUT') {
    // Update a link
    const body = await readBody(event);
    const { originalUrl, customAlias, customDomain } = body; // Add customDomain

    try {
      const updatedLink = await prisma.link.update({
        where: {
          id,
          userId,
        },
        data: {
          originalUrl,
          customAlias,
          customDomain, // Update customDomain
        },
      });
      return updatedLink;
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to update link',
      });
    }

  } else if (event.node.req.method === 'DELETE') {
    // Delete a link
    try {
      await prisma.link.delete({
        where: {
          id,
          userId,
        },
      });

      return {
        message: 'Link deleted',
      };
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete link',
      });
    }

  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});