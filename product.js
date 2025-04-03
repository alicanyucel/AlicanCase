import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase(
  { name: 'inventory.db', location: 'default' },
  () => console.log('Veritabanı bağlantısı başarılı'),
  (error) => console.log('Veritabanı bağlantısı hatası: ', error)
);

const Product = () => {
  const navigation = useNavigation();
  
  const [materialName, setMaterialName] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [quantity, setQuantity] = useState('');

  const insertProduct = (product) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO products (materialName, stockCode, quantity) VALUES (?, ?, ?)',
          [product.materialName, product.stockCode, product.quantity],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  };

  const handleSubmit = async () => {
    if (!materialName || !stockCode || !quantity) {
      Alert.alert('Error', 'Tüm istenilenleri doldurun');
      return;
    }

    const quantityNumber = parseInt(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      Alert.alert('Error', '0 dan büyük bir sayı girin');
      return;
    }

    const product = {
      materialName,
      stockCode,
      quantity: quantityNumber,
    };

    try {
      await insertProduct(product);
      console.log('Ürün eklendi:', product);

      Alert.alert('Success', 'Ürün başarıyla eklendi');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', `Hata: ${error.message}`);
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, materialName TEXT, stockCode TEXT, quantity INTEGER);'
      );
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ürün Ekleme Formu</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ürün adını giriniz"
        value={materialName}
        onChangeText={setMaterialName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Stok kodunu giriniz"
        value={stockCode}
        onChangeText={setStockCode}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Adet giriniz"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      
      <Button title="Ekle" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 18,
  },
});

export default Product;