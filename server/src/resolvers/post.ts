import { Post } from "../entities/Post";
import { AppContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  /*
   * get all posts
   */
  @Query(() => [Post])
  getPosts(@Ctx() { em }: AppContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  /*
   * get one post by id
   */
  @Query(() => Post, { nullable: true })
  getPost(@Arg("id", () => Int) id: number, @Ctx() { em }: AppContext): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  /*
   * create post
   */
  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string, @Ctx() { em }: AppContext): Promise<Post> {
    const post = em.create(Post, { title });

    await em.persistAndFlush(post);

    return post;
  }

  /*
   * update post
   */
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: AppContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }

    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  /*
   * delete post
   */
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number, @Ctx() { em }: AppContext): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
    } catch {
      return false;
    }

    return true;
  }
}
