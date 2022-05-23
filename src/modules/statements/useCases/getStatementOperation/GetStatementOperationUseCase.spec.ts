import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

const user = {
    name: "User test",
    email: "igorlacerdasantos@hotmail.com",
    password: "123456"
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it("Should be able to find a user statment", async () => {
        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })
    
        const user_id = !createdUser.id ? 'Error' : createdUser.id
    
        const statement = await createStatementUseCase.execute({
          user_id: user_id,
          type: OperationType.DEPOSIT,
          amount: 100,
          description: "test"
        });
    
        const statement_id = !statement.id ? 'Error' : statement.id
    
        const response = await getStatementOperationUseCase.execute({ user_id, statement_id })
    
        expect(response).toBe(statement)
      });

      it("Shouldn't be able to find a nonexistent statment", async() => {

        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password
        })
    
        const user_id = !createdUser.id ? 'Error' : createdUser.id
    
        expect(async () => {
          await getStatementOperationUseCase.execute({
              user_id,
              statement_id : 'statement'
            })
        }).rejects.toBeInstanceOf(AppError);
      })
    
})