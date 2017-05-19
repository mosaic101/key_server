
module.exports = function(sequelize, DataTypes) {
  let Task = sequelize.define('Task', {
    title: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        Task.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })

  return Task
}
