const MutationGenerator = require('../generators/mutationGenerator');
const {
  storeIndexedColumns,
  getPrimaryKeyType,
} = require('../helpers/helperFunctions');

// Outputs entire mutation object as a string
function generateMutations(data) {
  const allMutations = [];
  const tables = Object.keys(data);
  for (const tableName of tables) {
    const { primaryKey, columns } = data[tableName];
    const valueObj = storeIndexedColumns(columns, primaryKey);
    const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
    // necessary to skip columns with only primary and foreign keys?
    allMutations.push(createMutation(tableName, valueObj, columns));
    allMutations.push(updateMutation(tableName, valueObj, primaryKey));
    allMutations.push(deleteMutation(tableName, primaryKey, primaryKeyType));
  }
  return allMutations;
}

function createMutation(tableName, values, columns) {
  const createMutations = [];
  const mutationStr = MutationGenerator.createColumn(
    tableName,
    values,
    columns
  );
  createMutations.push(mutationStr);
  return createMutations;
}

function updateMutation(tableName, values, primaryKey) {
  const updateMutations = [];
  const mutationStr = MutationGenerator.updateColumn(
    tableName,
    values,
    primaryKey
  );
  updateMutations.push(mutationStr);
  return updateMutations;
}

function deleteMutation(tableName, primaryKey, primaryKeyType) {
  const deleteMutations = [];
  const mutationStr = MutationGenerator.destroyColumn(
    tableName,
    primaryKey,
    primaryKeyType
  );
  deleteMutations.push(mutationStr);
  return deleteMutations;
}

function assembleMutations(mutations) {
  let mutString = '';
  for (let i = 0; i < mutations.length; i++) {
    mutString += `${mutations[i]}\n`;
  }
  return mutString;
}

function formatMutations(mutations) {
  return (
    `const Mutation = new GraphQL ObjectType({` +
    `  name: 'Mutation',` +
    `  fields: {` +
    `    ${mutations}` +
    `  },` +
    `});`
  );
}

module.exports = {
  generateMutations,
  createMutation,
  updateMutation,
  deleteMutation,
  assembleMutations,
  formatMutations,
};
