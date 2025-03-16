import { defineEventHandler, readBody, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import { URL } from 'url';
import { shortenUrl } from '../../services/linkService';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { originalUrl, customAlias, customDomain } = body; // Add customDomain
    const userId = event.context.userId; // Access userId from context

    if (!originalUrl) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing originalUrl',
        });
    }

    try {
        // Validate URL format
        new URL(originalUrl);
    } catch (error) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid originalUrl format',
        });
    }

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    try {
        const shortUrl = await shortenUrl(originalUrl, customAlias);

        const link = await prisma.link.create({
            data: {
                userId,
                originalUrl,
                shortUrl,
                customAlias,
                customDomain, // Save customDomain
            },
        });

        logger.info(`Link created: ${link.id}`); // Log the link creation

        return {
            id: link.id,
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
            customAlias: link.customAlias,
            customDomain: link.customDomain,
        };
    } catch (error: any) {
        logger.error(`Error creating link: ${error.message}`); // Log the error
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Something went wrong',
        });
    }
});