import { Injectable, Inject } from '@nestjs/common';
import { ObjectCategoryEntity } from './entities/object-category.entity';
import { ObjectCategoryDto } from './dto/object-category.dto';
import { Op } from 'sequelize';

type ObjectCategory = {
  name: string;
  url: string;
  parentId: number;
};

type ObjectCategoryTreeItem = ObjectCategoryDto & {
  children?: ObjectCategoryTreeItem[];
};

@Injectable()
export class ObjectsCategoriesService {
  constructor(
    @Inject('OBJECTS_CATEGORIES_REPOSITORY')
    private readonly categoriesRepository: typeof ObjectCategoryEntity,
  ) {}

  async add(category: ObjectCategory): Promise<ObjectCategoryEntity> {
    const item = await this.categoriesRepository.create({
      name: category.name,
      url: category.url,
      parent_id: (category.parentId > 0 && category.parentId) || null,
    });
    return item;
  }

  async update(
    id: number,
    category: Partial<ObjectCategory>,
  ): Promise<ObjectCategoryEntity | null> {
    const result = await this.categoriesRepository.update(
      {
        name: category.name,
        url: category.url,
        parent_id: category.parentId,
      },
      {
        where: { id },
      },
    );
    if (result.length && result[0] > 0) {
      return this.findOneById(id);
    }

    return null;
  }

  async findOneByUrl(url: string): Promise<ObjectCategoryEntity | null> {
    if (!url) {
      return null;
    }
    const item = await this.categoriesRepository.findOne({
      where: { url },
    });

    return item;
  }

  async findOneById(id: number): Promise<ObjectCategoryEntity | null> {
    if (!id) {
      return null;
    }
    const item = await this.categoriesRepository.findOne({
      where: { id },
    });

    return item;
  }

  public async fetchAll(depth: number): Promise<ObjectCategoryTreeItem[]> {
    const parents = await this.categoriesRepository.findAll({
      where: { parent_id: { [Op.is]: null } },
    });
    depth = depth < 0 ? Number.MAX_SAFE_INTEGER : depth;
    const result: ObjectCategoryDto[] = parents.map((item) =>
      this.toTreeItem(item),
    );
    if (depth > 0) {
      const promises: Promise<any>[] = [];
      for (let i = 0; i < parents.length; i++) {
        result.push();
        promises.push(this.fetchTreeBranch(result[i], depth - 1));
      }
      await Promise.all(promises);
    }

    return result;
  }

  public async fetchTree(
    parentCategoryId: number,
    depth: number,
  ): Promise<ObjectCategoryTreeItem> {
    depth = depth < 0 ? Number.MAX_SAFE_INTEGER : depth;
    const parent = await this.categoriesRepository.findOne({
      where: { id: parentCategoryId },
    });
    if (!parent) {
      return null;
    }
    const root = this.toTreeItem(parent);
    if (depth > 0) {
      await this.fetchTreeBranch(root, depth - 1);
    }

    return root;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.destroy({
      where: { id },
    });
    return result > 0;
  }

  async getPath(id: number): Promise<number[]> {
    const path = await this.findParent(id);
    path.unshift(id);
    return path.reverse();
  }

  async findParent(childId): Promise<number[]> {
    const child = await this.categoriesRepository.findByPk(childId);
    const result = [];
    if (child && child.parent_id) {
      result.push(child.parent_id);
      const way = await this.findParent(child.parent_id);
      result.push(...way);
    }
    return result;
  }

  private async fetchTreeBranch(
    category: ObjectCategoryTreeItem,
    depth: number,
  ): Promise<ObjectCategoryTreeItem> {
    const children = await this.categoriesRepository.findAll({
      where: {
        parent_id: category.id,
      },
    });
    category.children.push(...children.map((item) => this.toTreeItem(item)));
    if (category.children.length && depth > 0) {
      const promises = [];
      for (let i = 0; i < category.children.length; i++) {
        promises.push(this.fetchTreeBranch(category.children[i], depth - 1));
      }
      await Promise.all(promises);
    }

    return category;
  }

  toTreeItem(entity: ObjectCategoryEntity): ObjectCategoryTreeItem {
    return {
      id: entity.id,
      name: entity.name,
      url: entity.url,
      parentId: entity.parent_id,
      children: [],
    };
  }
}
