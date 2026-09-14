import { Request, Response } from 'express';
import { CreateProductService } from '../../services/product/CreateProductService';


class CreateProductController {
    async handle(request: Request, response: Response) {
        const { name, price, description, category_id, category_Id } = request.body;
        const categoryId = category_id ?? category_Id;

        if (!request.file) {
            throw new Error('A imagem do produto é obrigatória');
        }

        if (!categoryId) {
            throw new Error('A categoria é obrigatória');
        }

        const createProductService = new CreateProductService();    

        const product = await createProductService.execute({
            name,
            price: parseFloat(price),
            description,
            imageBuffer: request.file.buffer,
            category_id: categoryId,
            imageName: request.file.originalname,
        });

        return response.json(product);
    }
}

export { CreateProductController };
