function toPascalCase(str) {
  return capitalize(toCamelCase(str));
}

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function toCamelCase(str) {
  let varName = str.toLowerCase();
  for (let i = 0, len = varName.length; i < len; i++) {
    const isSeparator = varName[i] === '-' || varName[i] === '_';
    if (varName[i + 1] && isSeparator) {
      const char = (i === 0) ? varName[i + 1] : varName[i + 1].toUpperCase();
      varName = varName.slice(0, i) + char + varName.slice(i + 2);
    } else if (isSeparator) {
      varName = varName.slice(0, i);
    }
  }
  return varName;
}
  
function typeSet(str) {
	switch (str) {
		case 'character varying':
			return 'String';
			break;
		case 'character':
			return 'String';
			break;
		case 'integer':
			return 'Int';
			break;
		case 'text':
			return 'String';
			break;
		case 'date':
			return 'String';
			break;
		case 'boolean':
			return 'Boolean';
			break;
		default: 
			return 'Int';
	}
}

function getPrimaryKeyType(primaryKey, columns) {
  return typeSet(columns[primaryKey].dataType);
}

module.exports = {
	capitalize,
  toPascalCase,
  toCamelCase,
	typeSet,
	getPrimaryKeyType
};