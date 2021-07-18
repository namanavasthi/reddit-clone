import { User } from "../entities/User";
import { AppContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UserNamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  /*
   * get all posts
   */
  //   @Query(() => [Post])
  //   getPosts(@Ctx() { em }: AppContext): Promise<Post[]> {
  //     return em.find(Post, {});
  //   }

  /*
   * register a user
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em }: AppContext
  ): Promise<UserResponse> {
    // check for username, in future this could be its own functional check
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    // check for password, in future this could be its own functional check
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 3",
          },
        ],
      };
    }

    const hashPassword = await argon2.hash(options.password);
    const user = em.create(User, { username: options.username, password: hashPassword });

    await em.persistAndFlush(user);

    return { user };
  }

  /*
   * login a user
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em }: AppContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username or password",
            message: "invalid login details",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "username or password",
            message: "invalid login details",
          },
        ],
      };
    }

    return {
      user,
    };
  }
}
