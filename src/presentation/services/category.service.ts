import { CategoryModel } from '../../data';
import { CustomError, UserEntity } from '../../domain';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';



export class CategoryService {

    constructor(){}



    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
        
        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name});
        if(categoryExists) throw CustomError.badRequest('Category already exist');

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
