function TypeFactory() {
  if (!(this instanceof TypeFactory))
    return new TypeFactory();
}

/** Make a new object from a type defined in typeDef.type with config typeDef.config with typeLocation the path to the
 *  type file. **/
TypeFactory.prototype.init = function(typeDef, typeLocation) {
  var Type = require(typeLocation + typeDef.type);
  return new Type(typeDef.config);
};

Object.freeze(TypeFactory);
module.exports = new TypeFactory();