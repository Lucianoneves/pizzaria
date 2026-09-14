import { Request, Response } from 'express';
import { ListByCategoryService } from '../../services/product/ListByCategoryService';

class ListByCategoryController {
    async handle(request: Request, response: Response) {
        const category_id = request.query.category_id as string;

        const listByCategoryService = new ListByCategoryService();
        const products = await listByCategoryService.execute({ category_id });

        return response.json(products);
    }
}

export { ListByCategoryController };
