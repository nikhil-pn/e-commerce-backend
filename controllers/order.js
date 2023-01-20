const Order = require("../models/order");

exports.getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  const previousMonth = new Date(new Date().setMonth(lastMonth));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
  } catch (error) {
    res.status(500).json(err);
  }
};
