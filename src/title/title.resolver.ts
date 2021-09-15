import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TitleObject, TitleInput } from './title.model';
import { TitleService } from './title.service';

@Resolver()
export class TitleResolver {
  constructor(private readonly titleService: TitleService) {}

  @Mutation(() => TitleObject)
  async addTitle(@Args('args') args: TitleInput) {
    return this.titleService.create(args);
  }

  @Query(() => [TitleObject])
  async findTitle(@Args('page') page: string) {
    return this.titleService.find(page);
  }

  @Mutation(() => TitleObject)
  async updateTitle(@Args('args') args: TitleInput) {
    return this.titleService.update(args);
  }
}
