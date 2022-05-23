import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

const user = {
    name: "User test",
    email: "igorlacerdasantos@hotmail.com",
    password: "123456"
}

describe("Autheticantion Session", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("Should be able to authenticate a user!", async () =>{   
        await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        const token = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(token).toHaveProperty("token")
    })

    it("Shuldn't be able to authenticate an user if the password is incorrect", async () => {
        await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        expect(async () => {
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "123"
            })
        }).rejects.toBeInstanceOf(AppError)

    })
})