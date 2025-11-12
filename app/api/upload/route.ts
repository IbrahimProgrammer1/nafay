import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '../../../lib/auth.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
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

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
        return NextResponse.json(
            { success: false, error: 'Invalid file type. Only images are allowed.' },
            { status: 400 }
        );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
            { success: false, error: 'File size exceeds the 5MB limit.' },
            { status: 400 }
        );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'nafay_laptops',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit', quality: 'auto' },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully!',
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong during the upload.' },
      { status: 500 }
    );
  }
}