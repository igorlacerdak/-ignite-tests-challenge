import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

const user = {
    name: "User test",
    email: "igorlacerdasantos@hotmail.com",
    password: "123456"
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
      })

    
    it("Should be able to find a user balance", async () => {
        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })

        const user_id = !createdUser.id ? "Error" : createdUser.id

        const statement = await createStatementUseCase.execute({
            user_id: user_id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test get balance"
        })

        const { balance } = await getBalanceUseCase.execute({ user_id })

        expect(balance).toBe(statement.amount);
    })

    it("Shouldn't be able to find a user balance if user dosen't exists", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: 'error'})
        }).rejects.toBeInstanceOf(AppError)
    })

})