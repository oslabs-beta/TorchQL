const MutationGenerator = require('../generators/mutationGenerator');

// Outputs entire mutation object as a string
function generateMutations(data) {
  const allMutations = [];
  const tables = Object.keys(data);
  for (const tableName of tables) {
    const { primaryKey, foreignKeys, columns } = data[tableName];
    // necessary to skip columns with only primary and foreign keys?
    // allMutations.push(createMutation(tableName, valueObj, columns));
    if (foreignKeys === null || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) {
      allMutations.push(createMutation(tableName, primaryKey, foreignKeys, columns));
      allMutations.push(updateMutation(tableName, primaryKey, foreignKeys, columns));
      allMutations.push(deleteMutation(tableName, primaryKey, columns));
    }
  }
  return allMutations;
}

function createMutation(tableName, primaryKey, foreignKeys, columns) {
  const createMutations = [];
  const mutationStr = MutationGenerator.createColumn(
    tableName,
    primaryKey,
    foreignKeys,
    columns
  );
  createMutations.push(mutationStr);
  return createMutations;
}

function updateMutation(tableName, primaryKey, foreignKeys, columns) {
  const updateMutations = [];
  const mutationStr = MutationGenerator.updateColumn(
    tableName,
    primaryKey,
    foreignKeys,
    columns
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
    `const Mutation = new GraphQL ObjectType({\n` +
    `  name: 'Mutation',\n` +
    `  fields: {` +
    `${mutations}` +
    `  },\n` +
    `});\n`
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
