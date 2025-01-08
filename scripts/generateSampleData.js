const sampleBooks = [
    {
      title: "The Shadow in the Attic",
      author: "Elena Martinez",
      description: "A gripping mystery novel about an old house's secrets",
      price: "24.99",
      stock: "50",
      category: "Mystery",
      isbn: "9781234567890",
      imageUrl: "https://example.com/shadow-attic.jpg"
    },
    {
      title: "Digital Revolution",
      author: "James Chen",
      description: "An exploration of how technology is reshaping our world",
      price: "29.99",
      stock: "75",
      category: "Technology",
      isbn: "9789876543210",
      imageUrl: "https://example.com/digital-rev.jpg"
    },
    {
      title: "Cooking with Herbs",
      author: "Maria Romano",
      description: "A comprehensive guide to cooking with fresh herbs",
      price: "19.99",
      stock: "100",
      category: "Cooking",
      isbn: "9784567891230",
      imageUrl: "https://example.com/herbs-cooking.jpg"
    },
    {
      title: "The Last Frontier",
      author: "Robert Space",
      description: "A science fiction epic about space exploration",
      price: "27.99",
      stock: "60",
      category: "Science Fiction",
      isbn: "9787891234560",
      imageUrl: "https://example.com/last-frontier.jpg"
    },
    {
      title: "Financial Freedom",
      author: "Sarah Williams",
      description: "Guide to personal finance and investment",
      price: "34.99",
      stock: "85",
      category: "Finance",
      isbn: "9783216549870",
      imageUrl: "https://example.com/finance.jpg"
    },
    {
      title: "Ancient Civilizations",
      author: "Dr. Michael Brown",
      description: "Exploring the mysteries of past civilizations",
      price: "39.99",
      stock: "45",
      category: "History",
      isbn: "9786543219870",
      imageUrl: "https://example.com/ancient-civ.jpg"
    },
    {
      title: "Modern Poetry Collection",
      author: "Various Authors",
      description: "A collection of contemporary poems",
      price: "22.99",
      stock: "30",
      category: "Poetry",
      isbn: "9789874563210",
      imageUrl: "https://example.com/poetry.jpg"
    },
    {
      title: "Healthy Living",
      author: "Dr. Lisa Johnson",
      description: "A guide to maintaining a healthy lifestyle",
      price: "26.99",
      stock: "90",
      category: "Health",
      isbn: "9782468135790",
      imageUrl: "https://example.com/healthy.jpg"
    },
    {
      title: "The Art of Photography",
      author: "Thomas Light",
      description: "Mastering the fundamentals of photography",
      price: "31.99",
      stock: "40",
      category: "Art",
      isbn: "9785432167890",
      imageUrl: "https://example.com/photography.jpg"
    },
    {
      title: "Business Strategy",
      author: "Mark Anderson",
      description: "Modern approaches to business management",
      price: "44.99",
      stock: "65",
      category: "Business",
      isbn: "9781597534682",
      imageUrl: "https://example.com/business.jpg"
    }
  ];
  
  // Generate Excel file
  import * as XLSX from 'xlsx';
  const ws = XLSX.utils.json_to_sheet(sampleBooks);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Books');
  XLSX.writeFile(wb, 'sample_books_upload.xlsx');