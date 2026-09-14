import { Request, Response } from 'express';
import { DeleteProductService } from '../../services/product/DeleteProductService';

class DeleteProductController {
    async handle(request: Request, response: Response) {
        const product_id = request.query.product_id as string;
        const disableQuery = request.query.disable;

        const disabled = disableQuery === 'false' ? false : true;

        const deleteProductService = new DeleteProductService();
        const product = await deleteProductService.execute({
            product_id,
            disabled,
        });

        return response.json(product);
    }
}

export { DeleteProductController };
