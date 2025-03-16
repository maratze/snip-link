import { defineEventHandler, getRouterParams, H3Event, sendRedirect, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recordClick(linkId: string, event: H3Event) {
    const ipAddress = event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress || null;
    const referrer = event.node.req.headers['referrer'] || event.node.req.headers.referer || null;
    const userAgent = event.node.req.headers['user-agent'] || null;

    try {
        await prisma.click.create({
            data: {
                linkId,
                ipAddress: ipAddress as string | null,
                referrer: referrer as string | null,
                userAgent,
            },
        });

        // Increment click count on the link
        await prisma.link.update({
            where: { id: linkId },
            data: { clickCount: { increment: 1 } },
        });

    } catch (error) {
        console.error('Failed to record click:', error);
        // Do not throw an error, as recording clicks is not critical
    }
}

export default defineEventHandler(async (event) => {
    const { shortUrl } = getRouterParams(event);

    const link = await prisma.link.findUnique({
        where: {
            shortUrl,
        },
    });

    if (!link) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Link not found',
        });
    }

    // Record the click asynchronously
    await recordClick(link.id, event);

    // Redirect to the original URL
    const redirectURL = link.customDomain ? `https://${link.customDomain}/${link.shortUrl}` : link.originalUrl;
    return sendRedirect(event, redirectURL, 302);
});