import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/auth';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/app/lib/rate-limit';
import { validateUserUpdate, sanitizeInput } from '@/app/lib/validation';
import { validateCsrfToken } from '@/app/lib/csrf';

// Rate limit to 5 requests per minute per IP
const limiter = rateLimit({ interval: 60, limit: 5 });

export async function PUT(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = await limiter();
  if (rateLimitResult) return rateLimitResult;

  // Verify CSRF token
  const isValidCsrf = await validateCsrfToken(req);
  if (!isValidCsrf) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 }
    );
  }
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, currentPassword, newPassword, image } = body;

    // Validate input
    const validationErrors = validateUserUpdate({
      name,
      email,
      currentPassword,
      newPassword,
      image,
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }
    const userId = session.user.id;

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (name) updateData.name = sanitizeInput(name);
    if (image) updateData.image = image; // Image is already validated
    
    // Handle email update
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    // Handle password update
    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Add last updated timestamp
    updateData.updatedAt = new Date();

    // Update user with transaction to ensure atomicity
    const updatedUser = await prisma.$transaction(async (tx: typeof prisma) => {
      // Check if email is still unique right before update
      if (updateData.email) {
        const existingUser = await tx.user.findFirst({
          where: {
            email: updateData.email,
            NOT: { id: userId },
          },
        });
        if (existingUser) {
          throw new Error('Email already in use');
        }
      }

      return await tx.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      });
    });

    // Log the update for audit purposes
    await prisma.userAuditLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATE',
        details: JSON.stringify({
          updatedFields: Object.keys(updateData),
          timestamp: new Date(),
        }),
      },
    }).catch(console.error); // Non-blocking audit log

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error updating user' },
      { status: 500 }
    );
  }
}
