const eligibilityCriteria = {
  fep: {
    postcode: 'string', // fail if scotland
    dob: 'dd-mm-yyyy', // fail if under 18 I think... (can confirm)
  },
  bsp: {
    dob: 'dd-mm-yyyy', // or mm-dd-yyyy, whatever
    sex: 'male/female', // used to calc spa
    isSpouse: boolean,
  }
}

const fepQuestions =  {
  studentOrTraining: boolean, // this is only asked if claiment is age 16-19
  marriedCouple: boolean, // this is only asked if they have said false to spouse
  funeralDate: '', // this can be a date or no/false
  callerResponsible: boolean,
  funeralLocation: boolean,
  deceasedUkResident: boolean,
  qualifyingBenefits: [], // list of QB
};

const bspQuestions = {
  children: 'this is up in the air, may be boolean or string of cbol numbers'
};

// We need to send more data at time of sending the eligibly check but thats not part of the eligibility check