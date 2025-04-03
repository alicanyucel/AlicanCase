import React, { useState } from 'react'; // useState import edilmeli
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native'; // Alert import edildi
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Ana Sayfa Bileşeni
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Ana Sayfa</Text>
      <Button title="Ürün Ekle" onPress={() => navigation.navigate('Product')} />
    </View>
  );
}

// Ürünler Sayfası Bileşeni
function ProductScreen() {
  const [materialName, setMaterialName] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    // Validasyon Kontrolleri
    if (!materialName || !stockCode || !quantity) {
      Alert.alert('Hata', 'Tüm alanları doldurun!');
      return;
    }

    const quantityNumber = parseInt(quantity);
    if (quantityNumber <= 0) {
      Alert.alert('Hata', 'Ürün adeti 0 dan küçük olamaz!');
      return;
    }

    // Burada veriyi işleyebilirsiniz, örneğin veritabanına kaydedebilirsiniz
    console.log('Ürün Adı:', materialName);
    console.log('Stok Kodu:', stockCode);
    console.log('Adet:', quantityNumber);
    Alert.alert('Başarı', 'Ürün başarıyla eklendi!');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Ürün Ekleme Formu</Text>

      {/* Ürün adı input */}
      <TextInput
        style={styles.input}
        placeholder="Ürün adı"
        value={materialName}
        onChangeText={setMaterialName}
      />

      {/* Stok kodu input */}
      <TextInput
        style={styles.input}
        placeholder="Stok kodu"
        value={stockCode}
        onChangeText={setStockCode}
      />

      {/* Adet input */}
      <TextInput
        style={styles.input}
        placeholder="Adet"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Ekle butonu */}
      <Button title="Ekle" onPress={handleSubmit} />
    </View>
  );
}

// Navigasyonu Tanımla
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Ürünler' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stil dosyası
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
});
