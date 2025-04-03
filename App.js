import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Product from './product'
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
const Stack = createStackNavigator();
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