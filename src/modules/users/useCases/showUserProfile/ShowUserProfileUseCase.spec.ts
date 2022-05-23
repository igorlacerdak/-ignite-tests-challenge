import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

const user = {
    name: "User test",
    email: "igorlacerdasantos@hotmail.com",
    password: "123456"
}

describe("Show user", () =>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to find a user by id", async () => {
    const createdUser = await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
    });
    const newUserID = !createdUser.id ? 'Error' : createdUser.id

    const foundUser = await showUserProfileUseCase.execute(newUserID)

    expect(foundUser).toHaveProperty("id", newUserID)

  })

  it("Shouldn't be able to find a user if it dosen't exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('undefinedId')
    }).rejects.toBeInstanceOf(AppError)
  })
})