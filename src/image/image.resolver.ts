import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageInput, ImageObject } from './image.model';
import { ImageService } from './image.service';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => ImageObject)
  async addImage(@Args('args') args: ImageInput) {
    return this.imageService.create(args);
  }

  @Query(() => ImageObject)
  async findImage(@Args('name') name: string) {
    return this.imageService.find(name);
  }

  @Mutation(() => ImageObject)
  async updateImage(@Args('args') args: ImageInput) {
    return this.imageService.update(args);
  }
}
