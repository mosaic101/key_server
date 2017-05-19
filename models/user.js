
module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('User', {
    username: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  })

  return User
}
