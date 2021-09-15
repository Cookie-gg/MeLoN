import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ListInput, ListObject } from './list.model';
import { ListService } from './list.service';

@Resolver()
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  @Mutation(() => ListObject)
  async addList(@Args('args') args: ListInput) {
    return this.listService.create(args);
  }

  @Query(() => ListObject)
  async findList(@Args('name') name: string, @Args('section') section: string) {
    return this.listService.find(name, section);
  }

  @Query(() => [ListObject])
  async findListBySection(@Args('section') section: string) {
    return this.listService.findBySection(section);
  }

  @Mutation(() => ListObject)
  async updateList(@Args('args') args: ListInput) {
    return this.listService.update(args);
  }
}
