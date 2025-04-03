import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'inventory.db', location: 'default' }, () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, materialName TEXT, stockCode TEXT, quantity INTEGER);',
      [],
      () => console.log('Table created successfully'),
      error => console.log('Error creating table', error)
    );
  });
}, error => console.log(error));

const App = () => {
  return (
    <TabNavigator />
  );
};

const TabNavigator = () => {
  const [selectedTab, setSelectedTab] = useState('Search');
  return (
    <View style={{ flex: 1 }}>
      {selectedTab === 'Search' && <SearchTab />}
      {selectedTab === 'List' && <ListTab />}
      {selectedTab === 'Summary' && <SummaryTab />}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setSelectedTab('Search')} style={styles.tabButton}><Text>Ürün Ara</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('List')} style={styles.tabButton}><Text>Liste</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Summary')} style={styles.tabButton}><Text>Toplam</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchProducts = (query) => {
    if (!query) return setSearchResults([]);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM products WHERE materialName LIKE ? OR stockCode LIKE ?',
        [`%${query}%`, `%${query}%`],
        (_, results) => {
          let rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          setSearchResults(rows);
        },
        error => console.log(error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Ara" value={searchQuery} onChangeText={searchProducts} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.materialName} ({item.stockCode}) - {item.quantity}</Text>}
      />
    </View>
  );
};

const ListTab = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM products', [], (_, results) => {
        let rows = [];
        for (let i = 0; i < results.rows.length; i++) {
          rows.push(results.rows.item(i));
        }
        setProducts(rows);
      });
    });
  };

  const deleteProduct = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM products WHERE id = ?', [id], () => fetchProducts());
    });
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text>{item.materialName} - {item.stockCode}</Text>
          <TouchableOpacity onPress={() => deleteProduct(item.id)}>
            <Text style={{ color: 'red' }}>Sil</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const SummaryTab = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT SUM(quantity) AS totalQuantity FROM products', [], (_, results) => {
        setTotalQuantity(results.rows.item(0).totalQuantity || 0);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>Toplam Ürün Miktarı: {totalQuantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  summaryText: { fontSize: 20, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderTopWidth: 1 },
  tabButton: { padding: 8 }
});

export default App;
