import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import {
  Action,
  IActivity,
  IActivityDocument,
  IActivityPayload,
  Target,
} from "_/schemas/activity";

import { IUser } from "_/schemas/user";
import { Utils } from "_/types/mongoose_aux";
import determineReferenceType from "_/utils/determineReferenceType";

import User from "./user";

@ApiModel()
export default class Activity implements IActivity {
  constructor(document: Utils.ReferencedDocument<IActivityDocument>) {
    const referenceType = determineReferenceType(document);

    if (referenceType !== "document") {
      // Object has not been populated, therefore we skip the model mapping
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return document;
    }
    const activity = <IActivityDocument>document;

    this.payload = activity.payload;
    this.read = activity.read;
    this.to = activity.to;
    this.what = activity.what;
    this.when = activity.when;
    this.who = new User(activity.who);
  }

  @ApiModelProperty()
  read: boolean;

  @ApiModelProperty()
  what: Action;

  @ApiModelProperty()
  to: Target;

  @ApiModelProperty()
  when: Date;

  @ApiModelProperty()
  who: IUser;

  @ApiModelProperty()
  payload: IActivityPayload;
}
