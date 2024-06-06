import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";



(async()=>{
    MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await main();

    MongoDatabase.disconnect();
})();

const randomBetweenZeroAndX = (x:number) => {
    return Math.floor(Math.random() * x);
}


async function main() {

    // delete documents
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ]);

    // create users
    const users = await UserModel.insertMany(seedData.users);

    // create categories
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category=>{
            return {
                ...category,
                user: users[0]._id
            }
        })
    );

    // create products
    const products = await ProductModel.insertMany(
        seedData.products.map(product=>{
            return {
                ...product,
                user: users[randomBetweenZeroAndX(seedData.users.length-1)]._id,
                category: categories[randomBetweenZeroAndX(seedData.categories.length-1)]._id
            }
        })
    )

    console.log('SEEDED');
    
}
