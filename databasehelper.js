
import SQLite from 'react-native-sqlite-storage';

class DatabaseHelper {
  constructor() {
    this.db = null;
    this.initDB();
  }

  initDB = () => {
    this.db = SQLite.openDatabase(
      { name: 'product_database.db', location: 'default' },
      this.successCallback,
      this.errorCallback
    );
  };

  successCallback = () => {
    console.log("Veritabanı başarıyla açıldı.");
    this.createTable();
  };

  errorCallback = (error) => {
    console.log("Veritabanı açma hatası: ", error);
  };

  createTable = () => {
    this.db.transaction((txn) => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, materialName TEXT, stockCode TEXT, quantity INTEGER)',
        [],
        () => {
          console.log("Tablo başarıyla oluşturuldu.");
        },
        (error) => {
          console.log("Tablo oluşturma hatası: ", error);
        }
      );
    });
  };

  // Ürün ekleme
  insertProduct = (product) => {
    const { materialName, stockCode, quantity } = product;
    this.db.transaction((txn) => {
      txn.executeSql(
        'INSERT INTO products (materialName, stockCode, quantity) VALUES (?, ?, ?)',
        [materialName, stockCode, quantity],
        (txn, result) => {
          console.log("Ürün başarıyla eklendi.");
        },
        (error) => {
          console.log("Ürün ekleme hatası: ", error);
        }
      );
    });
  };

  // Ürün güncelleme
  updateProduct = (product) => {
    const { id, materialName, stockCode, quantity } = product;
    this.db.transaction((txn) => {
      txn.executeSql(
        'UPDATE products SET materialName = ?, stockCode = ?, quantity = ? WHERE id = ?',
        [materialName, stockCode, quantity, id],
        () => {
          console.log("Ürün başarıyla güncellendi.");
        },
        (error) => {
          console.log("Ürün güncelleme hatası: ", error);
        }
      );
    });
  };

  // Ürün silme
  deleteProduct = (id) => {
    this.db.transaction((txn) => {
      txn.executeSql(
        'DELETE FROM products WHERE id = ?',
        [id],
        () => {
          console.log("Ürün başarıyla silindi.");
        },
        (error) => {
          console.log("Ürün silme hatası: ", error);
        }
      );
    });
  };

  // Ürün sayısını alma
  getProductCount = () => {
    return new Promise((resolve, reject) => {
      this.db.transaction((txn) => {
        txn.executeSql(
          'SELECT COUNT(*) as count FROM products',
          [],
          (txn, result) => {
            resolve(result.rows.item(0).count);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };

  // Ürünleri listeleme
  getProducts = () => {
    return new Promise((resolve, reject) => {
      this.db.transaction((txn) => {
        txn.executeSql(
          'SELECT * FROM products',
          [],
          (txn, result) => {
            let products = [];
            for (let i = 0; i < result.rows.length; i++) {
              products.push(result.rows.item(i));
            }
            resolve(products);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };

  // Ürün arama
  searchProducts = (query) => {
    return new Promise((resolve, reject) => {
      this.db.transaction((txn) => {
        txn.executeSql(
          'SELECT * FROM products WHERE materialName LIKE ? OR stockCode LIKE ?',
          [`%${query}%`, `%${query}%`],
          (txn, result) => {
            let products = [];
            for (let i = 0; i < result.rows.length; i++) {
              products.push(result.rows.item(i));
            }
            resolve(products);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };
}

export default DatabaseHelper;