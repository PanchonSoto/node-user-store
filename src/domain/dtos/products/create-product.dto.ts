import { Validators } from "../../../config";



export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: string,
        public readonly description: string,
        public readonly user: string, //id
        public readonly category: string, //id
    ){}

    static create(props: {[key:string]:any}): [string?, CreateProductDto?] {

        const { name, available, price, description, user, category } = props;
        if(!name) return [`Missing product 'name' property`];
        if(!user) return [`Missing user 'property' (ID)`];
        if(!Validators.isMongoID(user)) return [`Invalid 'user' property (ID)`];
        if(!category) return [`Missing 'category' property (ID)`];
        if(!Validators.isMongoID(category)) return [`Invalid 'category' property (ID)`];

        return [
            undefined,
            new CreateProductDto(
                name,
                !!available,
                price,
                description,
                user,
                category,                
            ) 
        ];

    }

}
