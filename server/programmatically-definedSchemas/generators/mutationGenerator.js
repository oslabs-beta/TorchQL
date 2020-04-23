const { singular } = require('pluralize');
const { capitalize } = require('../../SDL-definedSchemas/helpers/helperFunctions');
const { getDataType, getValsAndTypes } = require('../helpers/helperFunctions');

const MutationGenerator = {};

MutationGenerator.createColumn = (tableName, values, columns) => {
    const singleName = singular(tableName);
    const capSingle = capitalize(singleName);

    // Loops through args and gets the data type for each one then returns as a string
    /* To do: Account for non-nulls */
    const generateArgs = (values) => {
        const argsArray = [];
        const valsAndTypes = Object.entries(getValsAndTypes(columns));
        for(let i = 0; i < values.length; i += 1){
            const dataType = getDataType(valsAndTypes[i][1]);

            argsArray.push(`        ${values[i]}: { type: ${dataType} }`);
        };

        return '    ' + argsArray.join(', \n');
    };

    // Array of column names

    const valsArr = Object.values(values);
    const numCount = (valsArr) => {
        const numArr = [];
        for(let i = 0; i < valsArr.length; i += 1){
            numArr.push('$' + i);
        }
        return numArr;
    };
    return (
            `   add${capSingle}: {\n`
        +   `       type: ${capSingle}Type,\n`
        +   `       args: {\n`
        +   `           ${generateArgs(valsArr)}\n`
        +   `       },\n` 
        +   `       resolve(parent, args) {\n`     
        +   `           try {\n`   
        +   `               const query = \`INSERT INTO ${tableName}(${valsArr.join(', ')})\n`      
        +   `               VALUES(${numCount(valsArr).join(', ')})\`\n`
        +   `               const values = [${valsArr.map((val) => 'args.' + val).join(', ')}]\n`
        +   `               return db.query(query, values).then((res) => res.rows[0]);\n`
        +   `           } catch(err) {\n`
        +   `               throw new Error(err);\n`
        +   `             }\n`
        +   `           },\n`
        +   `       },`
    );
};

MutationGenerator.updateColumn = (tableName, values, primaryKey) => {
    const singleName = singular(tableName);
    const capSingle = capitalize(singleName);

    const generateArgs = (values) => {
        const argsArray = [];

        for (const value of values) {
            const dataType = getDataType(value);
            argsArray.push(`        ${value}: { type: ${dataType} }`);
        };

        return argsArray.join(', \n');
    };

    // Array of column names
    const valsArr = Object.values(values);
    const valsAndNums = (valsArr) => {
        const valsNumArr = [];
        for(let i = 1; i <= valsArr.length; i += 1){
            valsNumArr.push(`${valsArr[i]} = $${i}`);
        };
        return valsNumArr;
    };

    return (
            `   update${capSingle}: {\n`
        +   `       type: ${capSingle}Type,\n`
        +   `       args: {\n`
        +   `   ${generateArgs(valsArr)}\n`
        +   `       },\n`
        +   `       resolve(parent, args) {\n`
        +   `       try { \n`
        +   `           const query = \`UPDATE ${tableName}(${valsArr.join(', ')}) \n`
        +   `           SET(${valsAndNums(valsArr).join(', ')})\`\n`
        +   `           WHERE ${primaryKey} = ${valsArr.length}\n`
        +   `           const values = [${valsArr.map((val) => 'args.' + val).join(', ')}, args.${primaryKey}]\n`
        +   `           return db.query(query, values).then((res) => res.rows[0]);\n`
        +   `       } catch(err) {\n`
        +   `           throw new Error(err);\n`
        +   `           }\n`
        +   `       },\n`
        +   `   },\n`
    );
};

MutationGenerator.destroyColumn = (tableName, primaryKey, primaryKeyType) => {
    const singleName = singular(tableName);
    const capSingle = capitalize(singleName);

    return(
            `   delete${capSingle}: {\n`
        +   `       type: ${capSingle}Type,\n`
        +   `       args: {\n`
        +   `         ${primaryKey}: { type: newGraphQLNonNull(${primaryKeyType}) },\n`
        +   `       },\n`
        +   `       resolve(parent, args) {\n`
        +   `       try {\n`
        +   `         const query = \`DELETE FROM ${tableName}\n`
        +   `         WHERE ${primaryKey} = $1\`;\n`
        +   `         const values = [args.${primaryKey}]\n`
        +   `         return db.query(query, values).then((res) => res.rows[0]);\n`
        +   `       } catch(err) {\n`
        +   `           throw new Error(err)\n`
        +   `       }\n`
        +   `     },\n`
        +   `   },`
    );
};

module.exports = MutationGenerator;