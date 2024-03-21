const { Op } = require('sequelize')
const converter = (filters) => {
  const filters2 = {}
  filters.forEach((f) => {
    console.log(f);
    console.log(f.operatorValue);
    console.log(f.columnField);
    console.log(f.value);
    switch (f.operatorValue) {
      case 'equals':
        filters2[f.columnField] = { [Op.eq]: f.value }
        break
      case 'ne':
        filters2[f.columnField] = { [Op.ne]: f.value }
        break
      case 'is':
        filters2[f.columnField] = { [Op.is]: f.value }
        break
      case 'isNot':
        filters2[f.columnField] = { [Op.not]: f.value }
        break
      
      case 'isAfter':
        filters2[f.columnField] = { [Op.gt]: f.value }
        break
      case 'isOnOrAfter':
        filters2[f.columnField] = { [Op.gte]: f.value }
        break
      case 'isBefore':
        filters2[f.columnField] = { [Op.lt]: f.value }
        break
      case 'isOnOrBefore':
        filters2[f.columnField] = { [Op.lte]: f.value }
        break
      case 'isEmpty':
        filters2[f.columnField] = { [Op.is]: null }
        break
      case 'isNotEmpty':
        filters2[f.columnField] = { [Op.not]: null }
        break
      case '=':
        filters2[f.columnField] = { [Op.eq]: f.value }
        break
      case '!=':
        filters2[f.columnField] = { [Op.ne]: f.value }
        break
      case '>':
        filters2[f.columnField] = { [Op.gt]: f.value }
        break
      case '>=':
        filters2[f.columnField] = { [Op.gte]: f.value }
        break
      case '<':
        filters2[f.columnField] = { [Op.lt]: f.value }
        break
      case '<=':
        filters2[f.columnField] = { [Op.lte]: f.value }
        break
      case 'isAnyOf':
        filters2[f.columnField] = { [Op.in]: f.value }
        break
      case 'between':
        filters2[f.columnField] = { [Op.between]: f.value }
        break
      case 'contains':
        filters2[f.columnField] = { [Op.substring]: f.value }
        break
      case 'startsWith':
        console.log('object');
        filters2[f.columnField] = {[Op.startsWith]: f.value}
        break;
      case 'endsWith':
        filters2[f.columnField] = {[Op.endsWith]: f.value}
        break;
    }
  })
  console.log(filters2);
  return filters2
}

function transformData(data) {
  const transformed = data.map(item => {
    return {
      id: item[0],
      classification: item[1],
      nbMateriels: parseInt(item[2]),
      nbSalaries: parseInt(item[3]),
      budget: parseInt(item[4]),
      dateDepot: parseInt(item[5]),
      cahierDesCharges: item[6],
      state: parseInt(item[7]) === 0 ? "en attente" :  parseInt(item[7]) === 1 ? "evalué" : "terminé",
      owner: parseInt(item[8]),
      lotId: parseInt(item[9]),
      addresses: {
        offreOwnerAddress: item[10][0],
        evaluateurAddress: item[10][1],
        ownerAddress: item[10][2],
        adminAddress: item[10][3],
      },
      evaluation: {
        classification: parseInt(item[11][0]),
        nbMateriels: parseInt(item[11][1]),
        nbSalaries: parseInt(item[11][2]),
        budget: parseInt(item[11][3]),
        qualTech: parseInt(item[11][4]),
      },
    };
  });

  return transformed;
}

module.exports = { converter, transformData }