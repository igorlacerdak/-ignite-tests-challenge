import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

const user = {
    name: "User test",
    email: "igorlacerdasantos@hotmail.com",
    password: "123456"
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Deposit and Withdraw", () => {

 beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })


    it("Should be able to create a statement", async () => {
        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        const statement = await createStatementUseCase.execute({
            user_id: !createdUser.id ? 'Error' : createdUser.id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "test"
        })

        expect(statement).toHaveProperty("id")
    })

    it("Shouldn't be able to create a statement with withdraw type if the user balance didn't have the needed amount", async () => {
        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })
    
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: !createdUser.id ? 'Error' : createdUser.id,
                type: OperationType.DEPOSIT,
                amount: 100,
                description: "test"
            })

            await createStatementUseCase.execute({
                user_id: !createdUser.id ? 'Error' : createdUser.id,
                type: OperationType.WITHDRAW,
                amount: 200,
                description: "test"
            })
        }).rejects.toBeInstanceOf(AppError)
    })
})