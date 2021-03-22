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

  public async findUserActivity(id: number): Promise<ActivityDataType[]> {
    return await this.activityRepository
      .createQueryBuilder("activity")
      .where("user.id = :id", { id: id })
      .orderBy("created_at", "ASC")
      .getMany();
  }
}
