import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const randomEmail = Math.random().toString(36).substring(7);
describe("Signup", () => {
    it("should signup", async () => {
        const signup = await prisma.user.create({
            data: {
                email: randomEmail + "@b.com",
                password: "test",
                role: "USER"
            }
        });
        expect(signup).toBeDefined();
    });
});
describe("Login", () => {
    it("should login", async () => {
        const createUser = await prisma.user.create({
            data: {
                email: randomEmail + "@a.com",
                password: "test",
                role: "USER"
            }
        });
        const login = await prisma.user.findUnique({
            where: { email: createUser.email }
        });
        expect(login).toBeDefined();
    });
});
// CATEGORY CRUD TESTS
describe("Category", () => {
    it("should get fetch all category", async () => {
        const categories = await prisma.category.findMany();
        expect(categories).toBeDefined();
    });
});
describe("createCategory", () => {
    it("should create a category", async () => {
        const category = await prisma.category.create({
            data: {
                name: "test",
                description: "test"
            }
        });
        expect(category).toBeDefined();
    });
});
describe("updateCategory", () => {
    it("should update a category", async () => {
        const createdCategory = await prisma.category.create({
            data: {
                name: "test",
                description: "test"
            }
        });
        const updatedCategory = await prisma.category.update({
            where: {
                id: createdCategory.id
            },
            data: {
                name: "test2",
                description: "test2"
            }
        });
        expect(updatedCategory).toBeDefined();
    });
});
describe("deleteCategory", () => {
    it("should delete a category", async () => {
        const createdCategory = await prisma.category.create({
            data: {
                name: "test",
                description: "test"
            }
        });
        const deletedCategory = await prisma.category.delete({
            where: {
                id: createdCategory.id
            }
        });
        expect(deletedCategory).toBeDefined();
    });
});
// PRODUCT CRUD TESTS
describe("Product", () => {
    it("should get fetch all product", async () => {
        const products = await prisma.product.findMany();
        expect(products).toBeDefined();
    });
});
describe("createProduct", () => {
    it("should create a product", async () => {
        const product = await prisma.product.create({
            data: {
                name: "test",
                price: 10
            }
        });
        expect(product).toBeDefined();
    });
});
describe("updateProduct", () => {
    it("should update a product", async () => {
        const createdProduct = await prisma.product.create({
            data: {
                name: "test",
                price: 10
            }
        });
        const updatedProduct = await prisma.product.update({
            where: {
                id: createdProduct.id
            },
            data: {
                name: "test2",
                price: 20
            }
        });
        expect(updatedProduct).toBeDefined();
    });
});
describe("deleteProduct", () => {
    it("should delete a product", async () => {
        const createdProduct = await prisma.product.create({
            data: {
                name: "test",
                price: 10
            }
        });
        const deletedProduct = await prisma.product.delete({
            where: {
                id: createdProduct.id
            }
        });
        expect(deletedProduct).toBeDefined();
    });
});
