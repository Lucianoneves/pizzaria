import { Request, Response } from 'express';
import { CreateCategoryService } from '../../services/category/CreateCategoryService';




class CreateCategoryController {
    async handle(request: Request, response: Response) {
        const { name,price,description,category_id} = request.body;


     if(!request.file) {
        throw new Error('A imagem do produto');
     }        
       
        const createCategoryService = new CreateCategoryService();

        const category = await createCategoryService.execute({ name });

        return response.json(category);
    }
}

export { CreateCategoryController };