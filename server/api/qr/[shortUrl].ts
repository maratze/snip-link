import { defineEventHandler, getRouterParams, H3Event } from 'h3';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

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

  try {
    const qrCodeDataURL = await QRCode.toDataURL(`https://yourdomain.com/api/${shortUrl}`); // Replace yourdomain.com

    return {
      qrCode: qrCodeDataURL,
    };
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate QR code',
    });
  }
});