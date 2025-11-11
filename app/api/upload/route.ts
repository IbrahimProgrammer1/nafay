import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '../../../lib/auth.server';

export const dynamic = 'force-dynamic';

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  // 1. === Authentication and Authorization ===
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // 2. === Input Validation ===
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided.' },
        { status: 400 } // Bad Request
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        return NextResponse.json(
            { success: false, error: 'Invalid file type. Only images are allowed.' },
            { status: 400 }
        );
    }

    // Check file size (e.g., 5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
            { success: false, error: 'File size exceeds the 5MB limit.' },
            { status: 400 }
        );
    }

    // 3. === File Processing and Upload ===
    // Convert file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to a base64 data URI for uploading
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'nafay_laptops', // Organizes uploads in a specific folder
      transformation: [
        { width: 1000, height: 1000, crop: 'limit', quality: 'auto' },
      ],
    });

    // 4. === Success Response ===
    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully!',
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 201 } // Created
    );
  } catch (error) {
    // 5. === Error Handling ===
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong during the upload.' },
      { status: 500 } // Internal Server Error
    );
  }
}