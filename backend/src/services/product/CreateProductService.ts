import { Readable } from 'node:stream';
import prisma from '../../prisma/prisma';
import cloudinary from '../../config/cloudinary';

interface CreateProductServiceProps {
    name: string;
    price: number;
    description: string;
    imageBuffer: Buffer;
    category_id: string;
    imageName: string;
}

function getUploadErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message
    ) {
        return error.message;
    }

    return 'Erro ao fazer o upload da imagem';
}

class CreateProductService {
    async execute({
        name,
        price,
        description,
        imageBuffer,
        category_id,
        imageName,
    }: CreateProductServiceProps) {
        if (!category_id) {
            throw new Error('A categoria é obrigatória');
        }

        if (!imageBuffer?.length) {
            throw new Error('A imagem do produto é obrigatória');
        }

        const categoryExists = await prisma.category.findFirst({
            where: {
                id: category_id,
            },
        });

        if (!categoryExists) {
            throw new Error('Categoria não encontrada');
        }

        let bannerURL = '';

        try {
            const publicId = `${Date.now()}-${imageName
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9_-]/g, '_')
                .slice(0, 80)}`;

            bannerURL = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'products',
                        resource_type: 'image',
                        public_id: publicId,
                        timeout: 600000,
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        if (!result?.secure_url) {
                            reject(new Error('Cloudinary não retornou a URL da imagem'));
                            return;
                        }

                        resolve(result.secure_url);
                    },
                );

                Readable.from(imageBuffer).pipe(uploadStream);
            });
        } catch (error) {
            throw new Error(getUploadErrorMessage(error));
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                category_Id: category_id,
                banner: bannerURL,
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                category_Id: true,
                banner: true,
                createdAt: true,
            },
        });

        return product;
    }
}

export { CreateProductService };
