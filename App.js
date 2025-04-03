import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Ana Sayfa</Text>
      <Button title="Ürün Ekle" onPress={() => navigation.navigate('Product')} />
    </View>
  );
}

function DashboardScreen({ navigation }) {
  const [products, setProducts] = useState([
    { id: '1', materialName: 'Ürün A', stockCode: 'A001', quantity: 10 },
    { id: '2', materialName: 'Ürün B', stockCode: 'B001', quantity: 20 },
    { id: '3', materialName: 'Ürün C', stockCode: 'C001', quantity: 30 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    Alert.alert('Silindi', 'Ürün başarıyla silindi!');
  };

  const handleRefresh = () => {
    setProducts([
      { id: '1', materialName: 'Ürün A', stockCode: 'A001', quantity: 10 },
      { id: '2', materialName: 'Ürün B', stockCode: 'B001', quantity: 20 },
      { id: '3', materialName: 'Ürün C', stockCode: 'C001', quantity: 30 },
    ]);
  };

  const handleUpdate = (product) => {
    navigation.navigate('UpdateProduct', { product });
  };

  const filteredProducts = products.filter(product =>
    product.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Ürünler Listesi</Text>
      <Button title="Yenile" onPress={handleRefresh} />
      <TextInput
        style={styles.input}
        placeholder="Ürün adı ile ara"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text>{`Ürün Adı: ${item.materialName}`}</Text>
            <Text>{`Stok Kodu: ${item.stockCode}`}</Text>
            <Text>{`Adet: ${item.quantity}`}</Text>
            <TouchableOpacity onPress={() => handleUpdate(item)}>
              <Text style={styles.updateButton}>Güncelle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButton}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text style={{ fontSize: 18, marginTop: 20 }}>Toplam Adet: {totalQuantity}</Text>
    </View>
  );
}

function ProductScreen({ navigation }) {
  const [materialName, setMaterialName] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    if (!materialName || !stockCode || !quantity) {
      Alert.alert('Hata', 'Tüm alanları doldurun!');
      return;
    }

    const quantityNumber = parseInt(quantity);
    if (quantityNumber <= 0) {
      Alert.alert('Hata', 'Ürün adeti 0 dan küçük olamaz!');
      return;
    }

    console.log('Ürün Adı:', materialName);
    console.log('Stok Kodu:', stockCode);
    console.log('Adet:', quantityNumber);
    Alert.alert('Başarı', 'Ürün başarıyla eklendi!');
    navigation.navigate('Dashboard');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Ürün Ekleme Formu</Text>
      <TextInput
        style={styles.input}
        placeholder="Ürün adı"
        value={materialName}
        onChangeText={setMaterialName}
      />
      <TextInput
        style={styles.input}
        placeholder="Stok kodu"
        value={stockCode}
        onChangeText={setStockCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Adet"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Ekle" onPress={handleSubmit} />
    </View>
  );
}

function UpdateProductScreen({ route, navigation }) {
  const { product } = route.params;
  const [materialName, setMaterialName] = useState(product.materialName);
  const [stockCode, setStockCode] = useState(product.stockCode);
  const [quantity, setQuantity] = useState(product.quantity.toString());

  const handleUpdate = () => {
    if (!materialName || !stockCode || !quantity) {
      Alert.alert('Hata', 'Tüm alanları doldurun!');
      return;
    }

    const quantityNumber = parseInt(quantity);
    if (quantityNumber <= 0) {
      Alert.alert('Hata', 'Ürün adeti 0 dan küçük olamaz!');
      return;
    }

    console.log('Güncellenmiş Ürün Adı:', materialName);
    console.log('Güncellenmiş Stok Kodu:', stockCode);
    console.log('Güncellenmiş Adet:', quantityNumber);
    Alert.alert('Başarı', 'Ürün başarıyla güncellendi!');
    navigation.navigate('Dashboard');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Ürün Güncelleme Formu</Text>
      <TextInput
        style={styles.input}
        placeholder="Ürün adı"
        value={materialName}
        onChangeText={setMaterialName}
      />
      <TextInput
        style={styles.input}
        placeholder="Stok kodu"
        value={stockCode}
        onChangeText={setStockCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Adet"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Güncelle" onPress={handleUpdate} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Ürünler' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="UpdateProduct" component={UpdateProductScreen} options={{ title: 'Ürün Güncelle' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 18,
  },
  productContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  updateButton: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});
