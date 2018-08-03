const bspRelationships = ['wife', 'husband', 'civilpartner'];
// move relationships to be custom passed in and make isEligibleForFep and BSP the same.
/**
 * Takes data from Death notification and calculates whether they can proceed with BSP
 * @param {object} data
 */
const isEligibleForBsp = (data) => {
  const relationship = data['caller-relationship'] || '';
  const parsedRelationship = relationship.toLowerCase().replace(/(\s)|(-)/g, '').trim();
  const isCouple = bspRelationships.includes(parsedRelationship);
  return isCouple;
};
