import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PathInput, PathObject } from './path.model';
import { PathService } from './path.service';

@Resolver()
export class PathResolver {
  constructor(private readonly pathService: PathService) {}

  @Mutation(() => PathObject)
  async addPath(@Args('args') args: PathInput) {
    return this.pathService.create(args);
  }

  @Query(() => PathObject)
  async findPath(@Args('name') name: string) {
    return this.pathService.find(name);
  }

  @Query(() => [PathObject])
  async findAllPaths() {
    return this.pathService.findAll();
  }

  @Query(() => PathObject)
  async findPathByOrder(@Args('order') order: number) {
    return this.pathService.findByOrder(order);
  }

  @Mutation(() => PathObject)
  async update(@Args('name') name: string, @Args('args') args: PathInput) {
    return this.pathService.update(name, args);
  }
}
