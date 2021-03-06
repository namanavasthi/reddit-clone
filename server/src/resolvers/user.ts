import { User } from "../entities/User";
import { AppContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";

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
   * return the current user, if not logged in return null
   */
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: AppContext): Promise<User | null> {
    // if no userid is present then they are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  /*
   * register a user
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em, req }: AppContext
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
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const hashPassword = await argon2.hash(options.password);
    let user;

    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({ username: options.username, password: hashPassword, created_at: new Date(), updated_at: new Date() })
        .returning("*");

      user = result[0];
      // await em.persistAndFlush(user);
    } catch (err) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    /*
     * store userid session
     * this will set a cookie on the user browser
     * and keep them logged in
     */
    req.session.userId = user.id;

    return { user };
  }

  /*
   * login a user
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UserNamePasswordInput) options: UserNamePasswordInput,
    @Ctx() { em, req }: AppContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "invalid login details",
          },
          {
            field: "password",
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
            field: "username",
            message: "invalid login details",
          },
          {
            field: "password",
            message: "invalid login details",
          },
        ],
      };
    }

    /*
     * session object coming from redis-connect
     * we can store anything we want inside this object
     */
    req.session.userId = user.id;

    return {
      user,
    };
  }

  /*
   * logout a user
   */
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: AppContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log("LOGOUT ERROR: ", err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
