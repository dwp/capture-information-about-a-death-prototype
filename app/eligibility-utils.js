const checkRelationship = (relationship, validRelationships) => {
  if (typeof relationship !== 'string') {
    return false;
  }
  const callerRelationship = relationship.toLowerCase().replace(/\s/g, '');
  return validRelationships.includes(callerRelationship);
};

module.exports = {
  checkRelationship
}