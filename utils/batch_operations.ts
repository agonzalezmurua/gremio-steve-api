import consola from "consola";
import * as mongoose from "mongoose";

/**
 * Removes certain attributes from the object such as:
 * - ids
 * - timestamps
 * - mongoose `__v` attribute
 * @param {import('mongoose').Model} Model
 * @param {string[]} attrs
 */
function cleanupAttributes(Model, attrs) {
  return attrs.filter((k) => {
    return (
      !["_id", "__v", "created_at", "updated_at"].includes(k) &&
      !(Model.schema.path(k) instanceof mongoose.Schema.Types.ObjectId)
    );
  });
}

/**
 * Updates ngrams for fuzzy search
 * @param {import('mongoose').Model} Model
 * @param {string[]} attrs attribute list
 */
export async function updateNgrams(Model, attrs) {
  let i = 0;
  let _attrs = cleanupAttributes(Model, attrs);
  await Model.find()
    .cursor()
    .eachAsync(async function (doc) {
      const obj = _attrs.reduce(
        (acc, attr) => ({ ...acc, [attr]: doc[attr] }),
        {}
      );
      await Model.findByIdAndUpdate(doc._id, obj);
      i++;
    });

  consola.success("updated", i, "items");
}

/**
 * Deletes ngrams of a model
 *
 * **Note**: this does not remove attributes that were removed from the schema
 * @param {import('mongoose').Model} Model
 * @param {string[]} attrs
 */
export async function deleteNgrams(Model, attrs) {
  let i = 0;
  let _attrs = cleanupAttributes(Model, attrs);
  await Model.find()
    .cursor()
    .eachAsync(async function (doc) {
      const $unset = _attrs.reduce((acc, attr) => ({ ...acc, [attr]: 1 }), {});
      await Model.findByIdAndUpdate(
        doc._id,
        { $unset },
        { new: true, strict: false }
      );
      i++;
    });
  consola.success("updated", i, "items");
}
