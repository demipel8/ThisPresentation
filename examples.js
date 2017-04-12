var members = [
  { name: 'Manel', origin : 'Barcelona' },
  { name: 'Raul', origin : 'Valencia' },
  { name: 'Demi', origin : 'Valencia' }
];

var is_from = function(origin) {
  return this.origin == origin;
}

var fromValencia = members.filter(function(member) {
  return is_from('Valencia', member);
});

console.log(fromValencia);