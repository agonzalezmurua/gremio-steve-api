import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Activity } from "./models/activity.entity";
import { ActivityDataType } from "./types/ActivityType";

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity) private activityRepository: Repository<Activity>
  ) {}

  public findUserActivity(id: number): Promise<ActivityDataType[]> {
    return this.activityRepository.find({
      where: { user: { id: id } },
      take: 50,
    });
  }

  public findManyUsersActivity(ids: number[]): Promise<ActivityDataType[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    return this.activityRepository.find({
      where: { user: { id: ids } },
      order: { updated_at: "ASC" },
    });
  }

  public async create(activity: Activity): Promise<Activity> {
    return this.activityRepository.create(activity);
  }
}
