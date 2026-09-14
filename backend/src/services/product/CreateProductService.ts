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



class CreateProductService {



    async execute({ name, price, description, imageBuffer, category_id, imageName }: CreateProductServiceProps) {

        if (!category_id) {
            throw new Error('A categoria é obrigatória');
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

            const result = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "products",
                    resource_type: "image",
                    public_id: publicId,
                }, (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!result?.secure_url) {
                        reject(new Error('Cloudinary não retornou a URL da imagem'));
                        return;
                    }

                    resolve(result.secure_url);
                });

                uploadStream.end(imageBuffer);
            });





            bannerURL = result;
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : 'Erro ao fazer o upload da imagem';
            throw new Error(message);
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