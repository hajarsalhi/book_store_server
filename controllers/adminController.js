import Command from '../models/command.js';


export const getSalesAnalytics = async (req, res) => {
  console.log('getSalesAnalytics called with timeRange:', req.query.timeRange);
  
  try {
    const { timeRange } = req.query;
    let dateFilter = {};
    
    // Calculate date range
    const now = new Date();
    if (timeRange === 'week') {
      dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeRange === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
    } else if (timeRange === 'year') {
      dateFilter = { createdAt: { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) } };
    }

    console.log('Fetching orders with filter:', dateFilter);

    // Get all completed orders within date range
    const orders = await Command.find({
      ...dateFilter,
      status: 'completed'
    });

    await Command.populate(orders, { path: 'items.book' });


    // If no orders found, return empty data
    if (!orders || orders.length === 0) {
      console.log('No orders found, returning empty data');
      return res.json({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        monthlySales: [],
        topSellingBooks: [],
        categorySales: []
      });
    }

    // Calculate total revenue and orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate monthly sales
    const monthlySales = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.revenue += order.totalAmount;
        existing.orders += 1;
      } else {
        acc.push({ date, revenue: order.totalAmount, orders: 1 });
      }
      return acc;
    }, []).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate top selling books
    const bookSales = {};

    await Command.populate(orders, { path: 'items.book' }); 
    
    orders.forEach(order => {
      order.items.forEach(item => {
      
        const book = item.book;

        if (!book) {
          console.log('Book not found for item:', item);
          return; // Skip if book is not found
        }
    
        if (!bookSales[book._id]) {
          bookSales[book._id] = {
            _id: book._id,
            title: book.title,
            salesCount: 0
          };
        }
    
        bookSales[book._id].salesCount += item.quantity;
      });
    });

    console.log("object :",Object.values(bookSales));

    const topSellingBooks = Object.values(bookSales)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);


    // Calculate sales by category
    const categorySales = {};
    await Command.populate(orders, { path: 'items.book' });

    orders.forEach(order => {
      order.items.forEach(item => {
        const book = item.book;

        if (!book) {
          console.log('Book not found for item:', item);
          return; // Skip if book is not found
        }

        const category = book.category || 'Uncategorized';
        if (!categorySales[category]) {
          categorySales[category] = { name: category, revenue: 0 };
        }
        categorySales[category].revenue += item.price * item.quantity;
      });
    });

    const categoryData = Object.values(categorySales)
      .sort((a, b) => b.revenue - a.revenue);

    const responseData = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      monthlySales,
      topSellingBooks,
      categorySales: categoryData
    };

    console.log('Sending response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Error in getSalesAnalytics:', error);
    res.status(500).json({ 
      message: 'Error generating sales analytics',
      error: error.message 
    });
  }
}; 