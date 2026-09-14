import { Request, Response } from 'express';
import { ListProductService } from '../../services/product/ListProductService';

class ListProductController {
    async handle(request: Request, response: Response) {
        const disableQuery = request.query.disable;

        const disabled = disableQuery === 'true';

        const listProductService = new ListProductService();
        const products = await listProductService.execute(
            { disabled: disabled }
        );

        return response.json(products);
    }
}

export { ListProductController }; 
