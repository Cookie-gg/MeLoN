import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SentenceInput, SentenceObject } from './sentence.model';
import { SentenceService } from './sentence.service';

@Resolver()
export class SentenceResolver {
  constructor(private readonly sentenceService: SentenceService) {}

  @Mutation(() => SentenceObject)
  async addSentence(@Args('args') args: SentenceInput) {
    return this.sentenceService.create(args);
  }

  @Query(() => [SentenceObject])
  async findSentence(@Args('page') page: string) {
    return this.sentenceService.find(page);
  }

  @Mutation(() => SentenceObject)
  async updateSentence(@Args('args') args: SentenceInput) {
    return this.sentenceService.update(args);
  }
}
