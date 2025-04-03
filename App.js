import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Product from './product';

const Stack = createStackNavigator();
// burada ik sayfa olarak ekleme formu geelcek
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Product">
        <Stack.Screen
          name="Product"
          component={Product}
          options={{ title: 'Ürün Kayıt Formu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}