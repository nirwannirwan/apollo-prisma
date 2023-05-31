import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { createContext } from "./db.js";
import { APP_SECRET, getUser } from "./utils.js";
const { hash } = bcryptjs;
const { sign } = jsonwebtoken;
const typeDefs = gql `
  type AuthPayload {
    token: String
    user: User
  }
  enum Role {
    ADMIN
    USER
  }
  type User {
    id: String
    email: String
    role: Role
  }
  type Category {
    id: String
    name: String
    description: String
    products: [Product]
  }
  type Product {
    id: String
    name: String
    price: Int
    category: [Category]
  }

  type Query {
    me: User
    categories: [Category]
    products: [Product]
  }

  type Mutation {
    signUp(email: String, password: String, role: Role): AuthPayload
    login(email: String, password: String): AuthPayload
    createCategory(name: String, description: String): Category
    updateCategory(id: String, name: String, description: String): Category
    deleteCategory(id: String): Category
    createProduct(name: String, price: Int, category: String): Product
    updateProduct(id: String, name: String, price: Int): Product
    deleteProduct(id: String): Product
  }
`;
const resolvers = {
    Mutation: {
        signUp: async (_parent, args, context) => {
            const hashedPassword = await hash(args.password, 10);
            const user = await context.prisma.user.create({
                data: {
                    email: args.email,
                    password: hashedPassword,
                    role: args.role
                }
            });
            return {
                token: sign({ userId: user.id, role: user.role }, APP_SECRET),
                user
            };
        },
        login: async (_parent, args, context) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email }
            });
            if (!user) {
                throw new Error("No such user found for email: " + args.email);
            }
            const valid = await bcryptjs.compare(args.password, user.password);
            if (!valid) {
                throw new Error("Invalid password");
            }
            return {
                token: sign({ userId: user.id, role: user.role }, APP_SECRET),
                user
            };
        },
        createCategory: async (_parent, args, context) => {
            const role = getUser(context).role;
            if (role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            const category = await context.prisma.category.create({
                data: {
                    name: args.name,
                    description: args.description
                }
            });
            return category;
        },
        updateCategory: async (_parent, args, context) => {
            const category = await context.prisma.category.update({
                where: {
                    id: args.id
                },
                data: {
                    name: args.name,
                    description: args.description
                }
            });
            return category;
        },
        deleteCategory: async (_parent, args, context) => {
            const role = getUser(context).role;
            if (role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            await context.prisma.category.delete({
                where: {
                    id: args.id
                }
            });
            return null;
        },
        createProduct: async (_parent, args, context) => {
            const role = getUser(context).role;
            if (role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            const product = await context.prisma.product.create({
                data: {
                    name: args.name,
                    price: args.price,
                    category: {
                        connect: {
                            id: args.category
                        }
                    }
                }
            });
            return product;
        },
        updateProduct: async (_parent, args, context) => {
            const role = getUser(context).role;
            if (role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            const product = await context.prisma.product.update({
                where: {
                    id: args.id
                },
                data: {
                    name: args.name,
                    price: args.price
                }
            });
            return product;
        },
        deleteProduct: async (_parent, args, context) => {
            const role = getUser(context).role;
            if (role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            await context.prisma.product.delete({
                where: {
                    id: args.id
                }
            });
            return null;
        }
    },
    Query: {
        me: async (_parent, _args, context) => {
            const userId = getUser(context).userId;
            console.log(userId);
            const user = await context.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            console.log(user);
            return user;
        },
        categories: async (_parent, _args, context) => {
            const category = await context.prisma.category.findMany({
                include: {
                    products: true
                }
            });
            return category;
        },
        products: async (_parent, _args, context) => {
            const product = await context.prisma.product.findMany({
                include: {
                    category: true
                }
            });
            return product;
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => createContext(req),
    listen: { port: 4000 }
});
console.log("Server is ready at " + url);
