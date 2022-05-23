import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

const user = {
    name: "User test",
    email: "igorlacerdasantos@hotmail.com",
    password: "123456"
}

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("should be create a new user!", async () => {
        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        expect(createdUser).toHaveProperty("id")
    })


    it("Shouldn't be able to crate a user with a already exists e-mail", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            })

            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password
            })

        }).rejects.toBeInstanceOf(AppError)

    })

})