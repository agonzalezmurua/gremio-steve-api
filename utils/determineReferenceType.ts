import mongoose from "_/services/database.configure";
import { Utils } from "_/types/mongoose_aux";

export default function determineReferenceType<T>(
  document: Utils.ReferencedDocument<T>
): "string" | "objectid" | "document" {
  if (typeof document === "string") {
    return "string";
  } else if (mongoose.Types.ObjectId.isValid(document as any)) {
    return "objectid";
  } else {
    return "document";
  }
}
